# 🚂 Railway Deployment Guide

## Швидкий старт

### 1. Підготовка репозиторію

Переконайтеся, що всі файли закомічені:
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push
```

### 2. Створення проєкту на Railway

1. Відкрийте https://railway.app/
2. Натисніть **"New Project"**
3. Оберіть **"Deploy from GitHub repo"**
4. Виберіть ваш репозиторій `mak-sale`
5. Railway автоматично визначить Dockerfile

### 3. Налаштування змінних середовища

Перейдіть у **Variables** та додайте:

#### Обов'язкові:
```env
NODE_ENV=production
PORT=3000
SITE_URL=https://your-railway-app.railway.app

# LiqPay credentials
LIQPAY_PUBLIC_KEY=your_public_key
LIQPAY_PRIVATE_KEY=your_private_key

# Allowed origins (розділіть комами)
ALLOWED_ORIGINS=https://your-domain.com,https://your-railway-app.railway.app
```

#### Опціональні (Email нотифікації):
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Roots & Wings <noreply@rootsandwings.com>
EMAIL_TO=rootswings25@gmail.com
```

#### Опціональні (Google Sheets):
```env
GOOGLE_SHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

### 4. Deploy

Railway автоматично почне deployment після збереження змінних.

Перевірте логи в розділі **"Deployments"**.

---

## 📋 Dockerfile

Проєкт використовує Dockerfile для deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 🔍 Health Check

Railway автоматично перевіряє `/health` endpoint кожні 30 секунд:

```bash
curl https://your-app.railway.app/health
```

Відповідь:
```json
{
  "status": "OK",
  "timestamp": "2025-12-11T12:00:00.000Z",
  "environment": "production"
}
```

---

## 🚀 Після deployment

### Отримайте URL вашого додатку:
1. Відкрийте **Settings** → **Domains**
2. Railway автоматично створить домен: `your-app.railway.app`
3. Або додайте свій домен

### Оновіть frontend:
У файлі `index.html` змініть API endpoint:

```javascript
fetch('https://your-app.railway.app/api/payment/create', {
    method: 'POST',
    ...
})
```

### Налаштуйте LiqPay:
1. Увійдіть у https://www.liqpay.ua/
2. Перейдіть у **API** → **Налаштування**
3. Додайте:
   - **Server URL:** `https://your-app.railway.app/api/payment/callback`
   - **Result URL:** `https://your-app.railway.app/success`

---

## 🐛 Troubleshooting

### Сервер не запускається

Перевірте логи:
1. Відкрийте **Deployments**
2. Натисніть на активний deployment
3. Перегляньте **Deploy Logs**

Типові проблеми:
- ❌ `nodemailer.createTransporter is not a function`
  - **Рішення:** Оновлено в коді - тепер email опціональний

- ❌ `Port already in use`
  - **Рішення:** Railway автоматично встановлює PORT

- ❌ `Cannot find module`
  - **Рішення:** Запустіть локально `npm install` та перевірте package.json

### Email не відправляються

Email notifications опціональні. Якщо не налаштовані EMAIL змінні:
- Сервер працює нормально
- У логах побачите: `⚠️ Email configuration not found - email notifications disabled`

Щоб увімкнути email:
1. Додайте всі EMAIL змінні
2. Для Gmail створіть **App Password**: https://myaccount.google.com/apppasswords

### Google Sheets не працює

Google Sheets інтеграція опціональна. Якщо не налаштовано:
- Сервер працює нормально
- У логах: `⚠️ Google Sheets credentials not found - sheets integration disabled`

Щоб увімкнути Sheets:
1. Створіть Service Account у Google Cloud Console
2. Додайте `GOOGLE_SERVICE_ACCOUNT_KEY` (JSON)
3. Додайте `GOOGLE_SHEET_ID`

---

## 📊 Моніторинг

Railway надає метрики:
- CPU Usage
- Memory Usage
- Network
- Request logs

Перейдіть у **Metrics** для перегляду.

---

## 🔄 Оновлення

Для deploy нових змін:

```bash
git add .
git commit -m "Update server"
git push
```

Railway автоматично запустить новий deployment.

---

## 💰 Вартість

Railway пропонує:
- **Hobby Plan:** $5/місяць + usage
- **Developer Plan:** безкоштовно (обмежено)

Перевірте актуальні ціни: https://railway.app/pricing

---

## 📞 Підтримка

- Railway Docs: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- GitHub Issues: https://github.com/oleg-github-collab/mak-sale/issues

---

## ✅ Checklist готовності

- [ ] Dockerfile створено
- [ ] railway.toml налаштовано
- [ ] package.json містить правильні залежності
- [ ] Змінні середовища додані в Railway
- [ ] Health check працює
- [ ] LiqPay credentials налаштовані
- [ ] Frontend оновлено з новим API URL
- [ ] LiqPay callback URL оновлено

---

**Підготовлено:** 11 грудня 2025
**Статус:** ✅ Готово до deployment
