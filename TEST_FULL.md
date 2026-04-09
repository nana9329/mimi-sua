# 🧪 FULL TEST PLAN - Mimi Sữa App

**Status**: ✅ Bot running | ✅ API running | ✅ Dashboard ready

---

## 📋 TEST CHECKLIST

### ✅ PHẦN 1: TEST BOT (Telegram)

**Mở Telegram → @Mimi_suabot**

#### Test 1.1: Nút nhanh liên tục
```
✓ Click [60ml]
Expected: ✅ Đã ghi nhận 60ml. Tổng hôm nay: 60/800ml 📈 8%

✓ Click [90ml]
Expected: ✅ Đã ghi nhận 90ml. Tổng hôm nay: 150/800ml 📈 19%

✓ Click [120ml]
Expected: ✅ Đã ghi nhận 120ml. Tổng hôm nay: 270/800ml 📈 34%

Quan sát: Nút button phải hiện liên tục sau mỗi lần click ✅
```

#### Test 1.2: Chat tự nhiên
```
✓ Gõ: 120ml
Expected: ✅ Đã ghi nhận. Tổng hôm nay: 390/800ml 📈 49%
         + Nút button hiện

✓ Gõ: 90ml lúc 8h
Expected: ✅ Đã ghi nhận 90ml (lúc 8h). Tổng: 480/800ml
         + Nút button hiện

✓ Gõ: bú mẹ 15p
Expected: ✅ Đã ghi nhận 🤱 15p (~150ml). Tổng: ~630/800ml
```

#### Test 1.3: Lệnh /today
```
✓ Gõ: /today
Expected: Hiển thị timeline hôm nay
📊 Tổng hôm nay: 630ml / 800ml
📈 79%
⏰ Chi tiết:
1. [time] 🍼 120ml
2. [time] 🍼 90ml
3. [time] 🤱 15p
... ect
```

#### Test 1.4: Lệnh /undo
```
✓ Gõ: /undo
Expected: 🗑️ Đã xoá: [time] - 150ml (bú 15p)
         Total giảm từ 630 → 480ml
```

---

### ✅ PHẦN 2: TEST DASHBOARD (Browser)

**Mở file: `c:\Users\24h\Desktop\AI\Uống sữa\dashboard\index.html`**

#### Test 2.1: Hiển thị sync từ Bot
```
✓ Bấm refresh (Ctrl+R)
Expected: Dashboard hiển thị data từ Bot:
  - Total: 480ml (sau /undo)
  - Progress: 60%
  - Timeline: 4 items (từ nút nhanh + chats)
  - Có text: "📡 từ Bot (read-only)"
```

#### Test 2.2: Thêm data trên Dashboard
```
✓ Bot API vẫn running
Expected: Mỗi 3 giây auto-refresh (không cần bấm refresh)

✓ Bấm [60ml]
Expected: Total tăng 60ml → 540ml
         Progress: 68%
         New item hiện ở timeline (dưới cùng)
         Timeline có nút [✏️ Sửa] [🗑️ Xoá]
```

#### Test 2.3: Edit thông tin
```
✓ Timeline → Hover vào item 60ml mới thêm
Expected: Hiện nút [✏️ Sửa] [🗑️ Xoá]

✓ Click [✏️ Sửa]
Expected: Modal pop-up:
┌─────────────────────┐
│ ✏️ Chỉnh sửa thông tin
├─────────────────────┤
│ Thời gian: [16:45]
│ Lượng sữa: [60]
│ Ghi chú: [    ]
├─────────────────────┤
│ [❌ Huỷ] [💾 Lưu]
└─────────────────────┘

✓ Change:
   - Lượng: 60 → 100
   - Ghi chú: nôn trớ

✓ Click [💾 Lưu]
Expected: Modal close
         Timeline update: 100ml (nôn trớ)
         Total tăng: 540 → 580ml
         Progress: 73%
```

#### Test 2.4: Delete thông tin
```
✓ Timeline → Hover vào item 100ml (vừa edit)
Expected: Hiện nút [✏️ Sửa] [🗑️ Xoá]

✓ Click [🗑️ Xoá]
Expected: Item disappear ngay
         Total giảm: 580 → 480ml
         Progress: 60%
```

#### Test 2.5: Dark mode
```
✓ F12 → DevTools → Toggle more tools → Rendering
✓ Emulate: prefers-color-scheme: dark
Expected: Dashboard chuyển sang giao diện tối
```

#### Test 2.6: Mobile responsive
```
✓ F12 → Toggle device toolbar (Ctrl+Shift+M)
✓ Chọn: iPhone 12
Expected: Dashboard fit trên mobile
         Nút, text, timeline responsive
```

#### Test 2.7: Input tuỳ chọn
```
✓ Click [➕ Thêm lượng khác]
Expected: Prompt: "Nhập lượng sữa (ml): [100]"

✓ Input: 75
Expected: Timeline thêm item 75ml
         Total: 480 + 75 = 555ml
         Progress: 69%
```

---

### ✅ PHẦN 3: TEST SYNC (Bot ↔ Dashboard)

#### Test 3.1: Bot → Dashboard
```
✓ Telegram @Mimi_suabot: Gõ "150ml"
✓ Chờ 1-3 giây
Expected: Dashboard auto-update:
  - Total tăng 150ml
  - New item hiện (read-only từ Bot)
  - Không có nút Edit/Delete
  - Text: "📡 từ Bot (read-only)"
```

#### Test 3.2: Dashboard → Bot
```
⚠️ Expected: KHÔNG sync
  - Dashboard thêm data
  - Bot KHÔNG thấy data mới
  (Phương Án A: data riêng lẻ)
```

#### Test 3.3: API endpoints
```
✓ Browser → URL: http://localhost:5000/api/health
Expected: {"status": "ok", "message": "Mimi Sữa API running"}

✓ Browser → URL: http://localhost:5000/api/feedings/today
Expected: 
{
  "date": "2026-04-09",
  "feedings": [...],
  "total_ml": 555
}
```

---

## 📊 EXPECTED FINAL RESULTS

### Bot terminnal
```
✅ Nút button hiện sau mỗi lần thêm
✅ Parse tiếng Việt (120ml, 90ml lúc 8h, bú mẹ 15p)
✅ /today hiển thị timeline
✅ /undo xoá bản ghi
```

### Dashboard
```
✅ Sync từ Bot API (auto-update 3s)
✅ Thêm data mới bằng nút/input
✅ Edit thông tin (modal)
✅ Delete bản ghi
✅ Dark mode + Mobile responsive
✅ Progress bar animated
✅ Timeline rõ ràng
```

### API
```
✅ Port 5000 running
✅ CORS enabled (Dashboard bây giờ calling)
✅ /api/feedings/today return data
```

---

## ⚠️ NOTES

**Nếu gặp vấn đề:**

| Lỗi | Giải pháp |
|---|---|
| Dashboard trống | Kiểm tra API port 5000 chạy |
| Bot không show button | Restart `python bot.py` |
| Data không update Dashboard | Refresh page hoặc check network |
| Edit modal không hiện | F12 check console errors |
| Delete không work | Confirm data từ localStorage không từ Bot |

---

## 🎯 TEST TIME

Khoảng **15-20 phút** để test hết (nếu tất cả OK)

**Let's go! 🚀**
