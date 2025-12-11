# 🚀 Швидкий старт на Railway

## Крок 1: Підключіть GitHub репозиторій

1. Відкрийте https://railway.app/new
2. Натисніть **"Deploy from GitHub repo"**
3. Виберіть: `oleg-github-collab/mak-sale`
4. Railway автоматично визначить Dockerfile

## Крок 2: Додайте змінні середовища

У Railway → **Variables** → **+ New Variable**

### Мінімальні (обов'язкові):

```env
NODE_ENV=production
PORT=3000

LIQPAY_PUBLIC_KEY=sandbox_i00000000000
LIQPAY_PRIVATE_KEY=sandbox_XXXXXXXXXXXXXXXXX

ALLOWED_ORIGINS=*
```

### Опціональні (можна додати пізніше):

```env
# Email (для Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=Roots & Wings <noreply@rootsandwings.com>
EMAIL_TO=rootswings25@gmail.com

# Google Sheets
GOOGLE_SHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account"...}
```

## Крок 3: Deploy!

Railway автоматично:
- ✅ Створить Docker image
- ✅ Запустить контейнер
- ✅ Призначить публічний URL

Зачекайте 2-3 хвилини.

## Крок 4: Перевірте

URL вашого сервера: https://your-app.railway.app

Тест health check:
```bash
curl https://your-app.railway.app/health
```

Очікувана відповідь:
```json
{
  "status": "OK",
  "timestamp": "2025-12-11T...",
  "environment": "production"
}
```

## Крок 5: Оновіть frontend

У файлі `index.html` (рядок ~1098):

```javascript
// Було:
fetch('/api/payment/create', {

// Стало:
fetch('https://your-app.railway.app/api/payment/create', {
```

## Крок 6: Налаштуйте LiqPay

1. https://www.liqpay.ua/ → API → Налаштування
2. **Server URL:** `https://your-app.railway.app/api/payment/callback`
3. **Result URL:** `https://your-app.railway.app/success`

---

## ✅ Готово!

Тепер ваш payment server працює 24/7 на Railway!

**Важливо:**
- Email та Google Sheets - опціональні
- Сервер працює без них
- Додайте пізніше, якщо потрібно

---

## 🆘 Проблеми?

### Сервер не запускається
1. Перевірте Logs у Railway
2. Переконайтеся що `LIQPAY_PUBLIC_KEY` встановлено

### Email не працює
- Це нормально! Email опціональний
- У логах побачите: `⚠️ Email configuration not found`

### Sheets не працює
- Це нормально! Sheets опціональний
- У логах побачите: `⚠️ Google Sheets credentials not found`

---

**Час deployment:** ~3 хвилини
**Статус:** ✅ Готово до використання
