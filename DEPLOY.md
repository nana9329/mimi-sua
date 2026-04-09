# 🚀 Hướng Dẫn Deploy Mimi Sữa

## 📋 Tổng Quan

Mimi Sữa có 2 phần cần deploy:
1. **Backend** (Bot + API): Railway
2. **Frontend** (Dashboard): Netlify

---

## 🤖 Part 1: Deploy Telegram Bot + Flask API → Railway

### Bước 1: Chuẩn bị trên Railway

1. Truy cập [railway.app](https://railway.app)
2. Đăng nhập bằng GitHub
3. Create New Project → Empty Project

### Bước 2: Connect Repository

```bash
# Trong terminal, cd đến thư mục bot
cd bot

# Init git (nếu chưa có)
git init
git add .
git commit -m "Initial commit"

# Thêm Railway remote
railway link

# Deploy
railway up
```

### Bước 3: Set Environment Variables

Trên Railway Dashboard:
1. Chọn project
2. Variables → Add Variable
3. Thêm:
   ```
   TELEGRAM_BOT_TOKEN=8793222247:AAHj1W5reUSObyBAi_7Wr1DwxZjekmWELWg
   FLASK_ENV=production
   ```

### Bước 4: Verify Bot Chạy

Mở Telegram → chat @Mimi_suabot → test `/start`

✅ Bot chạy lên Railway thành công!

---

## 🌐 Part 2: Deploy Dashboard → Netlify

### Bước 1: Prepare Files

1. Tạo thư mục mới `dashboard-deploy`:
```bash
mkdir dashboard-deploy
cp dashboard/index.html dashboard-deploy/
cp dashboard/dashboard.js dashboard-deploy/
```

2. Tạo file `netlify.toml`:
```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Bước 2: Update API URL

Trong `dashboard-deploy/dashboard.js`, tìm:
```javascript
const BOT_API_URL = 'http://localhost:5000/api';
```

Đổi thành (Railway URL của bạn):
```javascript
const BOT_API_URL = 'https://your-railway-app.railway.app/api';
```

### Bước 3: Deploy to Netlify

**Cách 1: Drag & Drop**
1. Truy cập [netlify.com](https://netlify.com)
2. Drag thư mục `dashboard-deploy` vào Netlify
3. Done! ✨

**Cách 2: Via Git**
```bash
# Push lên GitHub
git add dashboard-deploy/
git commit -m "Add dashboard"
git push origin main

# Trên Netlify: Connect GitHub → Select repo → Deploy
```

### Bước 4: Enable CORS (Railway)

Flask API cần cho phép Dashboard access:
- Dashboard sẽ ở domain: `https://your-site.netlify.app`
- Bot API ở domain: `https://your-railway-app.railway.app`

Cập nhật `bot/api.py`:
```python
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": ["https://your-site.netlify.app"],
        "methods": "GET",
        "allow_headers": "Content-Type"
    }
})
```

---

## ✅ Final Checklist

- [ ] Bot token set in Railway
- [ ] Bot running (@Mimi_suabot responds)
- [ ] Dashboard deployed to Netlify
- [ ] Dashboard URL updated in JS
- [ ] CORS enabled on Flask API
- [ ] Dashboard can fetch from API
- [ ] Chart displays 7-day data
- [ ] Edit/Delete buttons work

---

## 🔗 Live URLs

After deployment:
- **Dashboard**: `https://your-site.netlify.app`
- **Bot**: `https://t.me/Mimi_suabot`
- **API**: `https://your-railway-app.railway.app/api/feedings/today`

---

## 🆘 Troubleshooting

### Bot not responding
- Check Telegram token in Railway variables
- Check logs: `railway logs`

### Dashboard can't fetch from API
- Verify CORS is enabled
- Check API URL in `dashboard.js`
- Check Railway URL is correct

### Dashboard not updating
- Check browser console (F12)
- Verify API returns JSON
- Check if Bot has sent data

---

## 📞 Support

1. Check logs: `railway logs`
2. Test API manually:
   ```bash
   curl https://your-railway-app.railway.app/api/feedings/today
   ```
3. Check Telegram bot:
   - Send `/today` in chat
