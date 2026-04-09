# 🍼 Mimi Sữa - App Theo Dõi Lượng Sữa Cho Bé

Ứng dụng đơn giản theo dõi lượng sữa bé uống mỗi ngày.

`Phương Án A`: Bot + Dashboard riêng lẻ (dễ & nhanh)

---

## 📱 Hệ thống

```
┌─────────────────┐                    ┌──────────────────┐
│   Telegram Bot  │                    │  Web Dashboard   │
│  @Mimi_suabot   │                    │   (Browser)      │
│                 │                    │                  │
│ • Chat tự nhiên │                    │ • Hiển thị tổng  │
│ • Nút nhanh     │  ← riêng lẻ →      │ • Progress bar   │
│ • /today        │                    │ • Timeline       │
│ • /undo         │                    │ • Nút nhanh      │
└─────────────────┘                    └──────────────────┘
       ↓                                        ↓
 data/feedings.json                  localStorage (browser)
```

---

## 🚀 Quick Start

### **1. Chạy Bot (Local)**
```bash
cd bot
python -m pip install -r requirements.txt
python bot.py
```
👉 @Mimi_suabot trên Telegram sẵn sàng!

### **2. Mở Dashboard**
```
c:\Users\24h\Desktop\AI\Uống sữa\dashboard\index.html
```
👉 Mở trên browser, bấm nút để test

---

## 📝 Cách dùng

### **Bot**
Chat trên Telegram @Mimi_suabot:
```
120ml                    → Ghi 120ml
90ml lúc 8h              → Ghi 90ml vào 8h
bú mẹ 15p                → Ghi bú mẹ 15p
/today                   → Xem tổng hôm nay
/undo                    → Xoá bản ghi gần nhất
[Nút nhanh] 60/90/120ml  → Bấm nút nhanh
```

### **Dashboard**
```
• Bấm nút: 60ml, 90ml, 120ml, 150ml → thêm vào
• Thêm lượng khác → input tuỳ chọn
• Xem timeline → chi tiết các lần bú
```

---

## 🎁 Tính năng

✅ Parse tiếng Việt tự nhiên  
✅ Nút nhanh trên Telegram  
✅ Dashboard đẹp & dễ dùng  
✅ Progress bar trực quan  
✅ Timeline chi tiết  
✅ **✏️ Edit thông tin** (thời gian, lượng, ghi chú)
✅ **🗑️ Delete bản ghi**  
✅ Lưu vào file JSON + localStorage  
✅ Dark mode tự động  
✅ Mobile friendly  
✅ **Real-time sync Bot ↔ Dashboard** (nếu API running)  

---

## 📂 Cấu trúc

```
Uống sữa/
├── bot/                    # Telegram Bot (Python)
│   ├── bot.py              # Chính
│   ├── parser.py           # Parse tin nhắn
│   ├── database.py         # Lưu data
│   ├── .env                # Token (mật)
│   ├── requirements.txt     # Dependencies
│   ├── Procfile             # Deploy Railway
│   └── data/               # Database
│       └── feedings.json
│
├── dashboard/              # Web Dashboard (HTML)
│   ├── index.html          # Giao diện
│   └── README.md
│
└── DEPLOY_A.md             # Hướng dẫn deploy
```

---

## 🌐 Deploy (Optional)

Xem file: `DEPLOY_A.md`

- **Bot**: Replit / Railway (chạy 24/7)
- **Dashboard**: Netlify / Vercel (static host)

---

## ⚠️ Lưu ý

**Phương Án A** (hiện tại):
- Bot và Dashboard data **riêng lẻ**
- Bú trên Bot → không hiện trên Dashboard
- Thêm trên Dashboard → không ghi vào Bot

**Nếu cần sync**: Upgrade lên **Phương Án B** (API Server)

---

## 🛠️ Tech Stack

- **Bot**: Python + python-telegram-bot
- **Dashboard**: HTML5 + CSS3 + Vanilla JS
- **Database**: JSON file + localStorage
- **Deploy**: Replit/Railway + Netlify/Vercel

---

## 📞 Support

❓ **Bot không chạy?**  
→ Kiểm tra token `.env`

❓ **Dashboard không lưu?**  
→ Kiểm tra localStorage (F12 → Application)

❓ **Cần sync data?**  
→ Thảo luận nâng cấp Phương Án B

---

**Made with ❤️ for busy parents**
