/**
 * Google Sheets integration for storing orders
 */

const { google } = require('googleapis');
const logger = require('./logger');

// Initialize Google Sheets API
let sheets = null;
let auth = null;

/**
 * Initialize Google Sheets API with service account
 */
async function initSheetsAPI() {
    // Skip if credentials not provided
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.GOOGLE_SHEET_ID) {
        logger.warn('⚠️ Google Sheets credentials not found - sheets integration disabled');
        return false;
    }

    try {
        // Parse service account credentials from environment variable
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

        auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        sheets = google.sheets({ version: 'v4', auth });
        logger.info('✅ Google Sheets API initialized successfully');
        return true;
    } catch (error) {
        logger.error('❌ Error initializing Google Sheets API:', error.message);
        return false;
    }
}

/**
 * Add order to Google Sheets
 */
async function addOrderToSheet(orderData) {
    try {
        // Initialize if not already done
        if (!sheets) {
            const initialized = await initSheetsAPI();
            if (!initialized) {
                logger.warn(`Order #${orderData.orderId} not saved to Google Sheets - API not initialized`);
                return false;
            }
        }

        const spreadsheetId = process.env.GOOGLE_SHEET_ID;
        const range = 'Orders!A:K'; // Adjust range based on your sheet structure

        // Prepare row data
        const values = [[
            new Date().toLocaleString('uk-UA'), // Дата
            orderData.orderId,                   // ID замовлення
            orderData.name,                      // Ім'я
            orderData.email,                     // Email
            orderData.phone,                     // Телефон
            orderData.address,                   // Адреса
            orderData.quantity,                  // Кількість
            orderData.amount,                    // Сума
            orderData.status,                    // Статус
            orderData.comment || '',             // Коментар
            orderData.paymentId || ''            // ID платежу
        ]];

        const request = {
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: { values }
        };

        const response = await sheets.spreadsheets.values.append(request);
        logger.info(`📊 Order #${orderData.orderId} added to Google Sheets`);
        return response.data;

    } catch (error) {
        logger.error('❌ Error adding order to Google Sheets:', error.message);
        return false;
    }
}

/**
 * Update order status in Google Sheets
 */
async function updateOrderStatus(orderId, status, paymentId) {
    try {
        if (!sheets) {
            await initSheetsAPI();
        }

        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // First, find the row with this orderId
        const getResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Orders!A:K'
        });

        const rows = getResponse.data.values;
        let rowIndex = -1;

        // Find the row (skip header row)
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][1] === orderId) { // Column B (index 1) is orderId
                rowIndex = i + 1; // +1 because sheets are 1-indexed
                break;
            }
        }

        if (rowIndex === -1) {
            logger.warn(`Order ${orderId} not found in Google Sheets`);
            return null;
        }

        // Update status (column I) and paymentId (column K)
        const updateRequests = [
            {
                range: `Orders!I${rowIndex}`,
                values: [[status]]
            },
            {
                range: `Orders!K${rowIndex}`,
                values: [[paymentId || '']]
            }
        ];

        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId,
            resource: {
                valueInputOption: 'RAW',
                data: updateRequests
            }
        });

        logger.info(`Order ${orderId} status updated to ${status} in Google Sheets`);
        return true;

    } catch (error) {
        logger.error('Error updating order status in Google Sheets:', error);
        throw error;
    }
}

module.exports = {
    initSheetsAPI,
    addOrderToSheet,
    updateOrderStatus
};
