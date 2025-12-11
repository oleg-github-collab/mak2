# ✅ Railway Deployment Checklist

## Перед deployment

- [x] **Dockerfile створено** ✅
- [x] **railway.toml налаштовано** ✅
- [x] **.dockerignore додано** ✅
- [x] **package-lock.json створено** ✅ (ВИПРАВЛЕНО!)
- [x] **.gitignore для server/** ✅
- [x] **nodemailer оновлено до 7.0.11** ✅ (виправлено вразливість)
- [x] **Email опціональний** ✅
- [x] **Google Sheets опціональний** ✅
- [x] **Health check endpoints** ✅ (`/health`, `/api/health`)
- [x] **Graceful shutdown** ✅ (SIGTERM, SIGINT)

## Railway налаштування

### 1. Створити проєкт

- [ ] Відкрити https://railway.app/new
- [ ] Deploy from GitHub: `oleg-github-collab/mak-sale`
- [ ] Вибрати папку: `server/`

### 2. Змінні середовища (Variables)

#### Мінімальні (для тесту):
```env
NODE_ENV=production
PORT=3000
LIQPAY_PUBLIC_KEY=sandbox_i00000000000
LIQPAY_PRIVATE_KEY=sandbox_XXXXX
ALLOWED_ORIGINS=*
```

#### Рекомендовані (для production):
```env
NODE_ENV=production
PORT=3000
SITE_URL=https://your-app.railway.app

# LiqPay production
LIQPAY_PUBLIC_KEY=i00000000000
LIQPAY_PRIVATE_KEY=XXXXXXXXXXXXX

# CORS
ALLOWED_ORIGINS=https://your-domain.com,https://your-app.railway.app
```

#### Опціональні (додати пізніше):

**Email:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
EMAIL_FROM=Roots & Wings <noreply@rootsandwings.com>
EMAIL_TO=rootswings25@gmail.com
```

**Google Sheets:**
```env
GOOGLE_SHEET_ID=1ABC...XYZ
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

### 3. Deployment

- [ ] Натиснути **Deploy**
- [ ] Зачекати 2-3 хвилини
- [ ] Перевірити Deploy Logs
- [ ] Переконатися що немає помилок

### 4. Перевірка

- [ ] Отримати Railway URL: `https://your-app.railway.app`
- [ ] Тест health check:
  ```bash
  curl https://your-app.railway.app/health
  ```
- [ ] Очікувана відповідь:
  ```json
  {
    "status": "OK",
    "timestamp": "2025-12-11T...",
    "environment": "production"
  }
  ```

### 5. Логи (перевірити)

Очікувані повідомлення у Deploy Logs:

```
✅ Server running on port 3000
🌍 Environment: production
⚠️ Email configuration not found - email notifications disabled
⚠️ Google Sheets credentials not found - sheets integration disabled
```

**Це нормально!** Email та Sheets опціональні.

## Після deployment

### Frontend оновлення

У `index.html` (рядок ~1098):

```javascript
// Змінити:
fetch('/api/payment/create', {
    method: 'POST',
    ...
})

// На:
fetch('https://your-app.railway.app/api/payment/create', {
    method: 'POST',
    ...
})
```

### LiqPay налаштування

1. Увійти у https://www.liqpay.ua/
2. **API** → **Налаштування**
3. Додати:
   - **Server URL (callback):** `https://your-app.railway.app/api/payment/callback`
   - **Result URL:** `https://your-app.railway.app/success`

### Тестування

1. **Health check:**
   ```bash
   curl https://your-app.railway.app/health
   ```

2. **Тестовий платіж:**
   - Відкрити сайт
   - Заповнити форму передзамовлення
   - Використати тестову картку LiqPay
   - Перевірити редирект на success/error

3. **Перевірити логи:**
   - Railway → **Deployments** → **View Logs**
   - Переконатися що запити логуються

## Troubleshooting

### ❌ Build Failed: "npm ci" error
**Рішення:** ✅ Виправлено! Створено `package-lock.json`

### ❌ nodemailer.createTransporter is not a function
**Рішення:** ✅ Виправлено! Email тепер опціональний

### ❌ Port already in use
**Рішення:** Railway автоматично встановлює `PORT` env variable

### ⚠️ Email не працює
**Це нормально!** Email опціональний. Додайте EMAIL змінні коли потрібно.

### ⚠️ Google Sheets не працює
**Це нормально!** Sheets опціональний. Додайте GOOGLE змінні коли потрібно.

## Моніторинг

Railway надає:
- **Metrics:** CPU, Memory, Network
- **Logs:** Real-time логи
- **Deployments:** Історія deployment'ів

Перевірити: Railway → **Metrics** та **Logs**

## Оновлення коду

Для deploy нових змін:

```bash
git add .
git commit -m "Update server"
git push
```

Railway автоматично запустить re-deployment.

## Відкат (Rollback)

Якщо щось пішло не так:

1. Railway → **Deployments**
2. Знайти останній робочий deployment
3. Натиснути **⋯** → **Redeploy**

---

## 📊 Статус готовності: 100%

✅ Всі критичні виправлення зроблені
✅ package-lock.json створено
✅ nodemailer вразливість виправлена
✅ Email та Sheets опціональні
✅ Dockerfile оптимізовано
✅ Документація готова

**Готово до deployment!** 🚀

---

**Останнє оновлення:** 11 грудня 2025
**Commit:** 58da792
**GitHub:** https://github.com/oleg-github-collab/mak-sale
