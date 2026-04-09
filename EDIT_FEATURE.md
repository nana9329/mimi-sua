# ✏️ TÍNH NĂNG CHỈNH SỬA (Edit/Delete)

## 📝 Tổng quan

Dashboard cho phép bạn **chỉnh sửa** hoặc **xoá** các bản ghi feeding sau khi thêm.

---

## 🎯 Cách sử dụng

### **1. Xem timeline**
```
Dashboard → Timeline "Chi tiết hôm nay"
```

### **2. Hover vào item**
```
Rê chuột vào một lần bú
→ Hiện nút: [✏️ Sửa] [🗑️ Xoá]
```

### **3. Click "✏️ Sửa"**
```
Modal pop-up:
┌─────────────────────────┐
│ ✏️ Chỉnh sửa thông tin  │
├─────────────────────────┤
│ Thời gian (HH:MM)  [08:30]
│ Lượng sữa (ml)     [120]
│ Ghi chú            [nôn trớ]
├─────────────────────────┤
│ [❌ Huỷ] [💾 Lưu]     │
└─────────────────────────┘
```

### **4. Chỉnh sửa thông tin**
- **Thời gian**: Bấm input → chọn từ time picker
- **Lượng sữa**: Nhập số (0-300ml)
- **Ghi chú**: Tuỳ chọn (nôn trớ, ngủ quên, ...)

### **5. Click "💾 Lưu"**
```
✅ Data cập nhật ngay
Dashboard refresh automatically
```

### **6. Hoặc click "🗑️ Xoá"**
```
⚠️ Confirm delete
✅ Item removed từ timeline
Total ml giảm đi
```

---

## ⚠️ LƯU Ý

### **Editable vs Read-only**

| Source | Status | Hành động |
|---|---|---|
| **localStorage** (Dashboard thêm) | ✏️ Editable | Sửa/Xoá được |
| **Bot API** (từ Telegram) | 🔒 Read-only | Chỉ xem, không sửa |

**Cách phân biệt:**
```
Timeline item editable:
  [✏️ Sửa] [🗑️ Xoá]

Timeline item from Bot:
  📡 từ Bot (read-only)
```

---

## 🎯 Use cases

### **Ví dụ 1: Fix giờ sai**
```
Bú: 120ml → nhập giờ sai (8:30 thay vì 10:30)

Cách fix:
1. Timeline → Hover → [✏️ Sửa]
2. Thời gian: 08:30 → 10:30
3. Click [💾 Lưu]

✅ Xong!
```

### **Ví dụ 2: Fix lượng sai**
```
Bú: 90ml → nhập thiếu (phải 120ml)

Cách fix:
1. Timeline → Hover → [✏️ Sửa]
2. Lượng: 90 → 120
3. Click [💾 Lưu]

✅ Total tăng từ 350 → 380ml
```

### **Ví dụ 3: Thêm ghi chú**
```
Bú: 120ml → quên ghi chú

Cách fix:
1. Timeline → Hover → [✏️ Sửa]
2. Ghi chú: (để trống) → nôn trớ
3. Click [💾 Lưu]

✅ Timeline hiển thị: 🍼 120ml (nôn trớ)
```

### **Ví dụ 4: Xoá sai**
```
Bú sữa 2 lần:
  8:00 - 120ml ✅
  9:00 - 90ml (ghi sai!)

Cách fix:
1. Timeline → Hover 9:00 → [🗑️ Xoá]
2. Confirm delete
3. Timeline update: chỉ còn 8:00 - 120ml

✅ Total: 120ml (từ 210ml)
```

---

## 🔄 Validation

### **Kiểm tra trước save**
```
✅ Thời gian (HH:MM)
   - Format: 00:00 - 23:59
   - Bắt buộc

✅ Lượng sữa (ml)
   - Số dương
   - Min: 1, Max: 300
   - Bắt buộc
   
✅ Ghi chú
   - Optional
```

### **Lỗi phổ biến**
```
❌ "Lượng sữa phải lớn hơn 0"
   → Nhập giá trị > 0

❌ "Thời gian không hợp lệ"
   → Dùng time picker, không gõ tay
```

---

## 💾 Data

### **Local storage**
- Data lưu vào browser localStorage
- Nếu xoá cache/cookies → mất dữ liệu
- Chỉ ảnh hưởng edit trên Dashboard

### **Bot data (read-only)**
- Bot lưu vào `bot/data/feedings.json`
- Không thể edit từ Dashboard
- Cần edit trực tiếp tại Bot

---

## 🚀 Tips

💡 **Tip 1**: Hover rồi mới thấy nút  
💡 **Tip 2**: Time picker dễ hơn gõ tay  
💡 **Tip 3**: Ghi chú giúp tracking tình trạng bé  
💡 **Tip 4**: Xoá sai có thể undo (nếu không refresh page)  

---

## ❓ FAQ

**Q: Edit trên Dashboard có ghi vào Bot không?**  
A: Không. Dashboard chứa data riêng từ localStorage. Bot data tách biệt.

**Q: Muốn edit Bot data thì sao?**  
A: Hiện tại phải delete ở Bot (`/undo`) rồi add lại. Hoặc xin feature soon.

**Q: Xoá sai, recover được không?**  
A: Nếu chưa refresh page → browser undo (Ctrl+Z). Nếu đã refresh → mất.

**Q: Edit có sync với Telegram Bot không?**  
A: Không. Phương Án A data riêng lẻ.

---

**Ready to edit? 🎉**
