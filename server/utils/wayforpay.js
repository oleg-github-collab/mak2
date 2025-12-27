/**
 * WayForPay utility for payment processing
 * Documentation: https://wiki.wayforpay.com/
 */

const crypto = require('crypto');
const logger = require('./logger');

class WayForPay {
    constructor(merchantAccount, merchantSecretKey) {
        this.merchantAccount = merchantAccount;
        this.merchantSecretKey = merchantSecretKey;
        this.apiUrl = 'https://secure.wayforpay.com/pay';
    }

    /**
     * Generate HMAC-MD5 signature for WayForPay
     * @param {Array} values - Array of values to sign in specific order
     * @returns {string} - HMAC-MD5 signature
     */
    generateSignature(values) {
        const signString = values.join(';');
        return crypto
            .createHmac('md5', this.merchantSecretKey)
            .update(signString)
            .digest('hex');
    }

    /**
     * Create payment form data for WayForPay
     * @param {Object} orderData - Order information
     * @returns {Object} - Payment form data
     */
    createPayment(orderData) {
        const {
            orderId,
            amount,
            currency = 'UAH',
            productName,
            productCount = 1,
            productPrice,
            clientFirstName = '',
            clientLastName = '',
            clientEmail = '',
            clientPhone = '',
            merchantDomainName = process.env.MERCHANT_DOMAIN || 'localhost'
        } = orderData;

        // Convert to timestamp (Unix time in seconds)
        const orderDate = Math.floor(Date.now() / 1000);

        // Ensure product arrays are always arrays
        const productNames = Array.isArray(productName) ? productName : [productName];
        const productCounts = Array.isArray(productCount) ? productCount : [productCount];
        const productPrices = Array.isArray(productPrice) ? productPrice : [productPrice];

        // Build signature string according to WayForPay specification
        const signatureParams = [
            this.merchantAccount,
            merchantDomainName,
            orderId,
            orderDate.toString(),
            amount.toString(),
            currency,
            ...productNames,
            ...productCounts.map(c => c.toString()),
            ...productPrices.map(p => p.toString())
        ];

        const merchantSignature = this.generateSignature(signatureParams);

        // Prepare payment form data
        const paymentData = {
            merchantAccount: this.merchantAccount,
            merchantDomainName: merchantDomainName,
            orderReference: orderId,
            orderDate: orderDate,
            amount: amount,
            currency: currency,
            productName: productNames,
            productCount: productCounts,
            productPrice: productPrices,
            merchantSignature: merchantSignature,
            returnUrl: `${process.env.SITE_URL || 'http://localhost:3000'}/success`,
            serviceUrl: `${process.env.SERVER_URL || 'http://localhost:3000'}/api/payment/callback`
        };

        // Add optional client information if provided
        if (clientFirstName) paymentData.clientFirstName = clientFirstName;
        if (clientLastName) paymentData.clientLastName = clientLastName;
        if (clientEmail) paymentData.clientEmail = clientEmail;
        if (clientPhone) paymentData.clientPhone = clientPhone;

        // Always set language to Ukrainian
        paymentData.language = 'UA';

        logger.info('💳 Created WayForPay payment data', {
            orderId,
            amount,
            currency,
            products: productNames.length
        });

        return {
            url: this.apiUrl,
            data: paymentData
        };
    }

    /**
     * Verify callback signature from WayForPay
     * @param {Object} data - Callback data from WayForPay
     * @returns {boolean} - True if signature is valid
     */
    verifyCallback(data) {
        const {
            merchantSignature,
            orderReference,
            amount,
            currency,
            authCode,
            cardPan,
            transactionStatus,
            reasonCode
        } = data;

        // Build signature string for callback verification
        const signatureParams = [
            orderReference,
            amount.toString(),
            currency,
            authCode || '',
            cardPan || '',
            transactionStatus,
            reasonCode || ''
        ];

        const expectedSignature = this.generateSignature(signatureParams);

        const isValid = merchantSignature === expectedSignature;

        if (!isValid) {
            logger.warn('⚠️ Invalid WayForPay callback signature', {
                orderReference,
                expected: expectedSignature,
                received: merchantSignature
            });
        }

        return isValid;
    }

    /**
     * Check if payment was successful
     * @param {Object} callbackData - Callback data from WayForPay
     * @returns {boolean} - True if payment is approved
     */
    isPaymentApproved(callbackData) {
        return callbackData.transactionStatus === 'Approved';
    }

    /**
     * Generate HTML form for payment redirect
     * @param {Object} orderData - Order information
     * @returns {string} - HTML form
     */
    generatePaymentForm(orderData) {
        const payment = this.createPayment(orderData);

        let formHtml = `<form id="wayforpay-form" method="POST" action="${payment.url}" accept-charset="utf-8">`;

        for (const [key, value] of Object.entries(payment.data)) {
            if (Array.isArray(value)) {
                value.forEach(item => {
                    formHtml += `<input type="hidden" name="${key}[]" value="${item}" />`;
                });
            } else {
                formHtml += `<input type="hidden" name="${key}" value="${value}" />`;
            }
        }

        formHtml += `<button type="submit">Оплатити</button></form>`;
        formHtml += `<script>document.getElementById('wayforpay-form').submit();</script>`;

        return formHtml;
    }
}

// Create singleton instance
const wayforpay = new WayForPay(
    process.env.WAYFORPAY_MERCHANT_ACCOUNT,
    process.env.WAYFORPAY_SECRET_KEY
);

module.exports = wayforpay;
