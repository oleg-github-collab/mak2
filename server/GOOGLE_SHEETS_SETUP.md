# Налаштування Google Sheets для зберігання замовлень

## 1. Створення Google Spreadsheet

1. Відкрийте [Google Sheets](https://sheets.google.com)
2. Створіть новий spreadsheet з назвою "Roots & Wings - Замовлення"
3. Перейменуйте перший лист на "Orders"
4. Створіть заголовки в першому рядку:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| Дата | ID замовлення | Ім'я | Email | Телефон | Адреса | Кількість | Сума | Статус | Коментар | ID платежу |

5. Скопіюйте ID spreadsheet з URL (це частина між `/d/` та `/edit`):
   ```
   https://docs.google.com/spreadsheets/d/1ABC123xyz_SPREADSHEET_ID_HERE/edit
   ```

## 2. Створення Service Account в Google Cloud Console

### Крок 1: Створення проєкту

1. Відкрийте [Google Cloud Console](https://console.cloud.google.com/)
2. Створіть новий проєкт або виберіть існуючий
3. Запам'ятайте назву проєкту

### Крок 2: Увімкнення Google Sheets API

1. В меню зліва виберіть **APIs & Services** > **Library**
2. Знайдіть **Google Sheets API**
3. Натисніть **Enable**

### Крок 3: Створення Service Account

1. В меню зліва виберіть **APIs & Services** > **Credentials**
2. Натисніть **Create Credentials** > **Service Account**
3. Заповніть форму:
   - **Service account name**: roots-wings-orders
   - **Service account ID**: буде згенеровано автоматично
   - **Description**: Service account for Roots & Wings orders integration
4. Натисніть **Create and Continue**
5. На кроці "Grant this service account access to project" - можна пропустити (натисніть **Continue**)
6. На кроці "Grant users access to this service account" - також пропустіть (натисніть **Done**)

### Крок 4: Створення ключа

1. Знайдіть щойно створений Service Account в списку
2. Натисніть на нього, щоб відкрити деталі
3. Перейдіть на вкладку **Keys**
4. Натисніть **Add Key** > **Create new key**
5. Виберіть формат **JSON**
6. Натисніть **Create**
7. Файл з ключем буде завантажено на ваш комп'ютер (збережіть його в безпечному місці!)

### Крок 5: Надання доступу Service Account до Spreadsheet

1. Відкрийте завантажений JSON файл
2. Знайдіть поле `client_email` (виглядає як `xxx@xxx.iam.gserviceaccount.com`)
3. Скопіюйте цю email адресу
4. Поверніться до вашого Google Spreadsheet
5. Натисніть кнопку **Share** (Поділитися) в правому верхньому куті
6. Вставте скопійовану email адресу Service Account
7. Встановіть права доступу **Editor** (Редактор)
8. Зніміть галочку "Notify people" (щоб не надсилати email)
9. Натисніть **Share**

## 3. Налаштування змінних оточення

### Варіант 1: Прямий JSON (рекомендовано для локальної розробки)

Відкрийте ваш `.env` файл і додайте:

```env
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...весь JSON з файлу ключа..."}
GOOGLE_SHEET_ID=ваш_spreadsheet_id_тут
```

**Важливо**: Весь JSON має бути в одному рядку!

### Варіант 2: Файл (рекомендовано для production)

Якщо JSON занадто великий для .env:

1. Покладіть JSON файл в папку `server/config/google-credentials.json`
2. Додайте `config/` до `.gitignore`
3. Змініть код в `server/utils/sheets.js`:

```javascript
// Замість цього:
const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

// Використовуйте:
const credentials = require('../config/google-credentials.json');
```

## 4. Структура таблиці

Система автоматично додаватиме нові рядки з такими даними:

- **Дата**: Дата та час створення замовлення (формат uk-UA)
- **ID замовлення**: Унікальний ідентифікатор (наприклад, RW1701234567890123)
- **Ім'я**: Ім'я клієнта
- **Email**: Email клієнта
- **Телефон**: Номер телефону
- **Адреса**: Адреса доставки
- **Кількість**: Кількість наборів карт
- **Сума**: Загальна сума в грн
- **Статус**: pending / success / failure / processing
- **Коментар**: Додатковий коментар клієнта (якщо є)
- **ID платежу**: ID транзакції від LiqPay (заповнюється після оплати)

## 5. Перевірка налаштування

Після налаштування:

1. Перезапустіть сервер: `npm start`
2. Зробіть тестове замовлення
3. Перевірте, чи з'явився новий рядок в Google Sheets
4. Після успішної оплати статус має оновитися на "success"

## 6. Безпека

⚠️ **Важливо**:
- Ніколи не публікуйте JSON ключ Service Account у відкритих репозиторіях
- Додайте `.env` та `config/` до `.gitignore`
- Регулярно ротуйте ключі Service Account
- Надавайте Service Account тільки необхідні права (Editor для конкретного spreadsheet)

## 7. Troubleshooting

### Помилка: "The caller does not have permission"

**Рішення**: Переконайтеся, що ви надали Service Account доступ до spreadsheet (крок 5)

### Помилка: "Invalid JSON in GOOGLE_SERVICE_ACCOUNT_KEY"

**Рішення**: Переконайтеся, що JSON в одному рядку і всі лапки екрановані правильно

### Помилка: "Spreadsheet not found"

**Рішення**: Перевірте правильність GOOGLE_SHEET_ID в .env файлі

### Рядки не додаються

**Рішення**:
1. Перевірте логи сервера
2. Переконайтеся, що назва листа точно "Orders"
3. Перевірте, що Google Sheets API увімкнено в Google Cloud Console

## 8. Додаткові можливості

Ви можете додати:
- Умовне форматування для різних статусів (зелений для success, червоний для failure)
- Фільтри та сортування
- Графіки та звіти
- Додаткові листи для аналітики
- Google Apps Script для автоматизації (наприклад, автоматичні email нагадування)
