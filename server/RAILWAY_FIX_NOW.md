# 🚨 RAILWAY - ШВИДКЕ ВИПРАВЛЕННЯ

## Проблема: Error loading page

### ✅ РІШЕННЯ (2 хвилини):

---

## Крок 1: Встановіть Root Directory

**ЦЕ НАЙВАЖЛИВІШЕ!**

1. Відкрийте Railway
2. Ваш проєкт → **Settings** (шестерня)
3. Знайдіть секцію **Service Settings**
4. Знайдіть **Root Directory**
5. Встановіть: **`server`**
6. Натисніть **Save**

**БЕЗ ЦЬОГО НІЧОГО НЕ ПРАЦЮВАТИМЕ!**

---

## Крок 2: Додайте змінну NODE_ENV

1. Railway → **Variables**
2. Натисніть **+ New Variable**
3. Name: `NODE_ENV`
4. Value: `production`
5. Натисніть **Add**

---

## Крок 3: Redeploy

1. Railway → **Deployments**
2. Знайдіть останній deployment
3. Натисніть **⋯** (три крапки)
4. Натисніть **Redeploy**

Зачекайте 2-3 хвилини.

---

## Крок 4: Перевірка

### А) Відкрийте головну сторінку:
```
https://your-app.railway.app/
```

**Якщо працює** - вітаю! ✅

**Якщо бачите "File Not Found"** - на сторінці буде інформація про шляхи. Подивіться:

- `NODE_ENV:` має бути `production`
- `Public exists:` має бути `true`
- `__dirname:` має бути `/app`
- `publicDir:` має бути `/app/public`

### Б) Перевірте debug endpoint:
```
https://your-app.railway.app/api/debug/files
```

Має показати:
```json
{
  "__dirname": "/app",
  "publicDir": "/app/public",
  "public exists": true,
  "public contents": ["index.html", "success.html", "error.html", "css", "js"]
}
```

### В) Перевірте логи:

Railway → **Deployments** → **View Logs**

Шукайте:
```
✅ Server running on port 3000
📁 Serving static files from: /app/public
```

**Якщо бачите `/app/..` замість `/app/public`** - NODE_ENV не встановлено.

---

## Типові помилки:

### ❌ Root Directory не встановлено
**Симптом:** `__dirname: /app` але файли не знайдені
**Причина:** Railway шукає Dockerfile в корені, а він в `server/`
**Рішення:** Settings → Root Directory → `server`

### ❌ NODE_ENV не встановлено
**Симптом:** `publicDir: /app/..`
**Причина:** Код використовує `..` для development
**Рішення:** Variables → NODE_ENV → `production`

### ❌ public/ не створюється
**Симптом:** `public exists: false`
**Причина:** Dockerfile не копіює файли
**Рішення:** Перевірити що `server/public/` є в git, redeploy

---

## Якщо все ще не працює:

### Перевірте git:

```bash
cd server/
ls -la public/
```

Має показати:
```
public/
├── index.html       ← ВАЖЛИВО!
├── success.html
├── error.html
├── css/
└── js/
```

Якщо файли є, але Railway їх не бачить:

```bash
git status server/public/
git add server/public/
git commit -m "Ensure public files are tracked"
git push
```

Потім redeploy на Railway.

---

## Контрольний список (перевірте ВСЕ):

- [ ] Railway Settings → Root Directory = `server` ⭐ КРИТИЧНО
- [ ] Railway Variables → NODE_ENV = `production` ⭐ КРИТИЧНО
- [ ] Railway Variables → PORT = `3000`
- [ ] `server/public/index.html` є в git репозиторії
- [ ] `server/public/success.html` є в git репозиторії
- [ ] `server/public/error.html` є в git репозиторії
- [ ] Зроблено Redeploy після змін
- [ ] Логи показують `/app/public` (не `/app/..`)
- [ ] `/api/debug/files` показує `public exists: true`

---

## Після виправлення:

1. **Головна сторінка працює:** https://your-app.railway.app/
2. **Health check OK:** https://your-app.railway.app/health
3. **Debug показує все OK:** https://your-app.railway.app/api/debug/files

---

## 📞 Якщо досі не працює:

Надішліть скріншоти:

1. Railway Settings (Root Directory)
2. Railway Variables (NODE_ENV, PORT)
3. Вивід з `/api/debug/files`
4. Railway Logs (перші 50 рядків)

---

**99% проблем вирішується встановленням Root Directory на `server`!** ✅

**Commit:** d83ee32
**GitHub:** https://github.com/oleg-github-collab/mak-sale
