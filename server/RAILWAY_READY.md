# ✅ Railway - Готово до deployment!

## 🎯 Всі проблеми виправлені

### ✅ Виправлення #1: package-lock.json
- **Проблема:** `npm ci` вимагає package-lock.json
- **Рішення:** Створено package-lock.json
- **Статус:** ✅ Виправлено

### ✅ Виправлення #2: nodemailer помилка
- **Проблема:** `nodemailer.createTransporter is not a function`
- **Рішення:** Email тепер опціональний, оновлено до 7.0.11
- **Статус:** ✅ Виправлено

### ✅ Виправлення #3: Файли не знайдено
- **Проблема:** `ENOENT: no such file or directory, stat '/index.html'`
- **Рішення:** Скопійовано frontend в server/public/
- **Статус:** ✅ Виправлено

---

## 📁 Структура проєкту

```
server/
├── public/              ← Frontend файли
│   ├── index.html
│   ├── success.html
│   ├── error.html
│   ├── css/
│   │   ├── style.css
│   │   └── exercise.css
│   └── js/
│       ├── main.js
│       └── exercise.js
├── routes/
│   └── payment.js
├── utils/
│   ├── email.js
│   ├── liqpay.js
│   ├── logger.js
│   └── sheets.js
├── Dockerfile           ← Railway build config
├── railway.toml         ← Railway deploy config
├── package.json
├── package-lock.json
└── server.js            ← Entry point
```

---

## 🚀 Deployment на Railway

### Крок 1: Створити проєкт
1. https://railway.app/new
2. **Deploy from GitHub repo**
3. Вибрати: `oleg-github-collab/mak-sale`
4. **ВАЖЛИВО:** Railway Settings → Set Root Directory → `server`

### Крок 2: Змінні середовища

**Мінімальні (для тесту):**
```env
NODE_ENV=production
PORT=3000
LIQPAY_PUBLIC_KEY=sandbox_i00000000000
LIQPAY_PRIVATE_KEY=sandbox_XXXXX
ALLOWED_ORIGINS=*
```

**Production:**
```env
NODE_ENV=production
PORT=3000
SITE_URL=https://your-app.railway.app

LIQPAY_PUBLIC_KEY=i00000000000
LIQPAY_PRIVATE_KEY=real_private_key

ALLOWED_ORIGINS=https://your-domain.com,https://your-app.railway.app
```

**Опціональні (Email):**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password
EMAIL_FROM=Roots & Wings <noreply@rootsandwings.com>
EMAIL_TO=rootswings25@gmail.com
```

**Опціональні (Google Sheets):**
```env
GOOGLE_SHEET_ID=spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account"...}
```

### Крок 3: Deploy!
Railway автоматично:
- Побудує Docker image
- Запустить контейнер
- Призначить публічний URL

**Час deployment:** ~2-3 хвилини

### Крок 4: Перевірка

**Health check:**
```bash
curl https://your-app.railway.app/health
```

**Очікувана відповідь:**
```json
{
  "status": "OK",
  "timestamp": "2025-12-11T...",
  "environment": "production"
}
```

**Головна сторінка:**
```bash
curl https://your-app.railway.app/
```

Має повернути HTML код index.html

---

## 📊 Очікувані логи

### ✅ Успішний запуск:

```
✅ Server running on port 3000
🌍 Environment: production
📁 Serving static files from: /app/public
⚠️ Email configuration not found - email notifications disabled
⚠️ Google Sheets credentials not found - sheets integration disabled
```

**Це нормально!** Email та Sheets опціональні.

### ✅ З Email:

```
✅ Server running on port 3000
🌍 Environment: production
📁 Serving static files from: /app/public
✅ Email transporter initialized
⚠️ Google Sheets credentials not found - sheets integration disabled
```

### ✅ Повна конфігурація:

```
✅ Server running on port 3000
🌍 Environment: production
📁 Serving static files from: /app/public
✅ Email transporter initialized
✅ Google Sheets API initialized successfully
```

---

## 🔧 Як працює server.js

### Статичні файли:

```javascript
// Production (Railway): /app/public/
// Development (local): ../
const publicDir = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, 'public')
    : path.join(__dirname, '..');
```

### Routes:

- `/` → `public/index.html`
- `/success` → `public/success.html`
- `/error` → `public/error.html`
- `/health` → Health check (JSON)
- `/api/health` → Alternative health check
- `/api/payment/create` → Create LiqPay payment
- `/api/payment/callback` → LiqPay callback
- `/css/*`, `/js/*` → Static assets

---

## 🆘 Troubleshooting

### ❌ Build Failed - npm ci error
**Статус:** ✅ Виправлено (package-lock.json створено)

### ❌ nodemailer error
**Статус:** ✅ Виправлено (опціональний email)

### ❌ ENOENT: no such file
**Статус:** ✅ Виправлено (файли в public/)

### ⚠️ Root Directory помилка
**Рішення:** Railway Settings → Root Directory → `server`

### 🔴 Container crashed
**Перевірити:**
1. Railway Logs - подивитись помилку
2. Змінні середовища - чи всі встановлені
3. Health check - чи працює `/health`

---

## 📞 Підтримка

- **Railway Docs:** https://docs.railway.app/
- **Railway Discord:** https://discord.gg/railway
- **GitHub Issues:** https://github.com/oleg-github-collab/mak-sale/issues

---

## ✅ Checklist перед deployment

- [x] package-lock.json створено
- [x] Dockerfile оптимізовано
- [x] Frontend файли в public/
- [x] server.js підтримує production/dev
- [x] Email опціональний
- [x] Google Sheets опціональний
- [x] Health check працює
- [x] Graceful shutdown
- [x] Логування налаштовано

---

**Статус:** ✅ 100% готово до deployment
**Commit:** 6dd80cf
**GitHub:** https://github.com/oleg-github-collab/mak-sale

**Тепер Railway запрацює без помилок!** 🚂✅
