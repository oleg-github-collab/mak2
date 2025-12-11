# 🔌 Railway Port Configuration - ВИПРАВЛЕННЯ

## Проблема: Domain shows "Waiting for DNS update"

Це означає що Railway не може підключитися до вашого сервера на порту 8080.

---

## ✅ РІШЕННЯ:

### Варіант 1: Видалити PORT з Variables (РЕКОМЕНДОВАНО)

Railway автоматично встановлює змінну `PORT`. Якщо ви встановили `PORT=3000` вручну, це може конфліктувати.

1. Railway → **Variables**
2. Знайдіть змінну `PORT`
3. Натисніть **⋯** → **Remove**
4. Railway автоматично встановить правильний порт
5. **Redeploy**

### Варіант 2: Змінити Domain Port

1. Railway → **Settings** → **Networking** → **Domains**
2. Знайдіть ваш домен (server-production-23da.up.railway.app)
3. Натисніть **Edit Port**
4. Змініть з `8080` на `3000` (або на той PORT що в Variables)
5. Натисніть **Update**

---

## 🔍 Як перевірити який PORT використовується:

### Подивіться Railway Logs:

Railway → **Deployments** → **View Logs**

Шукайте рядки:
```
🚀 Starting Roots & Wings Server...
📌 PORT from env: 8080
📌 Using PORT: 8080
```

Якщо бачите:
- `PORT from env: undefined` → Railway не встановив PORT
- `PORT from env: 3000` → Ви встановили PORT вручну
- `PORT from env: 8080` → Railway встановив автоматично ✅

---

## 📋 Правильна конфігурація:

### Railway Variables (мінімум):
```env
NODE_ENV=production
LIQPAY_PUBLIC_KEY=your_key
LIQPAY_PRIVATE_KEY=your_key
ALLOWED_ORIGINS=*
```

**НЕ додавайте PORT!** Railway встановить автоматично.

### Domain Settings:
- **Domain:** server-production-23da.up.railway.app
- **Port:** Має відповідати тому що в логах
- **Protocol:** HTTP

### Custom Domain:
- **Domain:** xn--80aannbkklhueqiu2c5p.com
- **Port:** Той самий що і для Railway domain
- **Target:** server-production-23da.up.railway.app

---

## 🚨 Типові помилки:

### ❌ PORT встановлено вручну на 3000
**Проблема:** Railway domain налаштовано на 8080, але сервер слухає на 3000
**Рішення:** Видалити PORT з Variables, redeploy

### ❌ Domain Port не відповідає серверу
**Проблема:** Сервер слухає на 3000, domain налаштовано на 8080
**Рішення:** Edit Port → змінити на 3000

### ❌ Railway не встановлює PORT автоматично
**Проблема:** Логи показують `PORT from env: undefined`, сервер використовує 3000
**Рішення:** Або додати PORT=8080 в Variables, або змінити Domain Port на 3000

---

## ✅ Покрокова інструкція:

### Крок 1: Видаліть PORT з Variables
```
Railway → Variables → PORT → Remove
```

### Крок 2: Redeploy
```
Railway → Deployments → Latest → Redeploy
```

### Крок 3: Перевірте логи
```
Railway → Deployments → View Logs
```

Знайдіть: `📌 Using PORT: XXXX`

### Крок 4: Налаштуйте Domain Port
```
Railway → Settings → Networking → Domains
→ Edit Port → Встановіть на той самий PORT що в логах
```

### Крок 5: Зачекайте 1-2 хвилини

DNS має оновитися автоматично.

### Крок 6: Перевірте

```bash
curl https://server-production-23da.up.railway.app/health
```

Має повернути:
```json
{"status":"OK","timestamp":"...","environment":"production"}
```

---

## 🌐 Custom Domain (xn--80aannbkklhueqiu2c5p.com):

### Після того як Railway domain працює:

1. Railway → **Settings** → **Networking** → **Custom Domains**
2. Додайте: `xn--80aannbkklhueqiu2c5p.com`
3. Railway покаже DNS записи для налаштування:
   ```
   CNAME @ server-production-23da.up.railway.app
   ```
4. Додайте цей CNAME у вашого DNS провайдера
5. Зачекайте до 24 годин на DNS propagation

### Перевірка DNS:
```bash
dig xn--80aannbkklhueqiu2c5p.com
nslookup xn--80aannbkklhueqiu2c5p.com
```

---

## 🔧 Якщо все ще не працює:

### Перевірте всі змінні:
```bash
Railway → Variables
```

Мають бути:
- `NODE_ENV=production` ✅
- `LIQPAY_PUBLIC_KEY=...` ✅
- `LIQPAY_PRIVATE_KEY=...` ✅
- ~~`PORT=3000`~~ ❌ ВИДАЛИТИ!

### Перевірте Root Directory:
```bash
Railway → Settings → Root Directory
```

Має бути: `server` ✅

### Перевірте логи на помилки:
```bash
Railway → Deployments → View Logs
```

Шукайте:
- ✅ `Server running on port XXXX`
- ✅ `Serving static files from: /app/public`
- ❌ Будь-які помилки або crash

---

## 📊 Очікуваний результат:

### Railway Logs:
```
🚀 Starting Roots & Wings Server...
📌 PORT from env: 8080
📌 Using PORT: 8080
📌 NODE_ENV: production
📌 __dirname: /app
✅ Server running on port 8080
📁 Serving static files from: /app/public
```

### Domain Status:
- ✅ server-production-23da.up.railway.app → Active
- ⏳ xn--80aannbkklhueqiu2c5p.com → Waiting for DNS (нормально)

### Health Check:
```bash
curl https://server-production-23da.up.railway.app/health
# {"status":"OK",...}
```

---

**Головне:** НЕ встановлюйте PORT вручну - Railway зробить це автоматично! ✅

**Commit:** буде створено
**GitHub:** https://github.com/oleg-github-collab/mak-sale
