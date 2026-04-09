# 🚀 HƯỚNG DẪN DEPLOY PHƯƠNG ÁN A

## 📋 Tóm tắt Phương Án A

- **Bot**: Chạy trên Replit/Railway (24/7 miễn phí)
- **Dashboard**: Host tĩnh trên Netlify (miễn phí)
- **Data**: Lưu riêng lẻ (Bot → file JSON, Dashboard → localStorage)

---

## ⚙️ PHẦN 1: Deploy Bot

### **Cách 1: Chạy Local (màn hình bật)**

```bash
cd "c:\Users\24h\Desktop\AI\Uống sữa\bot"
python bot.py
```

✅ **Đã chạy xong** - Bot nghe trên Telegram ngay

---

### **Cách 2: Deploy lên Replit (chạy 24/7)**

#### Bước 1: Tạo tài khoản Replit
- Vào: https://replit.com
- Click "Sign up" → dùng Google/GitHub

#### Bước 2: Tạo Repl mới
1. Click **"Create"**
2. Chọn **"Python"**
3. Click **"Create Repl"**

#### Bước 3: Upload file
1. Click icon **"Upload file"** (folder icon)
2. Upload 3 file:
   - `bot.py`
   - `parser.py`
   - `database.py`

#### Bước 4: Tạo `.env`
1. Ở Replit, click **"Secrets"** (icon ổ khoá)
2. Thêm:
   ```
   TELEGRAM_BOT_TOKEN=8793222247:AAHj1W5reUSObyBAi_7Wr1DwxZjekmWELWg
   ```

#### Bước 5: Edit `replit.nix`
Thêm vào file:
```nix
{ pkgs }: {
  deps = [
    pkgs.python311Full
  ];
  env = {
    PYTHON_LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
      pkgs.stdenv.cc.cc
    ];
    LANG = "C.UTF-8";
  };
}
```

#### Bước 6: Chạy
- Terminal chạy:
```bash
pip install python-telegram-bot python-dotenv
python bot.py
```

✅ Bot sẽ chạy 24/7!

---

### **Cách 3: Deploy lên Railway (dễ hơn Replit)**

#### Bước 1: Connect GitHub
- Fork repo này hoặc tạo mới
- Commit 3 file: `bot.py`, `parser.py`, `database.py`

#### Bước 2: Railway
1. Vào: https://railway.app
2. Click **"New Project"**
3. **"Deploy from GitHub"**
4. Chọn repo vừa tạo

#### Bước 3: Add variables
- Project Settings → **Variables**
- Thêm:
```
TELEGRAM_BOT_TOKEN=8793222247:AAHj1W5reUSObyBAi_7Wr1DwxZjekmWELWg
```

#### Bước 4: Create Procfile
Tạo file `Procfile`:
```
worker: python bot.py
```

✅ Deploy xong!

---

## 🌐 PHẦN 2: Deploy Dashboard

### **Cách 1: Host tĩnh trên Netlify (dễ nhất)**

#### Bước 1: GitHub
1. Tạo folder `dashboard` trên GitHub
2. Upload file `index.html`

#### Bước 2: Netlify
1. Vào: https://netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Chọn GitHub → repo vừa tạo
4. Build command: (để trống)
5. Publish directory: `.`
6. Click **"Deploy"**

✅ Dashboard online! 🎉

**URL**: `https://your-site.netlify.app`

---

### **Cách 2: Host trên Vercel (nhanh hơn)**

1. Vào: https://vercel.com
2. Click **"New Project"**
3. Import GitHub repo
4. Click **"Deploy"**

✅ Xong!

---

## 🧪 TEST

### Bot
- Mở Telegram: @Mimi_suabot
- Gõ: `120ml`
- Bot phải reply: `✅ Đã ghi nhận...`

### Dashboard
- Mở: `https://your-site.netlify.app`
- Bấm: `60ml`
- Xem total tăng lên

---

## 📱 Dùng thế nào?

**Gia đình**: 
1. **Bú sữa** → Chat Bot (@Mimi_suabot)
2. **Xem tổng** → Mở Dashboard link

**Data lưu ở đâu**:
- Bot: `data/feedings.json` (server)
- Dashboard: browser localStorage

⚠️ **Lưu ý**: 2 chỗ data khác nhau (Phương Án A)

---

## ❓ FAQ

**Q: Có sync data không?**  
A: Không, 2 chỗ riêng. Bạn thêm dữ liệu ở Bot, xem ở Dashboard cũng là thêm riêng.

**Q: Có giải pháp?**  
A: Có - upgrade lên **Phương Án B** (API Server). Tôi có thể code sau.

**Q: Bú sữa trên Bot, Dashboard hiện không?**  
A: Đúng. Vì khác database. Chọn A hay B dùng cái nào thôi.

---

## 🎯 Khuyến cáo

- **Hôm nay**: Chạy Local test (để cảm nhận)
- **Tuần sau**: Deploy Replit Bot + Netlify Dashboard → sài thực

**Ready?** 💪
