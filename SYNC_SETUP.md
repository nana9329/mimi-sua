# 🔄 SETUP SYNC DATA (Bot ↔ Dashboard)

## 📋 Tóm tắt

- **Bot** ghi data → `data/feedings.json`
- **API Server** đọc file này → expose `/api/feedings/today`
- **Dashboard** gọi API → hiển thị real-time

---

## 🚀 Cài packages mới

```bash
cd "c:\Users\24h\Desktop\AI\Uống sữa\bot"
python -m pip install flask flask-cors
```

---

## ⚙️ Chạy toàn bộ hệ thống (3 terminal)

### **Terminal 1: API Server**
```bash
cd "c:\Users\24h\Desktop\AI\Uống sữa\bot"
python api.py
```
Expected: `🔌 Mimi Sữa API Server running on http://localhost:5000`

### **Terminal 2: Telegram Bot**
```bash
cd "c:\Users\24h\Desktop\AI\Uống sữa\bot"
python bot.py
```
Expected: `🤖 Mimi Sữa Bot đang hoạt động...`

### **Terminal 3: Dashboard (optional, nếu muốn serve HTTP)**
```bash
cd "c:\Users\24h\Desktop\AI\Uống sữa\dashboard"
python -m http.server 8000
```
Expected: `Serving HTTP on 0.0.0.0 port 8000`

---

## 📱 Test Sync

### **1. Mở Dashboard**
```
http://localhost:8000
hoặc
File: c:\Users\24h\Desktop\AI\Uống sữa\dashboard\index.html
```

### **2. Bú sữa trên Bot**
- Telegram: @Mimi_suabot
- Gõ: `120ml`

### **3. Xem Dashboard**
- Bấm refresh (Ctrl+R)
- Sau 3 giây tự update
- Phải thấy 120ml hiện lên ✅

---

## ✨ Tính năng

✅ **Real-time sync**: Dashboard tự update mỗi 3s  
✅ **Nút button liên tục**: Bot hiện nút sau mỗi lần thêm  
✅ **Fallback**: Nếu API down → dùng localStorage  
✅ **Multi-source**: Thây priority Bot API > localStorage  

---

## 🔍 DEBUG

| Vấn đề | Giải pháp |
|---|---|
| Dashboard trống | Kiểm tra API port 5000 |
| Bot không show button | Restart bot.py |
| Data không update | Refresh browser |
| API error CORS | Kiểm tra flask-cors cài chưa |

---

## 🌐 API Endpoints

```
GET /api/health
→ { "status": "ok" }

GET /api/feedings/today
→ { "date": "2026-04-09", "feedings": [...], "total_ml": 250 }

GET /api/feedings
→ { "feedings": [...] }
```

---

## 📊 Architecture

```
Telegram (@Mimi_suabot)
    ↓ Chat "120ml"
Bot (bot.py) ← ghi nhận
    ↓ lưu
data/feedings.json
    ↑ đọc
API Server (api.py) ← port 5000
    ↑ gọi
Dashboard (index.html) ← auto-refresh 3s
    ↑ show user
Browser
```

---

**Làm xong? Báo lại!** 👍
