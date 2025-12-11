# Інтеграція LiqPay для форми передзамовлення

## Огляд

Сайт містить готову форму передзамовлення з базовою інтеграцією LiqPay. Для повноцінної роботи потрібно виконати наступні кроки.

## Кроки інтеграції

### 1. Реєстрація в LiqPay

1. Зареєструйтеся на [liqpay.ua](https://www.liqpay.ua/)
2. Пройдіть верифікацію
3. Отримайте API ключі:
   - **Public Key** (публічний ключ)
   - **Private Key** (приватний ключ)

### 2. Налаштування серверної частини

LiqPay вимагає серверної частини для генерації підпису (signature) для безпеки платежів.

#### Варіант 1: PHP Backend

Створіть файл `payment-handler.php`:

```php
<?php
// payment-handler.php

// Ваші ключі LiqPay
define('LIQPAY_PUBLIC_KEY', 'ВАШ_ПУБЛІЧНИЙ_КЛЮЧ');
define('LIQPAY_PRIVATE_KEY', 'ВАШ_ПРИВАТНИЙ_КЛЮЧ');

// Отримання даних з форми
$data = json_decode(file_get_contents('php://input'), true);

// Формування даних для LiqPay
$orderData = array(
    'version' => '3',
    'public_key' => LIQPAY_PUBLIC_KEY,
    'action' => 'pay',
    'amount' => $data['amount'],
    'currency' => 'UAH',
    'description' => 'Передзамовлення МАК Roots & Wings',
    'order_id' => 'ORDER_' . time(),
    'result_url' => 'https://yourdomain.com/success.html',
    'server_url' => 'https://yourdomain.com/callback.php',
);

// Кодування даних
$jsonData = base64_encode(json_encode($orderData));

// Генерація підпису
$signature = base64_encode(sha1(
    LIQPAY_PRIVATE_KEY . $jsonData . LIQPAY_PRIVATE_KEY,
    1
));

// Повернення відповіді
header('Content-Type: application/json');
echo json_encode([
    'data' => $jsonData,
    'signature' => $signature
]);
?>
```

#### Варіант 2: Node.js Backend

```javascript
// server.js
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const LIQPAY_PUBLIC_KEY = 'ВАШ_ПУБЛІЧНИЙ_КЛЮЧ';
const LIQPAY_PRIVATE_KEY = 'ВАШ_ПРИВАТНИЙ_КЛЮЧ';

app.post('/create-payment', (req, res) => {
    const orderData = {
        version: '3',
        public_key: LIQPAY_PUBLIC_KEY,
        action: 'pay',
        amount: req.body.amount,
        currency: 'UAH',
        description: 'Передзамовлення МАК Roots & Wings',
        order_id: 'ORDER_' + Date.now(),
        result_url: 'https://yourdomain.com/success.html',
        server_url: 'https://yourdomain.com/callback'
    };

    const jsonData = Buffer.from(JSON.stringify(orderData)).toString('base64');
    const signature = crypto
        .createHash('sha1')
        .update(LIQPAY_PRIVATE_KEY + jsonData + LIQPAY_PRIVATE_KEY)
        .digest('base64');

    res.json({ data: jsonData, signature: signature });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### 3. Оновлення JavaScript коду

Замініть тестовий код у файлі `index.html` (рядки 1099-1160):

```javascript
// ВАЖЛИВО: Замініть ці значення на ваші реальні ключі LiqPay
const LIQPAY_PUBLIC_KEY = 'ВАШ_ПУБЛІЧНИЙ_КЛЮЧ';

// Відправка запиту на сервер для створення платежу
fetch('/payment-handler.php', {  // або '/create-payment' для Node.js
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        amount: totalAmount,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        quantity: formData.quantity,
        comment: formData.comment
    })
})
.then(response => response.json())
.then(paymentData => {
    // Ініціалізація LiqPay віджету
    LiqPayCheckout.init({
        data: paymentData.data,
        signature: paymentData.signature,
        embedTo: "#liqpay_checkout",
        language: "uk",
        mode: "popup" // або "embed"
    }).on("liqpay.callback", function(data){
        console.log('Payment callback:', data.status);
        if(data.status === 'success') {
            successMessage.classList.remove('hidden');
            preorderForm.reset();
        }
    }).on("liqpay.ready", function(data){
        console.log('LiqPay ready');
    }).on("liqpay.close", function(data){
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Оплатити передзамовлення';
    });
})
.catch(error => {
    console.error('Error:', error);
    errorMessage.classList.remove('hidden');
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Оплатити передзамовлення';
});
```

### 4. Створення Callback обробника

Створіть файл `callback.php` для обробки відповідей від LiqPay:

```php
<?php
// callback.php

define('LIQPAY_PRIVATE_KEY', 'ВАШ_ПРИВАТНИЙ_КЛЮЧ');

// Отримання даних від LiqPay
$data = $_POST['data'];
$signature = $_POST['signature'];

// Перевірка підпису
$expectedSignature = base64_encode(sha1(
    LIQPAY_PRIVATE_KEY . $data . LIQPAY_PRIVATE_KEY,
    1
));

if ($signature !== $expectedSignature) {
    http_response_code(400);
    exit('Invalid signature');
}

// Декодування даних
$paymentData = json_decode(base64_decode($data), true);

// Обробка платежу
if ($paymentData['status'] === 'success') {
    // Збереження замовлення в базу даних
    // Відправка email підтвердження
    // Інші дії...

    // Логування
    file_put_contents(
        'payments.log',
        date('Y-m-d H:i:s') . ' - Order: ' . $paymentData['order_id'] . ' - Success' . PHP_EOL,
        FILE_APPEND
    );
}

http_response_code(200);
?>
```

### 5. Створення сторінки успіху

Створіть файл `success.html`:

```html
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Дякуємо за замовлення - Roots & Wings</title>
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            text-align: center;
            padding: 20px;
        }
        .success-container {
            max-width: 600px;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
        }
        .btn {
            display: inline-block;
            padding: 1rem 2rem;
            background: #e67e22;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #d35400;
        }
    </style>
</head>
<body>
    <div class="success-container">
        <h1>🎉 Дякуємо за передзамовлення!</h1>
        <p>Ваше замовлення успішно оформлено. Ми зв'яжемося з вами найближчим часом для підтвердження деталей доставки.</p>
        <p>Підтвердження також надіслано на вашу електронну пошту.</p>
        <a href="/" class="btn">Повернутися на головну</a>
    </div>
</body>
</html>
```

## Тестування

LiqPay надає тестове середовище:

1. Використовуйте тестові ключі для розробки
2. Тестові картки:
   - **Успішний платіж**: 4242424242424242
   - **Неуспішний платіж**: 4000000000000002

## Безпека

⚠️ **ВАЖЛИВО:**
- **НІКОЛИ** не зберігайте приватний ключ в клієнтському коді
- Завжди валідуйте підпис на сервері
- Використовуйте HTTPS для всіх запитів
- Логуйте всі транзакції для аудиту
- Не довіряйте даним з клієнта без перевірки

## Додаткові ресурси

- [Документація LiqPay](https://www.liqpay.ua/documentation/api/aquiring/checkout/doc)
- [API довідник](https://www.liqpay.ua/documentation/api/home)
- [Підтримка LiqPay](https://www.liqpay.ua/uk/support)

## Контакт

Якщо виникають питання щодо інтеграції, зверніться до документації LiqPay або технічної підтримки.
