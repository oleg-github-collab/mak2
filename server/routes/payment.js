/**
 * Payment routes for LiqPay integration
 */

const express = require('express');
const router = express.Router();
const liqpay = require('../utils/liqpay');
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
 * Create payment and return LiqPay data
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

        // Create description
        const description = `Передзамовлення МАК Roots & Wings (${quantity} шт.)`;

        // Create payment
        const paymentData = liqpay.createPayment(
            orderId,
            amount,
            description,
            email,
            process.env.CURRENCY || 'UAH'
        );

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

        logger.info(`Payment created for order ${orderId}, amount: ${amount} UAH`);

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
 * Handle LiqPay callback
 */
router.post('/callback', async (req, res) => {
    try {
        const { data, signature } = req.body;

        // Verify signature
        if (!liqpay.verifySignature(data, signature)) {
            logger.error('Invalid signature in callback');
            return res.status(400).send('Invalid signature');
        }

        // Decode payment data
        const paymentData = liqpay.decodeData(data);

        if (!paymentData) {
            logger.error('Failed to decode payment data');
            return res.status(400).send('Invalid data');
        }

        logger.info(`Payment callback received for order ${paymentData.order_id}, status: ${paymentData.status}`);

        // Update order status
        const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
        const orderIndex = orders.findIndex(o => o.orderId === paymentData.order_id);

        if (orderIndex !== -1) {
            orders[orderIndex].status = paymentData.status;
            orders[orderIndex].paymentId = paymentData.payment_id;
            orders[orderIndex].updatedAt = new Date().toISOString();
            orders[orderIndex].liqpayData = paymentData;

            fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

            // If payment successful, send notification and update sheets
            if (paymentData.status === 'success' || paymentData.status === 'sandbox') {
                const orderData = orders[orderIndex];

                // Send email to admin
                await sendOrderNotification(orderData);

                // Send updated status to Google Sheets
                try {
                    await sendOrderToSheets({
                        ...orderData,
                        status: paymentData.status,
                        paymentId: paymentData.payment_id
                    });
                } catch (error) {
                    logger.error('Failed to update order status in Google Sheets:', error);
                }

                logger.info(`Payment successful for order ${paymentData.order_id}`);
            }
        }

        res.send('OK');

    } catch (error) {
        logger.error('Error processing callback:', error);
        res.status(500).send('Internal server error');
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
