/**
 * Google Sheets integration via Apps Script Web App
 * Simplified version that doesn't require service account credentials
 */

const logger = require('./logger');

/**
 * Send order data to Google Apps Script Web App
 */
async function sendOrderToSheets(orderData) {
    const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!APPS_SCRIPT_URL) {
        logger.warn('⚠️ GOOGLE_APPS_SCRIPT_URL not configured - Google Sheets integration disabled');
        return false;
    }

    try {
        const fetch = (await import('node-fetch')).default;

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
            redirect: 'follow' // Important for Apps Script redirects
        });

        const result = await response.json();

        if (result.status === 'success') {
            logger.info(`📊 Замовлення успішно відправлено в Google Sheets (Order #${result.orderNumber || 'N/A'})`);
            return result;
        } else {
            logger.error(`❌ Помилка Google Sheets: ${result.message}`);
            return false;
        }

    } catch (error) {
        logger.error('❌ Помилка відправки в Google Sheets:', error.message);
        return false;
    }
}

module.exports = {
    sendOrderToSheets
};
