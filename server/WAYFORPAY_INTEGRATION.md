# WayForPay Integration Guide

Цей документ описує інтеграцію платіжної системи WayForPay для прийому платежів на сайті Roots & Wings.

## Зміст

1. [Огляд](#огляд)
2. [Отримання облікових даних](#отримання-облікових-даних)
3. [Налаштування](#налаштування)
4. [Як це працює](#як-це-працює)
5. [Тестування](#тестування)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

## Огляд

WayForPay - це платіжний агрегатор для прийому онлайн-платежів в Україні.

### Переваги WayForPay:

- ✅ Підтримка всіх популярних карток (Visa, Mastercard, Приват24)
- ✅ Простота інтеграції
- ✅ Безпечна обробка платежів (PCI DSS)
- ✅ Підтримка 3D Secure
- ✅ Автоматичні повернення коштів
- ✅ Детальна звітність

## Отримання облікових даних

1. **Реєстрація у WayForPay:**
   - Перейдіть на https://wayforpay.com/
   - Натисніть "Підключити" або "Реєстрація"
   - Заповніть форму реєстрації

2. **Необхідні документи:**
   - ІПН/ЄДРПОУ
   - Скан-копія паспорта
   - Виписка з ЄДР або свідоцтво ФОП
   - Опис бізнесу та товарів/послуг

3. **Отримання облікових даних:**
   - Після модерації увійдіть в особистий кабінет
   - Знайдіть розділ "Налаштування" → "API"
   - Скопіюйте:
     - `Merchant Account` (ваш merchant ID)
     - `Secret Key` (секретний ключ)

## Налаштування

### 1. Налаштування .env файлу

Створіть файл `.env` на основі `.env.example`:

```bash
cp .env.example .env
```

Додайте ваші облікові дані WayForPay:

```env
# WayForPay Configuration
WAYFORPAY_MERCHANT_ACCOUNT=test_merch_n1
WAYFORPAY_SECRET_KEY=flk3409refn54t54t*FNJRET

# URLs
SITE_URL=https://yourdomain.com
SERVER_URL=https://yourdomain.com
MERCHANT_DOMAIN=yourdomain.com

# Payment Settings
PRICE_PER_ITEM=1500
CURRENCY=UAH
```

### 2. Налаштування URL для колбеків

У особистому кабінеті WayForPay налаштуйте:

- **Service URL:** `https://yourdomain.com/api/payment/callback`
- **Return URL:** `https://yourdomain.com/success`

## Як це працює

### Схема оплати:

```
1. Користувач заповнює форму на сайті
   ↓
2. Backend створює платіж (POST /api/payment/create)
   ↓
3. Генерується підпис (merchantSignature)
   ↓
4. Користувач перенаправляється на WayForPay
   ↓
5. Користувач вводить дані картки
   ↓
6. WayForPay обробляє платіж
   ↓
7. Callback на SERVER_URL/api/payment/callback
   ↓
8. Перевірка підпису та збереження результату
   ↓
9. Користувач повертається на success/error сторінку
```

### Генерація підпису (merchantSignature)

Підпис генерується за допомогою HMAC-MD5:

```javascript
const signatureParams = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    ...productNames,
    ...productCounts,
    ...productPrices
];

const merchantSignature = crypto
    .createHmac('md5', secretKey)
    .update(signatureParams.join(';'))
    .digest('hex');
```

### Формат callback

WayForPay відправляє POST запит на serviceUrl з такими параметрами:

```json
{
  "merchantAccount": "test_merch_n1",
  "orderReference": "RW1734545123456",
  "amount": 1500,
  "currency": "UAH",
  "authCode": "123456",
  "cardPan": "444455XXXXXX1234",
  "transactionStatus": "Approved",
  "reasonCode": "",
  "merchantSignature": "abc123..."
}
```

## Тестування

### Тестові картки WayForPay:

**Успішна оплата:**
- Номер: `4242 4242 4242 4242`
- CVV: будь-який
- Термін дії: будь-який майбутній

**Відхилена оплата:**
- Номер: `4000 0000 0000 0002`
- CVV: будь-який
- Термін дії: будь-який майбутній

### Тестування локально:

1. Запустіть сервер:
```bash
cd server
npm start
```

2. Відкрийте http://localhost:3000

3. Заповніть форму передзамовлення

4. Використайте тестові картки

### Тестування callback:

Для тестування callback локально використовуйте ngrok:

```bash
ngrok http 3000
```

Використайте ngrok URL як SERVER_URL у .env

## Production Deployment

### 1. Перевірте environment variables:

```env
NODE_ENV=production
WAYFORPAY_MERCHANT_ACCOUNT=your_real_merchant_account
WAYFORPAY_SECRET_KEY=your_real_secret_key
SITE_URL=https://yourdomain.com
SERVER_URL=https://yourdomain.com
MERCHANT_DOMAIN=yourdomain.com
```

### 2. Налаштуйте HTTPS

WayForPay вимагає HTTPS для production. Використовуйте:
- Let's Encrypt (безкоштовно)
- Cloudflare SSL
- або інший SSL сертифікат

### 3. Налаштуйте URL у WayForPay:

В особистому кабінеті вкажіть:
- Service URL: `https://yourdomain.com/api/payment/callback`
- Return URL: `https://yourdomain.com/success`

### 4. Тестування на production:

- Зробіть тестову оплату мінімальної суми
- Перевірте чи приходить callback
- Перевірте чи збережується замовлення
- Перевірте чи приходить email

## Troubleshooting

### Проблема: "Invalid signature"

**Рішення:**
1. Перевірте що SECRET_KEY правильний
2. Перевірте порядок параметрів у підписі
3. Перевірте що всі параметри у UTF-8
4. Перевірте логи сервера

### Проблема: Callback не приходить

**Рішення:**
1. Перевірте що SERVICE_URL доступний з інтернету
2. Перевірте що сервер приймає POST запити
3. Перевірте firewall налаштування
4. Перевірте логи WayForPay у особистому кабінеті

### Проблема: Платіж успішний, але статус не оновлюється

**Рішення:**
1. Перевірте що callback обробляється правильно
2. Перевірте що файл orders.json доступний для запису
3. Перевірте логи сервера на помилки
4. Перевірте що orderReference співпадає

### Проблема: "CORS error"

**Рішення:**
1. Додайте домен у ALLOWED_ORIGINS у .env
2. Перевірте CORS middleware у server.js
3. Перезапустіть сервер після змін

## Корисні посилання

- [Документація WayForPay API](https://wiki.wayforpay.com/)
- [Особистий кабінет WayForPay](https://secure.wayforpay.com/)
- [Тестові картки](https://wiki.wayforpay.com/view/test-cards)
- [Підтримка WayForPay](mailto:support@wayforpay.com)

## Безпека

⚠️ **ВАЖЛИВО:**

1. ✅ **НІКОЛИ** не зберігайте SECRET_KEY у git
2. ✅ Використовуйте .env для конфіденційних даних
3. ✅ Завжди перевіряйте підпис у callback
4. ✅ Використовуйте HTTPS на production
5. ✅ Регулярно оновлюйте залежності
6. ✅ Логуйте всі транзакції
7. ✅ Встановіть rate limiting на API endpoints

## Підтримка

Якщо виникли питання:

1. Перевірте логи сервера: `pm2 logs mak-server`
2. Перевірте особистий кабінет WayForPay
3. Зверніться до техпідтримки WayForPay: tech@wayforpay.com
