# Deployment Quick Start

## 🚀 Railway (Bot + API)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Create new project
railway init

# 4. Set token
railway variables set TELEGRAM_BOT_TOKEN="your_token_here"
railway variables set FLASK_ENV=production

# 5. Deploy
railway up

# 6. Check status
railway logs
railway status
```

## 🌐 Netlify (Dashboard)

### Option A: Drag & Drop
1. Build dashboard folder locally
2. Go to `netlify.com/drop`
3. Drag dashboard folder
4. Done!

### Option B: Git + CLI
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build
cd dashboard

# 3. Deploy
netlify deploy --prod
```

### Option C: GitHub Integration
```bash
# Push to GitHub
git add dashboard/
git commit -m "Deploy dashboard"
git push origin main

# Then on Netlify.com:
# - Connect GitHub
# - Select repo
# - Set build folder: dashboard/
# - Deploy
```

## 🔗 After Deployment

1. Get Railway URL (e.g., `your-app.railway.app`)
2. Update `dashboard/dashboard.js`:
   ```javascript
   const BOT_API_URL = 'https://your-app.railway.app/api';
   ```
3. Re-deploy dashboard
4. Test: Open dashboard → add record → check chart updates

## ✅ Verification

```bash
# Test Bot
curl https://your-app.railway.app/api/health

# Test Dashboard
Open https://your-dashboard.netlify.app
Click buttons → should see records in timeline
```

## 🆘 Common Issues

### Bot not responding
- Check TELEGRAM_BOT_TOKEN variable
- Verify token is valid: `railway logs | grep token`

### Dashboard can't fetch
- Update API_URL correctly
- Check CORS in api.py
- Open DevTools (F12) → Network tab → check /api calls

### Data not persisting
- Check `bot/data/` directory exists
- Verify file permissions

## 📊 Monitoring

```bash
# Railway logs
railway logs -f

# Railway status
railway status

# Netlify logs
netlify logs:functions
