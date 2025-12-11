/**
 * Email utility for sending order notifications
 */

const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create reusable transporter
const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Send order notification to admin
 */
async function sendOrderNotification(orderData) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: `🎉 Нове замовлення #${orderData.orderId}`,
        html: `
            <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background: linear-gradient(135deg, #2c3e50, #34495e); padding: 30px; border-radius: 10px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0;">Roots & Wings</h1>
                    <p style="color: #e67e22; font-size: 18px; margin: 10px 0 0 0;">Нове передзамовлення!</p>
                </div>

                <div style="background-color: #ffffff; padding: 30px; margin-top: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #2c3e50; border-bottom: 2px solid #e67e22; padding-bottom: 10px;">Деталі замовлення</h2>

                    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #2c3e50;">Номер замовлення:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666;">#${orderData.orderId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #2c3e50;">Ім'я:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666;">${orderData.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #2c3e50;">Email:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666;">${orderData.email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #2c3e50;">Телефон:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666;">${orderData.phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #2c3e50;">Адреса доставки:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666;">${orderData.address}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #2c3e50;">Кількість:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666;">${orderData.quantity} шт.</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #2c3e50;">Сума:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #e67e22; font-weight: bold; font-size: 18px;">${orderData.amount} грн</td>
                        </tr>
                        ${orderData.comment ? `
                        <tr>
                            <td style="padding: 10px; font-weight: bold; color: #2c3e50;">Коментар:</td>
                            <td style="padding: 10px; color: #666666;">${orderData.comment}</td>
                        </tr>
                        ` : ''}
                    </table>

                    <div style="margin-top: 30px; padding: 20px; background-color: #f0f8ff; border-left: 4px solid #e67e22; border-radius: 5px;">
                        <p style="margin: 0; color: #2c3e50;">
                            <strong>Статус оплати:</strong>
                            <span style="color: #2ecc71; font-weight: bold;">${orderData.status === 'success' ? 'Оплачено ✓' : 'В обробці'}</span>
                        </p>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 20px; color: #999999; font-size: 12px;">
                    <p>Це автоматичне повідомлення від системи Roots & Wings</p>
                    <p>Дата: ${new Date().toLocaleString('uk-UA')}</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Order notification sent for order #${orderData.orderId}`);
        return true;
    } catch (error) {
        logger.error('Error sending order notification:', error);
        return false;
    }
}

module.exports = {
    sendOrderNotification
};
