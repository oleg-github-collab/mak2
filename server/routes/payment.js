/**
 * Payment routes for WayForPay integration
 */

const express = require('express');
const router = express.Router();
const wayforpay = require('../utils/wayforpay');
const { sendOrderNotification } = require('../utils/email');
const { sendOrderToSheets } = require('../utils/sheets');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Store orders in a JSON file (in production, use a database)
const ordersFile = path.join(__dirname, '../data/orders.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure orders file exists
if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
}

/**
 * Save order to file
 */
function saveOrder(orderData) {
    try {
        const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
        orders.push(orderData);
        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
        logger.info(`Order saved: ${orderData.orderId}`);
    } catch (error) {
        logger.error('Error saving order:', error);
    }
}

/**
 * Generate unique order ID
 */
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `RW${timestamp}${random}`;
}

/**
 * POST /api/payment/create
 * Create payment and return WayForPay data
 */
router.post('/create', async (req, res) => {
    try {
        const { name, email, phone, address, quantity, comment } = req.body;

        // Validation
        if (!name || !email || !phone || !address || !quantity) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        // Calculate amount
        const pricePerItem = parseInt(process.env.PRICE_PER_ITEM) || 1500;
        const amount = quantity * pricePerItem;

        // Generate order ID
        const orderId = generateOrderId();

        // Split name into first and last name
        const nameParts = name.trim().split(' ');
        const clientFirstName = nameParts[0] || '';
        const clientLastName = nameParts.slice(1).join(' ') || '';

        // Create payment with WayForPay
        const paymentData = wayforpay.createPayment({
            orderId: orderId,
            amount: amount,
            currency: process.env.CURRENCY || 'UAH',
            productName: `МАК "Roots & Wings"`,
            productCount: quantity,
            productPrice: pricePerItem,
            clientFirstName: clientFirstName,
            clientLastName: clientLastName,
            clientEmail: email,
            clientPhone: phone
        });

        // Save order data (status: pending)
        const orderData = {
            orderId,
            name,
            email,
            phone,
            address,
            quantity,
            amount,
            comment: comment || '',
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        saveOrder(orderData);

        // Send to Google Sheets via Apps Script
        try {
            await sendOrderToSheets(orderData);
        } catch (error) {
            logger.error('Failed to send order to Google Sheets (continuing anyway):', error);
        }

        logger.info(`💳 Payment created for order ${orderId}, amount: ${amount} UAH`);

        res.json({
            success: true,
            orderId,
            payment: paymentData
        });

    } catch (error) {
        logger.error('Error creating payment:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

/**
 * POST /api/payment/callback
 * Handle WayForPay callback
 */
router.post('/callback', async (req, res) => {
    try {
        const callbackData = req.body;

        logger.info('📥 WayForPay callback received:', {
            orderReference: callbackData.orderReference,
            transactionStatus: callbackData.transactionStatus
        });

        // Verify signature
        if (!wayforpay.verifyCallback(callbackData)) {
            logger.error('❌ Invalid signature in WayForPay callback');
            return res.status(400).json({
                orderReference: callbackData.orderReference,
                status: 'decline',
                reason: 'Invalid signature',
                time: Math.floor(Date.now() / 1000)
            });
        }

        const { orderReference, transactionStatus, amount, currency, authCode, cardPan, reasonCode, reason } = callbackData;

        // Update order status
        const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
        const orderIndex = orders.findIndex(o => o.orderId === orderReference);

        if (orderIndex !== -1) {
            const previousStatus = orders[orderIndex].status;

            // Map WayForPay status to our internal status
            let internalStatus = 'pending';
            if (transactionStatus === 'Approved') {
                internalStatus = 'success';
            } else if (transactionStatus === 'Declined' || transactionStatus === 'Refunded') {
                internalStatus = 'failed';
            }

            orders[orderIndex].status = internalStatus;
            orders[orderIndex].transactionStatus = transactionStatus;
            orders[orderIndex].authCode = authCode;
            orders[orderIndex].cardPan = cardPan;
            orders[orderIndex].reasonCode = reasonCode;
            orders[orderIndex].reason = reason;
            orders[orderIndex].updatedAt = new Date().toISOString();
            orders[orderIndex].wayforpayData = callbackData;

            fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

            // If payment successful, send notification and update sheets
            if (wayforpay.isPaymentApproved(callbackData)) {
                const orderData = orders[orderIndex];

                logger.info(`✅ Payment successful for order ${orderReference}`);

                // Send email to admin
                try {
                    await sendOrderNotification(orderData);
                } catch (error) {
                    logger.error('Failed to send email notification:', error);
                }

                // Send updated status to Google Sheets
                try {
                    await sendOrderToSheets({
                        ...orderData,
                        status: 'success',
                        transactionStatus: transactionStatus,
                        authCode: authCode
                    });
                } catch (error) {
                    logger.error('Failed to update order status in Google Sheets:', error);
                }
            } else {
                logger.warn(`⚠️ Payment declined for order ${orderReference}: ${reason || reasonCode}`);
            }
        } else {
            logger.warn(`⚠️ Order not found: ${orderReference}`);
        }

        // Respond to WayForPay with required format
        res.json({
            orderReference: orderReference,
            status: 'accept',
            time: Math.floor(Date.now() / 1000)
        });

    } catch (error) {
        logger.error('Error processing WayForPay callback:', error);
        res.status(500).json({
            orderReference: req.body.orderReference || 'unknown',
            status: 'decline',
            reason: 'Internal server error',
            time: Math.floor(Date.now() / 1000)
        });
    }
});

/**
 * GET /api/payment/orders
 * Get all orders (admin only - add authentication in production)
 */
router.get('/orders', (req, res) => {
    try {
        const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
        res.json(orders);
    } catch (error) {
        logger.error('Error reading orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/payment/order/:id
 * Get specific order by ID
 */
router.get('/order/:id', (req, res) => {
    try {
        const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
        const order = orders.find(o => o.orderId === req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        logger.error('Error reading order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
