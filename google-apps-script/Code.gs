/**
 * МАК "Коріння та Крила" - CRM система
 * Google Apps Script для обробки замовлень
 *
 * Автоматично:
 * - Записує замовлення в таблицю
 * - Відправляє email сповіщення
 * - Форматує та валідує дані
 */

// =============== НАЛАШТУВАННЯ ===============
const CONFIG = {
  SHEET_NAME: "Замовлення",
  EMAIL_TO: ["rootswings25@gmail.com", "work.olegkaminskyi@gmail.com"],
  PRICE_PREORDER: 999,
  PRICE_REGULAR: 1239
};

// =============== ОСНОВНА ФУНКЦІЯ ОБРОБКИ ФОРМИ ===============
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    const data = JSON.parse(e.postData.contents);

    // Валідація даних
    if (!data.name || !data.phone || !data.email) {
      throw new Error("Обов'язкові поля не заповнені");
    }

    // Отримуємо наступний номер замовлення
    const orderNumber = getNextOrderNumber(sheet);

    // Додати рядок у таблицю
    const rowData = [
      orderNumber,                           // A: № замовлення
      new Date(),                            // B: Дата/Час
      data.name || '',                       // C: Ім'я
      data.phone || '',                      // D: Телефон
      data.email || '',                      // E: Email
      data.city || '',                       // F: Місто
      data.branch || '',                     // G: Відділення НП
      data.comment || '',                    // H: Коментар
      data.accept_terms ? 'Так' : 'Ні',     // I: Умови прийнято
      'Нове',                                // J: Статус
      CONFIG.PRICE_PREORDER,                 // K: Ціна (грн)
      '',                                    // L: Трек-номер
      '',                                    // M: Примітки
      data.utm_source || '',                 // N: UTM Source
      data.utm_medium || '',                 // O: UTM Medium
      data.utm_campaign || ''                // P: UTM Campaign
    ];

    const row = sheet.appendRow(rowData);
    const lastRow = sheet.getLastRow();

    // Форматування нового рядка
    formatNewRow(sheet, lastRow);

    // Надіслати email сповіщення
    sendEmailNotification(data, orderNumber);

    // Логування успіху
    Logger.log(`✅ Замовлення #${orderNumber} успішно оброблено`);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Замовлення отримано',
      orderNumber: orderNumber
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('❌ Помилка: ' + error.toString());

    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// =============== ДОПОМІЖНІ ФУНКЦІЇ ===============

/**
 * Отримує наступний номер замовлення
 */
function getNextOrderNumber(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 1; // Перше замовлення

  const lastOrderNumber = sheet.getRange(lastRow, 1).getValue();
  return (lastOrderNumber || 0) + 1;
}

/**
 * Форматує новий рядок у таблиці
 */
function formatNewRow(sheet, row) {
  // Форматування дати
  sheet.getRange(row, 2).setNumberFormat("dd.mm.yyyy hh:mm");

  // Форматування телефону
  sheet.getRange(row, 4).setNumberFormat("@STRING@");

  // Форматування ціни
  sheet.getRange(row, 11).setNumberFormat("#,##0\" грн\"");

  // Колір фону для нового замовлення (світло-жовтий)
  sheet.getRange(row, 1, 1, 16).setBackground("#FFF9C4");

  // Жирний шрифт для номера замовлення
  sheet.getRange(row, 1).setFontWeight("bold");

  // Вирівнювання
  sheet.getRange(row, 1).setHorizontalAlignment("center"); // № замовлення
  sheet.getRange(row, 2).setHorizontalAlignment("center"); // Дата
  sheet.getRange(row, 10).setHorizontalAlignment("center"); // Статус
  sheet.getRange(row, 11).setHorizontalAlignment("right");  // Ціна
}

/**
 * Відправка email сповіщення
 */
function sendEmailNotification(data, orderNumber) {
  const subject = `🎨 Нове замовлення #${orderNumber}: МАК "Коріння та Крила"`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2c5f4f 0%, #4a7c59 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .order-number { background: #fff; color: #2c5f4f; display: inline-block; padding: 5px 15px; border-radius: 20px; margin-top: 10px; font-weight: bold; }
        .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        .info-block { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2c5f4f; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #2c5f4f; display: inline-block; width: 180px; }
        .value { color: #555; }
        .price-block { background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .price { font-size: 32px; font-weight: bold; color: #2c5f4f; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #666; font-size: 12px; }
        .emoji { font-size: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1><span class="emoji">✨</span> Нове передзамовлення!</h1>
          <div class="order-number">Замовлення #${orderNumber}</div>
        </div>

        <div class="content">
          <div class="info-block">
            <h3 style="margin-top: 0; color: #2c5f4f;"><span class="emoji">👤</span> Дані клієнта:</h3>
            <div class="info-row">
              <span class="label">Ім'я:</span>
              <span class="value">${data.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Телефон:</span>
              <span class="value">${data.phone}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
            </div>
          </div>

          <div class="info-block">
            <h3 style="margin-top: 0; color: #2c5f4f;"><span class="emoji">📦</span> Доставка:</h3>
            <div class="info-row">
              <span class="label">Місто:</span>
              <span class="value">${data.city}</span>
            </div>
            <div class="info-row">
              <span class="label">Відділення Нової Пошти:</span>
              <span class="value">${data.branch}</span>
            </div>
            ${data.comment ? `
            <div class="info-row">
              <span class="label">Коментар:</span>
              <span class="value">${data.comment}</span>
            </div>
            ` : ''}
          </div>

          <div class="price-block">
            <div style="font-size: 14px; color: #666; margin-bottom: 10px;">Вартість замовлення</div>
            <div class="price">${CONFIG.PRICE_PREORDER} грн</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">(передзамовлення)</div>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <a href="https://docs.google.com/spreadsheets/d/${SpreadsheetApp.getActiveSpreadsheet().getId()}"
               style="display: inline-block; background: #2c5f4f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              📊 Відкрити CRM таблицю
            </a>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 5px 0;">Дата замовлення: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}</p>
          <p style="margin: 5px 0;">МАК "Коріння та Крила" - Автоматична CRM система</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Відправка на обидві адреси
  CONFIG.EMAIL_TO.forEach(email => {
    try {
      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: htmlBody
      });
      Logger.log(`📧 Email відправлено на: ${email}`);
    } catch (error) {
      Logger.log(`❌ Помилка відправки email на ${email}: ${error.toString()}`);
    }
  });
}

// =============== ФУНКЦІЇ ДЛЯ ІНІЦІАЛІЗАЦІЇ ===============

/**
 * Створює та форматує таблицю при першому запуску
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  // Видалити стару таблицю якщо існує
  if (sheet) {
    ss.deleteSheet(sheet);
  }

  // Створити нову таблицю
  sheet = ss.insertSheet(CONFIG.SHEET_NAME);

  // Заголовки
  const headers = [
    '№', 'Дата/Час', "Ім'я", 'Телефон', 'Email', 'Місто',
    'Відділення НП', 'Коментар', 'Умови прийнято', 'Статус',
    'Ціна (грн)', 'Трек-номер', 'Примітки', 'UTM Source',
    'UTM Medium', 'UTM Campaign'
  ];

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);

  // Форматування заголовків
  headerRange.setBackground("#2c5f4f");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setFrozenRows(1);

  // Ширина колонок
  const widths = [50, 130, 150, 120, 200, 150, 200, 200, 100, 100, 90, 150, 200, 120, 120, 120];
  widths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });

  // Висота заголовка
  sheet.setRowHeight(1, 40);

  // Додати валідацію для статусу
  const statusValues = ['Нове', 'Оброблено', 'Відправлено', 'Доставлено', 'Скасовано'];
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(statusValues, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 10, 1000, 1).setDataValidation(statusRule);

  // Умовне форматування для статусів
  addConditionalFormatting(sheet);

  Logger.log('✅ Таблицю успішно налаштовано!');
}

/**
 * Додає умовне форматування для статусів
 */
function addConditionalFormatting(sheet) {
  const statusColumn = 10; // Колонка J

  // Нове - жовтий
  let rule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Нове')
    .setBackground('#FFF9C4')
    .setRanges([sheet.getRange(2, 1, 1000, 16)])
    .build();

  let rules = [rule];

  // Оброблено - блакитний
  rule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$J2="Оброблено"')
    .setBackground('#B3E5FC')
    .setRanges([sheet.getRange(2, 1, 1000, 16)])
    .build();
  rules.push(rule);

  // Відправлено - помаранчевий
  rule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$J2="Відправлено"')
    .setBackground('#FFE0B2')
    .setRanges([sheet.getRange(2, 1, 1000, 16)])
    .build();
  rules.push(rule);

  // Доставлено - зелений
  rule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$J2="Доставлено"')
    .setBackground('#C8E6C9')
    .setRanges([sheet.getRange(2, 1, 1000, 16)])
    .build();
  rules.push(rule);

  // Скасовано - червоний
  rule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$J2="Скасовано"')
    .setBackground('#FFCDD2')
    .setRanges([sheet.getRange(2, 1, 1000, 16)])
    .build();
  rules.push(rule);

  sheet.setConditionalFormatRules(rules);
}

/**
 * Створює додатковий аркуш зі статистикою
 */
function createDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dashboardName = "📊 Статистика";

  let dashboard = ss.getSheetByName(dashboardName);
  if (dashboard) {
    ss.deleteSheet(dashboard);
  }

  dashboard = ss.insertSheet(dashboardName, 0);

  // Заголовок
  dashboard.getRange("A1:D1").merge();
  dashboard.getRange("A1").setValue("📊 Статистика замовлень МАК \"Коріння та Крила\"");
  dashboard.getRange("A1").setBackground("#2c5f4f").setFontColor("#ffffff").setFontWeight("bold").setFontSize(16).setHorizontalAlignment("center");
  dashboard.setRowHeight(1, 50);

  // Блок загальної статистики
  const stats = [
    ["", ""],
    ["📦 ЗАГАЛЬНА СТАТИСТИКА", ""],
    ["Всього замовлень:", `=COUNTA(Замовлення!A2:A)`],
    ["Сума замовлень:", `=SUM(Замовлення!K2:K)&" грн"`],
    ["Середній чек:", `=ROUND(AVERAGE(Замовлення!K2:K),2)&" грн"`],
    ["", ""],
    ["📌 ПО СТАТУСАХ", ""],
    ["Нові:", `=COUNTIF(Замовлення!J2:J,"Нове")`],
    ["Оброблені:", `=COUNTIF(Замовлення!J2:J,"Оброблено")`],
    ["Відправлені:", `=COUNTIF(Замовлення!J2:J,"Відправлено")`],
    ["Доставлені:", `=COUNTIF(Замовлення!J2:J,"Доставлено")`],
    ["Скасовані:", `=COUNTIF(Замовлення!J2:J,"Скасовано")`]
  ];

  dashboard.getRange(2, 1, stats.length, 2).setValues(stats);

  // Форматування
  dashboard.getRange("A3:A13").setFontWeight("bold");
  dashboard.setColumnWidth(1, 200);
  dashboard.setColumnWidth(2, 150);

  // Кольори для блоків
  dashboard.getRange("A3").setBackground("#FFF9C4");
  dashboard.getRange("A8").setBackground("#B3E5FC");

  Logger.log('✅ Дашборд створено!');
}

// =============== ТЕСТОВІ ФУНКЦІЇ ===============

/**
 * Тестова функція для перевірки email
 */
function testEmail() {
  const testData = {
    name: "Тестове Ім'я",
    phone: "+380501234567",
    email: "test@example.com",
    city: "Київ",
    branch: "Відділення №1",
    comment: "Тестовий коментар для перевірки",
    accept_terms: true
  };

  sendEmailNotification(testData, 999);
  Logger.log('✅ Тестовий email відправлено!');
}

/**
 * Тестова функція для додавання замовлення
 */
function testAddOrder() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: "Марія Іванова",
        phone: "+380671234567",
        email: "maria@example.com",
        city: "Львів",
        branch: "Відділення №15",
        comment: "Прошу зателефонувати після 18:00",
        accept_terms: true
      })
    }
  };

  const result = doPost(testData);
  Logger.log('📝 Результат тесту: ' + result.getContent());
}
