# 🚀 Deploy Free: Replit + Netlify ($0/month)

## 📋 Bước 1: Deploy Bot + API lên Replit

### **Step 1: Tạo Replit Account**
1. Vào: https://replit.com
2. Click **"Sign up"** (hoặc dùng GitHub)
3. Chọn **"I'm a student"** hoặc **"I'm a developer"**
4. Chọn tên username

### **Step 2: Import từ GitHub**
1. Click **"+ Create"** (trên cùng bên trái)
2. Chọn **"Import from GitHub"**
3. Paste đây: `https://github.com/nana9329/mimi-sua`
4. Click **"Import from GitHub"**
5. Chọn thư mục gốc: `.` (root)
6. Click **"Import"**

### **Step 3: Config Replit để chạy Bot**
1. Mở file **`.replit`** (hoặc tạo mới)
2. Dán cái này:

```ini
run = "cd bot && pip install -r requirements.txt && python bot.py"
```

3. Save (Ctrl+S)

### **Step 4: Add Environment Variables**
1. Click **"Secrets"** (biểu tượng khóa, bên trái)
2. Add các biến:

```
TELEGRAM_BOT_TOKEN = 8793222247:AAHj1W5reUSObyBAi_7Wr1DwxZjekmWELWg
FLASK_ENV = production
CORS_ORIGINS = https://YOUR_NETLIFY_SITE.netlify.app
PORT = 5000
```

3. Click **"Add Secret"** cho mỗi cái

### **Step 5: Run Bot**
1. Click **"Run"** (phía trên)
2. Terminal sẽ mở, chạy lệnh
3. Chờ thấy:
```
Bot is running at http://...
WARNING:  This is a development server. Do not use it in production.
```

✅ **Bot chạy rồi!**

### **Step 6: Lấy Replit URL**
1. Bên phải, sẽ thấy browser preview
2. Copy URL: `https://YOUR_REPLIT_NAME.replit.dev` hoặc tương tự
3. **Lưu lại URL này!**

---

## 📊 Bước 2: Deploy Dashboard lên Netlify

### **Step 1: Tạo Netlify Account**
1. Vào: https://netlify.com
2. Click **"Sign up"** (dùng GitHub dễ nhất)
3. Authorize Netlify for GitHub

### **Step 2: Connect GitHub Repo**
1. Click **"Add new site"**
2. Chọn **"Import an existing project"**
3. Select **GitHub**, chọn `mimi-sua`

### **Step 3: Config Netlify**
1. **Base directory:** `dashboard/` (hoặc để trống nếu dashboard ở root)
2. **Build command:** `echo done` (hoặc để trống)
3. **Publish directory:** `dashboard/`
4. Click **"Deploy site"**

### **Step 4: Update Dashboard API URL**
1. Vào **"Site settings"** (phía trên)
2. Click **"Environment"**
3. Add biến:
   - **Key:** `API_URL`
   - **Value:** `https://YOUR_REPLIT_NAME.replit.dev`
4. Save & redeploy

**Hoặc** edit `dashboard/dashboard.js` trước deploy:
```javascript
const BOT_API_URL = "https://YOUR_REPLIT_NAME.replit.dev";
```

### **Step 5: Lấy Dashboard URL**
Sau deploy (1-2 phút), bạn sẽ thấy:
```
Site name: xxx.netlify.app
```

Copy: `https://xxx.netlify.app`

---

## ⚙️ Bước 3: Update CORS + Lần cuối Setup

### **Trong Replit, update Environment Variables:**
```
FLASK_ENV = production
CORS_ORIGINS = https://xxx.netlify.app  ← URL Netlify của bạn
TELEGRAM_BOT_TOKEN = 8793222247:AAHj1W5reUSObyBAi_7Wr1DwxZjekmWELWg
PORT = 5000
```

### **Trong Netlify, update API URL:**
Nếu chưa setup ở bố 4, edit `dashboard/dashboard.js`:

```javascript
const BOT_API_URL = "https://YOUR_REPLIT_NAME.replit.dev";
```

Push lên GitHub → Netlify auto-redeploy

---

## 🎉 Xác nhận hoạt động

### **Kiểm tra Bot:**
1. Vào Telegram: @Mimi_suabot
2. Send `/start`
3. Nên thấy "Xin chào!"

### **Kiểm tra API:**
```bash
curl https://YOUR_REPLIT_NAME.replit.dev/api/health
```
Sẽ thấy: `{"status": "ok"}`

### **Kiểm tra Dashboard:**
1. Vào: https://xxx.netlify.app
2. Sẽ thấy dashboard
3. Thử add feeding: "120ml"
4. Nên thấy dữ liệu cập nhật

---

## ⚠️ Tùy chọn: Keep Replit Running (Optional)

Replit sẽ "sleep" nếu không dùng 1 giờ. Để giữ bot 24/7:

**Option A: Auto-ping (Free)**
1. Tạo cron job từ bên ngoài
2. Ping Replit URL mỗi 5 phút

**Option B: Uptime Robot (Free)**
1. Vào: https://uptimerobot.com
2. Free plan: Monitor 50 URLs
3. Add Replit URL: `https://YOUR_REPLIT_NAME.replit.dev/api/health`
4. Interval: 5 phút
5. ✅ Bot luôn sống!

---

## 💰 Chi phí tổng cộng

| Dịch vụ | Giá | Ghi chú |
|---------|-----|--------|
| Replit (Bot + API) | **$0** | Free tier tuyệt vời |
| Netlify (Dashboard) | **$0** | Free tier unlimited |
| Uptime Robot (Optional) | **$0** | Giữ bot chạy 24/7 |
| **TỔNG CỘNG** | **$0/month** | ✅ Hoàn toàn miễn phí! |

---

## 🔗 Tóm tắt URLs cuối cùng

- **Bot:** https://t.me/Mimi_suabot
- **API:** https://YOUR_REPLIT_NAME.replit.dev
- **Dashboard:** https://xxx.netlify.app
- **Monitoring:** https://uptimerobot.com

---

## 🆘 Troubleshoot

### **Bot không chạy**
→ Check Replit console, xem error

### **Dashboard không fetch API**
→ CORS_ORIGINS sai hoặc API không chạy
→ Update biến môi trường rồi redeploy

### **Replit sleep lúc random**
→ Dùng Uptime Robot để ping mỗi 5 phút

### **Netlify deploy thất bại**
→ Check `dashboard/` folder có file HTML không

---

**🎊 Xong! Hoàn toàn miễn phí, chạy 24/7 (với Uptime Robot)**

Báo cho mình khi setup xong từng bước! 🚀
