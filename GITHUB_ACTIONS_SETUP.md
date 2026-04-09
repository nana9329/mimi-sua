# ⚙️ GitHub Actions Setup Guide

## Step 1: Create GitHub Repository

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: Mimi Sữa"

# Create repo on GitHub (at https://github.com/new)
# Then:
git remote add origin https://github.com/YOUR-USERNAME/mimi-sua.git
git branch -M main
git push -u origin main
```

## Step 2: Setup Railway

### 2a. Get Railway Token

1. Go to https://railway.app/account/tokens
2. Create new token
3. Copy token (starts with `railway_`)

### 2b. Create Railway Project

```bash
# Login to Railway
railway login

# Create new project
railway init

# Get Project ID
railway open
# Copy PROJECT_ID from URL: https://railway.app/project/PROJECT_ID
```

### 2c. Get Railway API URL

```bash
# After first deploy, get the URL
railway open
# Copy public domain: https://your-app.railway.app
```

---

## Step 3: Setup Netlify

### 3a. Get Netlify Token

1. Go to https://app.netlify.com/user/applications
2. Create new Personal access token
3. Copy token

### 3b. Create Netlify Site

1. Go to https://app.netlify.com/sites
2. Connect to GitHub (authorize)
3. Create new site from Git
4. Select your repo
5. Copy SITE_ID from URL: https://app.netlify.com/sites/SITE_ID

---

## Step 4: Add GitHub Secrets

Go to: https://github.com/YOUR-USERNAME/mimi-sua/settings/secrets/actions

Click "New repository secret" for each:

### Required Secrets:

| Secret Name | Value | Where to Get |
|------------|-------|--------------|
| `RAILWAY_TOKEN` | `railway_xxxxx` | Railway account tokens |
| `RAILWAY_PROJECT_ID` | `proj_xxxxx` | Railway project page |
| `RAILWAY_API_URL` | `https://your-app.railway.app` | Railway domain |
| `NETLIFY_AUTH_TOKEN` | `nf_xxxxx` | Netlify personal tokens |
| `NETLIFY_SITE_ID` | `xxxxx` | Netlify site settings |

---

## Step 5: Set Environment Variables

### Railway Variables

Go to: https://railway.app/project/YOUR_PROJECT_ID/variables

Add:
```
TELEGRAM_BOT_TOKEN=8793222247:AAHj1W5reUSObyBAi_7Wr1DwxZjekmWELWg
FLASK_ENV=production
CORS_ORIGINS=https://YOUR-NETLIFY-SITE.netlify.app
```

### Netlify Build Settings

Go to: https://app.netlify.com/sites/YOUR_SITE_ID/settings/builds

Build folder: `dashboard/`

---

## Step 6: Test Deployment

```bash
# Make a small change
echo "# Mimi Sữa" >> README.md

# Push to trigger workflow
git add README.md
git commit -m "Test deployment"
git push origin main
```

Then:
1. Go to Actions tab → watch workflow run
2. Should see: ✅ Deploy Bot & API to Railway
3. Should see: ✅ Deploy Dashboard to Netlify

---

## ✅ After First Deploy

Once workflow succeeds:

1. **Bot is live** 🤖
   - https://t.me/Mimi_suabot

2. **API is live** 🔌
   - https://your-app.railway.app/api/health

3. **Dashboard is live** 📊
   - https://your-site.netlify.app

---

## 🔄 Future Deployments

**Push code → GitHub → Workflow runs → Auto-deploys** ✨

Just push and watch it deploy automatically:

```bash
# Make changes
vim bot/bot.py

# Commit & push
git add bot/bot.py
git commit -m "Fix: improve bot response"
git push origin main

# Workflow automatically:
# 1. Deploys bot to Railway
# 2. Deploys dashboard to Netlify
# 3. Tests API is running
# Done! ✅
```

---

## 🆘 Troubleshooting

### Workflow fails: "RAILWAY_TOKEN not found"
- Check GitHub Secrets are set correctly
- Verify token is not expired
- Regenerate token if needed

### API URL is wrong in dashboard
- Update `RAILWAY_API_URL` secret
- Workflow will use correct URL next time

### Netlify deploy fails
- Check `netlify.toml` exists in dashboard/
- Verify `publish-dir: ./dashboard` is correct
- Check NETLIFY_SITE_ID is valid

### Messages in workflow
- Go to Actions tab → Click workflow run → View logs
- Look for specific error messages

---

## 📚 Quick Reference

| Task | Command |
|------|---------|
| View workflow runs | https://github.com/YOUR-USERNAME/mimi-sua/actions |
| View deployment logs | Click workflow run → scroll down |
| Redeploy manually | Go to Actions → click "Run workflow" |
| Disable auto-deploy | Edit `.github/workflows/deploy.yml` → comment out triggers |

