# Roots & Wings Payment Server

Повний backend для прийому платежів через LiqPay та збереження замовлень в Google Sheets для сайту метафоричних карт "Roots & Wings".

## 📋 Зміст

- [Особливості](#особливості)
- [Структура проєкту](#структура-проєкту)
- [Встановлення](#встановлення)
- [Конфігурація](#конфігурація)
- [Запуск](#запуск)
- [API Endpoints](#api-endpoints)
- [Розгортання на сервері](#розгортання-на-сервері)
- [Безпека](#безпека)
- [Troubleshooting](#troubleshooting)

## ✨ Особливості

- ✅ Повна інтеграція з LiqPay API
- ✅ Безпечна обробка платежів з перевіркою підпису
- ✅ Автоматичне збереження замовлень в Google Sheets
- ✅ Email-повідомлення адміну про нові замовлення
- ✅ Логування всіх транзакцій
- ✅ Rate limiting для захисту від DDoS
- ✅ CORS налаштування
- ✅ Резервне збереження у JSON
- ✅ Красиві сторінки успіху/помилки в стилі сайту

## 📁 Структура проєкту

```
server/
├── package.json               # Залежності та скрипти
├── server.js                  # Головний файл сервера
├── .env.example               # Приклад конфігурації
├── .env                       # Ваша конфігурація (створіть з .env.example)
├── README.md                  # Ця інструкція
├── GOOGLE_SHEETS_SETUP.md     # Детальна інструкція з налаштування Google Sheets
├── routes/
│   └── payment.js             # Роути для обробки платежів
├── utils/
│   ├── logger.js              # Логування Winston
│   ├── liqpay.js              # Утиліти для роботи з LiqPay
│   ├── email.js               # Відправка email адміну
│   └── sheets.js              # Інтеграція з Google Sheets
├── data/
│   └── orders.json            # Резервне збереження замовлень
└── logs/
    ├── combined.log           # Всі логи
    └── error.log              # Тільки помилки
```

## 🚀 Встановлення

### 1. Встановіть Node.js

Переконайтесь, що у вас встановлено Node.js версії 16 або вище:

```bash
node --version
npm --version
```

Якщо ні, завантажте з [nodejs.org](https://nodejs.org/)

### 2. Перейдіть у папку server

```bash
cd server
```

### 3. Встановіть залежності

```bash
npm install
```

## ⚙️ Конфігурація

### 1. Створіть файл .env

Скопіюйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

### 2. Налаштуйте .env файл

Відкрийте `.env` та заповніть всі необхідні поля:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# LiqPay Configuration (отримайте на liqpay.ua)
LIQPAY_PUBLIC_KEY=ваш_публічний_ключ
LIQPAY_PRIVATE_KEY=ваш_приватний_ключ

# URLs
SITE_URL=https://yourdomain.com
SERVER_URL=https://yourdomain.com/api

# Email Configuration (тільки для адміна)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=ваш_email@gmail.com
EMAIL_PASSWORD=ваш_пароль_або_app_password
EMAIL_FROM=rootswings25@gmail.com
EMAIL_TO=rootswings25@gmail.com

# Google Sheets Configuration
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
GOOGLE_SHEET_ID=ваш_spreadsheet_id

# Security
ALLOWED_ORIGINS=https://yourdomain.com,http://localhost:3000

# Payment Settings
PRICE_PER_ITEM=1500
CURRENCY=UAH
```

### 3. Налаштування LiqPay

1. Зареєструйтеся на [liqpay.ua](https://www.liqpay.ua/)
2. Пройдіть верифікацію
3. У особистому кабінеті отримайте:
   - Public Key (публічний ключ)
   - Private Key (приватний ключ)
4. Вставте ключі в `.env` файл

### 4. Налаштування Email (для Gmail)

Якщо використовуєте Gmail для отримання повідомлень про замовлення:

1. Увімкніть двофакторну автентифікацію
2. Створіть App Password:
   - Перейдіть в [Google Account Security](https://myaccount.google.com/security)
   - Виберіть "App passwords"
   - Створіть новий пароль для "Mail"
3. Використайте цей пароль в `EMAIL_PASSWORD`

### 5. Налаштування Google Sheets

**Важливо**: Детальну покрокову інструкцію дивіться в [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)

Коротко:
1. Створіть новий Google Spreadsheet
2. Налаштуйте заголовки (Дата, ID замовлення, Ім'я, Email, тощо)
3. Створіть Service Account в Google Cloud Console
4. Увімкніть Google Sheets API
5. Завантажте JSON ключ
6. Надайте Service Account доступ до вашого Spreadsheet
7. Додайте JSON ключ та Spreadsheet ID до `.env`

## 🏃 Запуск

### Режим розробки (з auto-restart):

```bash
npm run dev
```

### Режим production:

```bash
npm start
```

Сервер запуститься на порті, вказаному в `.env` (за замовчуванням 3000).

## 📡 API Endpoints

### POST /api/payment/create

Створення платежу

**Request:**
```json
{
  "name": "Іван Іваненко",
  "email": "ivan@example.com",
  "phone": "+380501234567",
  "address": "Київ, відділення Нової Пошти #123",
  "quantity": 2,
  "comment": "Додатковий коментар"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "RW1234567890123",
  "payment": {
    "data": "base64_encoded_data",
    "signature": "base64_signature"
  }
}
```

### POST /api/payment/callback

Callback від LiqPay (автоматичний, налаштований в LiqPay)

### GET /api/payment/orders

Отримати всі замовлення (додайте автентифікацію для production!)

### GET /api/payment/order/:id

Отримати конкретне замовлення за ID

### GET /api/health

Health check сервера

## 🌐 Розгортання на сервері

### Варіант 1: VPS (Ubuntu/Debian)

1. **Підключіться до сервера:**
```bash
ssh user@your-server-ip
```

2. **Встановіть Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Клонуйте проєкт:**
```bash
cd /var/www
git clone your-repository.git
cd your-repository/server
```

4. **Встановіть залежності:**
```bash
npm install --production
```

5. **Налаштуйте .env:**
```bash
nano .env
# Вставте ваші налаштування
```

6. **Встановіть PM2 (process manager):**
```bash
sudo npm install -g pm2
```

7. **Запустіть сервер:**
```bash
pm2 start server.js --name roots-wings
pm2 save
pm2 startup
```

8. **Налаштуйте Nginx (reverse proxy):**
```bash
sudo nano /etc/nginx/sites-available/roots-wings
```

Додайте:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активуйте:
```bash
sudo ln -s /etc/nginx/sites-available/roots-wings /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

9. **Встановіть SSL (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Варіант 2: Heroku

1. **Створіть Procfile:**
```
web: node server/server.js
```

2. **Deploy:**
```bash
heroku create your-app-name
git push heroku main
heroku config:set LIQPAY_PUBLIC_KEY=your_key
heroku config:set LIQPAY_PRIVATE_KEY=your_key
# ... інші env змінні
```

### Варіант 3: DigitalOcean App Platform

1. Створіть новий App
2. Підключіть GitHub репозиторій
3. Встановіть Environment Variables в налаштуваннях
4. Deploy!

## 🔒 Безпека

### Важливо:

1. **НІКОЛИ** не комітьте `.env` файл в git
2. Завжди використовуйте HTTPS для production
3. Додайте автентифікацію для `/api/payment/orders` endpoint
4. Регулярно оновлюйте залежності: `npm audit fix`
5. Використовуйте сильні паролі для email
6. Обмежте доступ до логів
7. Налаштуйте firewall на сервері

### .gitignore

Переконайтесь, що `.gitignore` містить:
```
.env
node_modules/
logs/
data/orders.json
```

## 🐛 Troubleshooting

### Проблема: Сервер не запускається

**Рішення:**
- Перевірте чи всі змінні в `.env` заповнені
- Перевірте чи порт не зайнятий: `lsof -i :3000`
- Перевірте логи: `cat logs/error.log`

### Проблема: Email не відправляються

**Рішення:**
- Перевірте EMAIL_USER та EMAIL_PASSWORD
- Для Gmail створіть App Password
- Перевірте налаштування SMTP

### Проблема: LiqPay callback не працює

**Рішення:**
- Переконайтесь що `SERVER_URL` доступний ззовні
- Перевірте що сервер запущений на HTTPS
- Перевірте логи callback: `grep "callback" logs/combined.log`

### Проблема: CORS помилки

**Рішення:**
- Додайте ваш домен в `ALLOWED_ORIGINS`
- Формат: `https://domain1.com,https://domain2.com`

## 📊 Моніторинг

### PM2 команди:

```bash
pm2 status                 # Статус процесу
pm2 logs roots-wings       # Дивитись логи
pm2 restart roots-wings    # Перезапустити
pm2 stop roots-wings       # Зупинити
pm2 delete roots-wings     # Видалити
```

### Перегляд замовлень:

```bash
cat data/orders.json | jq '.'  # Красивий вивід (потрібен jq)
```

## 📞 Підтримка

Якщо виникли питання:
- Email: rootswings25@gmail.com
- Документація LiqPay: [liqpay.ua/documentation](https://www.liqpay.ua/documentation)

## 📝 Ліцензія

MIT License - використовуйте вільно для вашого проєкту!

---

**Створено для Roots & Wings** 🌱✨
