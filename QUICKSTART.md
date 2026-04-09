🎉 **HƯỚNG DẪN SỬ DỤNG NGAY HÔM NAY**

## 🚀 TRỊ NHANH (5 phút)

### **Bước 1: Bot đã chạy rồi ✅**
- Telegram: @Mimi_suabot
- Test now! Gõ "120ml"

### **Bước 2: Mở Dashboard**
File: `c:\Users\24h\Desktop\AI\Uống sữa\dashboard\index.html`
- Click đúp → opens browser
- Test: Bấm nút "60ml"

### **Bước 3: Dùng**
- **Bú sữa?** → Chat Bot (@Mimi_suabot)
- **Xem tổng?** → Dashboard browser

---

## 🔧 TƯƠNG LAI (Deploy 24/7)

**Tuần sau**: Xem file `DEPLOY_A.md` để:
- Deploy Bot lên **Replit/Railway**
- Deploy Dashboard lên **Netlify/Vercel**

---

## 📝 CHEATSHEET

### Bot Commands
```
120ml                → Add 120ml
90ml lúc 8h          → Add 90ml at 8am
bú mẹ 15p            → Add 15min breastfeed
/today               → Today total
/undo                → Delete last record
[Buttons] 60/90/120  → Quick buttons
```

### Dashboard
```
[60ml] [90ml] [120ml] [150ml]  → Quick add
[➕ Thêm lượng khác]            → Custom amount
Timeline                        → History today
  - Hover: [✏️ Sửa] [🗑️ Xoá]  → Edit/Delete record
  
Modal chỉnh sửa:
  - Thời gian (HH:MM)
  - Lượng sữa (ml)
  - Ghi chú (nôn trớ, ngủ, ...)
```

---

## ⚠️ NHỚ KỸ

**Data lưu ở 2 chỗ**:
- Bot: 📁 `data/feedings.json`
- Dashboard: 💾 Browser localStorage

**Khi dùng**:
- Thêm ở Bot → chỉ Bot thấy
- Thêm ở Dashboard → chỉ Dashboard thấy

**Muốn sync?** → Sau nâng cấp Phương Án B (API)

---

## ❓ TROUBLESHOOT

| Vấn đề | Giải pháp |
|---|---|
| Bot không reply | Kiểm tra token `.env` đúng |
| Dashboard không lưu | Xoá cache (Ctrl+Shift+Del) |
| Data mất sau khi xoá cookies | Đặc tính Phương Án A |

---

## 📞 LIÊN HỆ

Cần help? → Chat với mình! Tôi có thể:
- Fix lỗi
- Add tính năng
- Deploy cloud
- Upgrade Phương Án B

---

**Let's go! 🚀**
