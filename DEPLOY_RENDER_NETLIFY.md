# 🚀 Deploy Render + Netlify (Hoàn toàn miễn phí)

## **PHẦN 1: Deploy Bot + API lên Render**

### **Bước 1: Vào Render**
1. Vào: https://render.com
2. Click **"Sign up"** (chọn GitHub)
3. Authorize Render for GitHub

### **Bước 2: Tạo Web Service**
1. Dashboard Render → Click **"New +"** (góc trên phải)
2. Chọn **"Web Service"**
3. Kết nối GitHub → Click **"Connect"** bên cạnh repo `mimi-sua`

### **Bước 3: Config Render**

Điền các thông tin:

| Trường | Giá trị |
|-------|--------|
| **Name** | `mimi-sua` (hoặc gì cũng được) |
| **Environment** | `Python 3` |
| **Region** | `Singapore` (chọn gần bạn) |
| **Branch** | `main` |
| **Root Directory** | `bot/` ⭐ |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `python bot.py` |

### **Bước 4: Add Environment Variables**

Scroll xuống tìm mục **"Environment"** hoặc **"Environment Variables"**

Click **"Add Environment Variable"** 4 lần:

**Variable 1:**
```
Key: TELEGRAM_BOT_TOKEN
Value: 8793222247:AAHj1W5reUSObyBAi_7Wr1DwxZjekmWELWg
```

**Variable 2:**
```
Key: FLASK_ENV
Value: production
```

**Variable 3:**
```
Key: CORS_ORIGINS
Value: https://placeholder.netlify.app
(Sẽ update lại sau)
```

**Variable 4:**
```
Key: PORT
Value: 5000
```

### **Bước 5: Deploy**

1. Click **"Create Web Service"** (nút xanh dưới cùng)
2. ⏳ Chờ deploy (2-5 phút)

**Khi xong, sẽ thấy:**
- ✅ Status = "Live"
- ✅ URL như: `https://mimi-sua.onrender.com`

📌 **COPY URL này! Bạn sẽ cần lúc sau** ⭐

---

## **PHẦN 2: Deploy Dashboard lên Netlify**

### **Bước 1: Vào Netlify**
1. Vào: https://netlify.com
2. Click **"Sign up"** (chọn GitHub)
3. Authorize Netlify for GitHub

### **Bước 2: Deploy từ GitHub**
1. Dashboard → Click **"Add new site"**
2. Chọn **"Import an existing project"**
3. Chọn GitHub
4. Authorize
5. Chọn repo: `mimi-sua`

### **Bước 3: Config Netlify**

Netlify sẽ hỏi build settings:

| Trường | Giá trị |
|-------|--------|
| **Base directory** | `dashboard/` |
| **Build command** | (để trống) |
| **Publish directory** | `dashboard/` |

Click **"Deploy site"**

---

### **Bước 4: Lấy Netlify URL**

⏳ Chờ deploy (1-2 phút)

Khi xong, bạn sẽ thấy:
```
Your site is live!
Site name: xxxxx.netlify.app
```

**COPY URL này!** ⭐

---

## **PHẦN 3: Update CORS + API URL**

### **Bước 1: Update Render Environment Variable**

Quay lại Render:
1. Dashboard → Project `mimi-sua`
2. Tab **"Environment"**
3. Tìm biến `CORS_ORIGINS`
4. **Edit** → Update giá trị:

```
https://xxxxx.netlify.app
```
(Thay `xxxxx` bằng tên Netlify của bạn)

5. Click **"Save"**
6. Render sẽ **auto-redeploy** (2-3 phút)

### **Bước 2: Update Dashboard API URL (nếu cần)**

Có 2 cách:

**Cách A: Update trực tiếp code (dễ nhất)**
1. Qua lại VS Code workspace: `c:\Users\24h\Desktop\AI\Uống sữa`
2. Mở file: `dashboard/dashboard.js`
3. Tìm dòng:
   ```javascript
   const BOT_API_URL = "http://localhost:5000";
   ```
4. Đổi thành:
   ```javascript
   const BOT_API_URL = "https://mimi-sua.onrender.com";
   ```
   (Dùng URL Render của bạn)
5. Save & push GitHub:
   ```bash
   git add dashboard/dashboard.js
   git commit -m "Update API URL to Render"
   git push
   ```
6. Netlify sẽ auto-redeploy (1-2 phút)

**Cách B: Update via Netlify UI (không cần push)**
1. Netlify dashboard → `Site settings` → `Build & deploy` → `Environment`
2. Add variable:
   ```
   Key: API_URL
   Value: https://mimi-sua.onrender.com
   ```
3. Redeploy

---

## ✅ **Xác nhận hoạt động**

### **1. Test Bot**
1. Vào Telegram: @Mimi_suabot
2. Send: `/start`
3. Nên thấy response

### **2. Test API**
Chạy trong PowerShell:
```powershell
curl https://mimi-sua.onrender.com/api/health
```
Sẽ thấy: `{"status":"ok"}`

### **3. Test Dashboard**
1. Vào: `https://xxxxx.netlify.app`
2. Sẽ thấy dashboard
3. Thử add: "120ml"
4. Nên thấy dữ liệu cập nhật

---

## 📋 **Tóm tắt URLs cuối cùng**

| Thành phần | URL |
|-----------|-----|
| **Bot** | https://t.me/Mimi_suabot |
| **API** | https://mimi-sua.onrender.com |
| **Dashboard** | https://xxxxx.netlify.app |

---

## 💰 **Chi phí**

- Render: **$0/month** (free tier miễn phí)
- Netlify: **$0/month** (free tier miễn phí)
- **TỔNG: $0/month** ✅

---

## ⚠️ **Lưu ý quan trọng**

### **Render sleep nếu không dùng?**
- Free tier Render: **Có spin down nếu inactive**
- Giải pháp: Dùng Uptime Robot để ping mỗi 5 phút (free)

### **Cách setup Uptime Robot (Optional)**
1. Vào: https://uptimerobot.com
2. Login/Signup (free)
3. Click **"+ Add Monitor"**
4. **Monitor Type:** `HTTP(s)`
5. **URL:** `https://mimi-sua.onrender.com/api/health`
6. **Friendly Name:** `Mimi Sua Bot API`
7. **Monitoring Interval:** `5 minutes`
8. Click **"Create Monitor"**

✅ Bot sẽ luôn sống! (Uptime Robot ping mỗi 5 phút)

---

## 🎉 **Công nhân!**

Bây giờ bạn đã có:
- ✅ Bot chạy 24/7 trên Render
- ✅ API sync data
- ✅ Dashboard live trên Netlify
- ✅ Hoàn toàn miễn phí

**Hãy báo cho mình khi xong mỗi bước!** 🚀
