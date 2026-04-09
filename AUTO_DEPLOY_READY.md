# 🚀 Auto-Deploy Ready! (GitHub Actions)

## 🎯 5-Minute Setup

### Step 1️⃣: Create GitHub Repo

```bash
# In workspace folder
git init
git add .
git commit -m "Mimi Sua - ready to deploy"

# Create new repo at https://github.com/new
# Name: mimi-sua

# Then:
git remote add origin https://github.com/YOUR-USERNAME/mimi-sua.git
git branch -M main
git push -u origin main
```

### Step 2️⃣: Get Railway Token

1. Visit: https://railway.app/account/tokens
2. Click "Create new token"
3. Copy token (starts with `railway_`)

### Step 3️⃣: Get Railway Project ID & API URL

```bash
# Already on Railway? 
# Project ID: https://railway.app/project/PROJECT_ID
# API URL: https://your-app.railway.app (from domain)
```

### Step 4️⃣: Get Netlify Token & Site ID

1. Visit: https://app.netlify.com/user/applications
2. "New access token" → copy
3. Create new site in Netlify (connect GitHub)
4. Site ID in URL: https://app.netlify.com/sites/SITE_ID

### Step 5️⃣: Add GitHub Secrets

Go to: **github.com/YOUR-USERNAME/mimi-sua** → Settings → Secrets and variables → Actions

Add 5 secrets:

```
RAILWAY_TOKEN = railway_xxxxx
RAILWAY_PROJECT_ID = proj_xxxxx  
RAILWAY_API_URL = https://your-app.railway.app
NETLIFY_AUTH_TOKEN = nf_xxxxx
NETLIFY_SITE_ID = xxxxx
```

### Step 6️⃣: Set Railway Variables

Go to: **railway.app/project/YOUR_PROJECT_ID/variables**

Add:
```
TELEGRAM_BOT_TOKEN = 8793222247:AAHj1W5reUSObyBAi_7Wr1DwxZjekmWELWg
FLASK_ENV = production
CORS_ORIGINS = https://YOUR_NETLIFY_SITE.netlify.app
```

---

## ✨ Done!

Now push to deploy automatically:

```bash
# Make a change (or just push)
git push origin main

# Watch it deploy:
# 1. Go to Actions tab
# 2. See workflow run
# 3. Bot + API deploy to Railway
# 4. Dashboard deploys to Netlify
# 5. ✅ All live!
```

---

## 📖 Need Details?

Read: [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)

## 🔗 Your URLs After Deploy

- Dashboard: `https://YOUR_SITE.netlify.app`
- Bot: `https://t.me/Mimi_suabot`
- API: `https://your-app.railway.app/api`

---

## ✅ Verify It's Working

```bash
# Check workflow status
# → github.com/YOUR-USERNAME/mimi-sua/actions

# Test API
# → curl https://your-app.railway.app/api/health

# Test Bot  
# → Send message to @Mimi_suabot on Telegram

# Test Dashboard
# → Open https://YOUR_SITE.netlify.app in browser
```

**Auto-deploy is ready! 🎉**

Every `git push main` will automatically deploy everything.
