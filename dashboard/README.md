# 🍼 Mimi Sữa - Web Dashboard

Web app tối giản để xem thống kê lượng sữa bé uống hôm nay.

## � Tính năng

✅ Hiển thị tổng ml hôm nay
✅ Progress bar cấp độ% 
✅ Nút nhanh: 60ml, 90ml, 120ml, 150ml
✅ Input lượng tuỳ chọn
✅ Timeline chi tiết các lần bú
✅ **✏️ Edit thông tin** (thời gian, lượng, ghi chú)
✅ **🗑️ Delete bản ghi**
✅ Lưu vào localStorage (không cần database)
✅ Dark mode
✅ Mobile friendly
✅ Real-time sync từ Bot API (nếu có)

## 🚀 Cách sử dụng

### **Option 1: Mở file HTML trực tiếp (nhanh nhất)**
1. Mở thư mục: `c:\Users\24h\Desktop\AI\Uống sữa\dashboard\`
2. Click đúp vào `index.html`
3. Opens trong browser → ready!

### **Option 2: Dùng HTTP server**
```bash
cd "c:\Users\24h\Desktop\AI\Uống sữa\dashboard"

# Python 3
python -m http.server 8000

# Rồi mở: http://localhost:8000
```

## 📱 Mobile Widget (Lock Screen)

Sẽ thêm sau. Hiện tại dùng Telegram Bot xem nhanh nhất.

## 🔄 Kết nối Bot + Dashboard

- **Bot ghi data** → `bot/data/feedings.json`
- **Dashboard đọc** → từ `localStorage` (browser)
- **Cần sync**: Tôi sẽ thêm API server sau

## 🎨 Design

- Pastel colors
- Tối giản
- Dễ đọc trên mobile
- Dark mode tự động

## 🛠️ Nâng cấp sau

- API server (Node.js/Python)
- Biểu đồ 7 ngày
- Widget Telegram
- Export báo cáo
