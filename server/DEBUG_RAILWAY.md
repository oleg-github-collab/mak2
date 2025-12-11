# 🔍 Діагностика Railway

## Проблема: `ENOENT: no such file or directory, stat '/index.html'`

Це означає що сервер не може знайти файли.

---

## Крок 1: Перевірте Root Directory в Railway

**КРИТИЧНО ВАЖЛИВО!**

1. Railway → ваш проєкт → **Settings**
2. Знайдіть **Root Directory**
3. Має бути встановлено: **`server`**

Якщо порожнє або інше значення - файли не знайдуться!

---

## Крок 2: Перевірте змінні середовища

Railway → **Variables** → перевірте:

```env
NODE_ENV=production   ← ОБОВ'ЯЗКОВО!
PORT=3000
```

Без `NODE_ENV=production` сервер шукатиме файли в `../` замість `public/`

---

## Крок 3: Використайте debug endpoint

Після deployment відкрийте:

```
https://your-app.railway.app/api/debug/files
```

Має показати:
```json
{
  "__dirname": "/app",
  "publicDir": "/app/public",
  "public exists": true,
  "public contents": ["index.html", "success.html", "error.html", "css", "js"],
  "index.html exists": true,
  "success.html exists": true,
  "error.html exists": true
}
```

### Якщо `public exists: false`:
- ❌ Root Directory не встановлено на `server`
- **Рішення:** Railway Settings → Root Directory → `server`

### Якщо `publicDir: "/app/.."`:
- ❌ `NODE_ENV` не встановлено на `production`
- **Рішення:** Railway Variables → додати `NODE_ENV=production`

### Якщо `index.html exists: false`:
- ❌ Файли не скопіювалися в Docker image
- **Рішення:** Перевірити що `server/public/` є в git

---

## Крок 4: Перевірте Railway Logs

Railway → **Deployments** → **View Logs**

Шукайте рядок:
```
📁 Serving static files from: /app/public
```

### Якщо бачите `/app/..`:
- NODE_ENV не production
- Додайте змінну `NODE_ENV=production`

### Якщо бачите помилки ENOENT:
- Файли не знайдені
- Перевірте Root Directory

---

## Крок 5: Перевірте структуру в Docker

Railway використовує Dockerfile, який створює таку структуру:

```
/app/                    ← WORKDIR
├── node_modules/
├── public/              ← Frontend файли тут
│   ├── index.html
│   ├── success.html
│   ├── error.html
│   ├── css/
│   └── js/
├── routes/
├── utils/
├── server.js
└── package.json
```

Якщо Root Directory = `server`, Railway:
1. Переходить у папку `server/` в репозиторії
2. Знаходить `Dockerfile`
3. Будує image з вмісту папки `server/`
4. Копіює `server/public/` → `/app/public/`

---

## Швидке виправлення

### Рішення 1: Встановити Root Directory

```
Railway → Settings → Root Directory → server
```

### Рішення 2: Додати NODE_ENV

```
Railway → Variables → + New Variable
Name: NODE_ENV
Value: production
```

### Рішення 3: Redeploy

```
Railway → Deployments → Latest → ⋯ → Redeploy
```

---

## Перевірка після виправлення

1. **Health check:**
   ```bash
   curl https://your-app.railway.app/health
   ```
   Має повернути: `{"status":"OK",...}`

2. **Debug files:**
   ```bash
   curl https://your-app.railway.app/api/debug/files
   ```
   Всі файли мають бути `true`

3. **Index page:**
   ```bash
   curl https://your-app.railway.app/
   ```
   Має повернути HTML

4. **Логи:**
   Railway Logs мають показати:
   ```
   ✅ Server running on port 3000
   📁 Serving static files from: /app/public
   ```

---

## Якщо все ще не працює

### Варіант А: Локальний тест Docker

```bash
cd server/
docker build -t mak-test .
docker run -e NODE_ENV=production -e PORT=3000 -p 3000:3000 mak-test
```

Відкрийте: http://localhost:3000

### Варіант Б: Перевірте git

```bash
cd server/
ls -la public/
```

Має показати:
```
public/
├── index.html
├── success.html
├── error.html
├── css/
└── js/
```

Якщо порожньо:
```bash
git status server/public/
git add server/public/
git commit -m "Add public files"
git push
```

---

## Контрольний список

- [ ] Railway Root Directory = `server`
- [ ] Railway Variable: `NODE_ENV=production`
- [ ] Railway Variable: `PORT=3000`
- [ ] `server/public/` існує в git
- [ ] `server/public/index.html` існує в git
- [ ] Dockerfile копіює всі файли (`COPY . .`)
- [ ] Redeploy після змін
- [ ] `/api/debug/files` показує всі файли
- [ ] Логи показують `/app/public`

---

**Після виконання цих кроків Railway має запрацювати!** ✅
