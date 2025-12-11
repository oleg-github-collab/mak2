/**
 * LiqPay utility for payment processing
 */

const crypto = require('crypto');
const logger = require('./logger');

class LiqPay {
    constructor(publicKey, privateKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    /**
     * Generate base64 encoded data
     */
    cnbData(params) {
        return Buffer.from(JSON.stringify(params)).toString('base64');
    }

    /**
     * Generate signature
     */
    cnbSignature(data) {
        const signString = this.privateKey + data + this.privateKey;
        return crypto
            .createHash('sha1')
            .update(signString)
            .digest('base64');
    }

    /**
     * Create payment form data
     */
    cnbForm(params) {
        const data = this.cnbData(params);
        const signature = this.cnbSignature(data);

        return {
            data: data,
            signature: signature
        };
    }

    /**
     * Verify callback signature
     */
    verifySignature(data, signature) {
        const expectedSignature = this.cnbSignature(data);
        return signature === expectedSignature;
    }

    /**
     * Decode callback data
     */
    decodeData(data) {
        try {
            const decoded = Buffer.from(data, 'base64').toString('utf8');
            return JSON.parse(decoded);
        } catch (error) {
            logger.error('Error decoding LiqPay data:', error);
            return null;
        }
    }

    /**
     * Create payment parameters
     */
    createPayment(orderId, amount, description, email, currency = 'UAH') {
        const params = {
            public_key: this.publicKey,
            version: '3',
            action: 'pay',
            amount: amount,
            currency: currency,
            description: description,
            order_id: orderId,
            result_url: `${process.env.SITE_URL}/success`,
            server_url: `${process.env.SERVER_URL}/payment/callback`,
            language: 'uk'
        };

        if (email) {
            params.customer = email;
        }

        return this.cnbForm(params);
    }
}

// Create singleton instance
const liqpay = new LiqPay(
    process.env.LIQPAY_PUBLIC_KEY,
    process.env.LIQPAY_PRIVATE_KEY
);

module.exports = liqpay;
