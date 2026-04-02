# 🚀 SAGRI Platform - Deployment Guide

## 📋 **Complete Deployment Guide for Beginners**

This guide covers deploying your SAGRI platform to production with a live URL.

---

## 🎯 **Deployment Options Comparison**

| Platform | Best For | Free Plan | Custom Domain | Auto Deploy |
|----------|----------|-----------|---------------|-------------|
| **Vercel** | React/Next.js | ✅ Yes | ✅ Yes | ✅ Yes |
| **Netlify** | Static sites | ✅ Yes | ✅ Yes | ✅ Yes |
| **GitHub Pages** | Simple sites | ✅ Yes | ✅ Yes | ✅ Yes |
| **Render** | Full-stack | ✅ Yes (limited) | ✅ Yes | ✅ Yes |
| **Railway** | Backend heavy | ✅ Yes ($5 free) | ✅ Yes | ✅ Yes |

**Recommendation for SAGRI:** **Vercel** ⭐ (Best for React + Supabase)

---

## 🚀 **OPTION 1: Deploy to Vercel (RECOMMENDED)**

### **Why Vercel?**
- ✅ Made for React/Vite projects
- ✅ Automatic HTTPS
- ✅ Global CDN (super fast)
- ✅ Zero configuration
- ✅ Preview deployments
- ✅ Perfect Supabase integration
- ✅ Free forever for personal projects

---

### **Step 1: Prepare Your Project**

**1.1 Build locally to test:**
```bash
cd C:\Projects\sagri-platform
npm run build
```

**Should create `dist/` folder without errors!**

**1.2 Create `vercel.json` config (optional but recommended):**

Create file in project root: `/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**1.3 Push to GitHub:**
```bash
git add .
git commit -m "Add Vercel config"
git push
```

---

### **Step 2: Create Vercel Account**

**2.1 Sign up:**
1. Go to: https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Sign in to your GitHub account
4. Click **"Authorize Vercel"**
5. ✅ Account created!

**2.2 Install Vercel GitHub app:**
- Should happen automatically
- If not, go to: https://github.com/apps/vercel
- Click "Install"
- Select "All repositories" or just `sagri-platform`
- Click "Install"

---

### **Step 3: Import Your Project**

**3.1 Create new project:**
1. Click **"Add New..."** (top right)
2. Select **"Project"**
3. Click **"Import Git Repository"**

**3.2 Select repository:**
- Find `sagri-platform` in the list
- Click **"Import"**

**3.3 Configure project:**

```
Project Name: sagri-platform (or custom name)
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 20.x (latest LTS)
```

**Leave as default if auto-detected!** ✅

---

### **Step 4: Add Environment Variables**

**Click "Environment Variables" section:**

Add these variables (from your Supabase project):

```
Name: SUPABASE_URL
Value: your-supabase-url-here

Name: SUPABASE_ANON_KEY  
Value: your-supabase-anon-key-here

Name: SUPABASE_SERVICE_ROLE_KEY
Value: your-supabase-service-role-key-here
```

**Important:** Get these from:
- Supabase Dashboard → Settings → API
- Or from your existing `.env` file

**Security:**
- ✅ Environment variables are secure
- ✅ Never committed to GitHub
- ✅ Only accessible on server

---

### **Step 5: Deploy!**

**5.1 Click "Deploy"**

**You'll see:**
```
Building...
Running "npm install"
Running "npm run build"
Uploading files...
Deploying...
Success! 🎉
```

**Takes 2-3 minutes for first deployment**

---

### **Step 6: Your Site is Live! 🎊**

**You'll get URLs like:**
```
Production: https://sagri-platform.vercel.app
Preview: https://sagri-platform-git-main-yourname.vercel.app
```

**Click the URL to open your live site!**

---

### **Step 7: Configure Custom Domain (Optional)**

**7.1 Buy a domain (optional):**
- Namecheap: https://www.namecheap.com/
- GoDaddy: https://www.godaddy.com/
- Google Domains: https://domains.google/

**7.2 Add domain to Vercel:**
1. Go to project → Settings → Domains
2. Enter your domain: `sagri.com`
3. Click "Add"
4. Follow DNS configuration instructions
5. Wait for verification (5-60 minutes)

**7.3 Free subdomain alternative:**
- Use: `sagri-platform.vercel.app` (free forever!)
- Or: `your-name.vercel.app`

---

### **Step 8: Automatic Deployments**

**From now on, every time you push to GitHub:**

```bash
# Edit code in VS Code
git add .
git commit -m "New feature"
git push

# Vercel automatically:
# 1. Detects the push
# 2. Builds your project
# 3. Deploys to production
# 4. Updates your live site
# ✅ Done in 2-3 minutes!
```

**Check deployment status:**
- Go to: https://vercel.com/dashboard
- See all deployments
- View build logs
- Roll back if needed

---

### **Step 9: Configure Production Settings**

**9.1 Update Supabase redirect URLs:**

In Supabase Dashboard:
1. Go to: Authentication → URL Configuration
2. Add production URL:
```
Site URL: https://sagri-platform.vercel.app
Redirect URLs: https://sagri-platform.vercel.app/**
```

**9.2 Test all features:**
- [ ] Login/signup works
- [ ] Database connections work
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] No console errors

---

## 🌐 **OPTION 2: Deploy to Netlify**

### **Step 1: Create Netlify Account**

1. Go to: https://app.netlify.com/signup
2. Click "Sign up with GitHub"
3. Authorize Netlify

---

### **Step 2: Create `netlify.toml` Config**

Create file in project root: `/netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

Push to GitHub:
```bash
git add netlify.toml
git commit -m "Add Netlify config"
git push
```

---

### **Step 3: Import Project**

1. Click "Add new site" → "Import an existing project"
2. Click "GitHub"
3. Select `sagri-platform`
4. Configure:
```
Build command: npm run build
Publish directory: dist
```
5. Click "Deploy site"

---

### **Step 4: Add Environment Variables**

1. Site settings → Environment variables
2. Add:
```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

---

### **Step 5: Your Site is Live!**

URL: `https://sagri-platform.netlify.app`

**Custom domain:**
1. Site settings → Domain management
2. Add custom domain
3. Follow DNS instructions

---

## 📄 **OPTION 3: Deploy to GitHub Pages**

### **Step 1: Install gh-pages**

```bash
npm install --save-dev gh-pages
```

---

### **Step 2: Update package.json**

Add these scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://YOUR-USERNAME.github.io/sagri-platform"
}
```

Replace `YOUR-USERNAME` with your GitHub username!

---

### **Step 3: Update Vite Config**

Edit `/vite.config.ts` or create it:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sagri-platform/'
})
```

---

### **Step 4: Deploy**

```bash
npm run deploy
```

**Your site is live at:**
```
https://YOUR-USERNAME.github.io/sagri-platform
```

---

### **Step 5: Enable GitHub Pages**

1. Go to: https://github.com/YOUR-USERNAME/sagri-platform/settings/pages
2. Source: Deploy from branch
3. Branch: `gh-pages` → `/root`
4. Click "Save"

**Wait 2-3 minutes, then visit your URL!**

---

## 🔧 **OPTION 4: Deploy to Render**

### **Good for full-stack apps with backend**

**Step 1: Create account:**
- https://dashboard.render.com/register

**Step 2: New static site:**
1. Click "New +" → "Static Site"
2. Connect GitHub
3. Select `sagri-platform`
4. Configure:
```
Build Command: npm run build
Publish Directory: dist
```

**Step 3: Deploy!**

URL: `https://sagri-platform.onrender.com`

---

## 🚂 **OPTION 5: Deploy to Railway**

### **Good for projects with databases**

**Step 1: Create account:**
- https://railway.app/

**Step 2: New project:**
1. Click "New Project"
2. "Deploy from GitHub repo"
3. Select `sagri-platform`
4. Auto-detects Vite

**Step 3: Configure:**
```
Build Command: npm run build
Start Command: npx vite preview --port $PORT
```

**Step 4: Add domain:**
- Settings → Public Networking → Generate Domain

URL: `https://sagri-platform.up.railway.app`

---

## 📊 **Comparison Table**

### **Deployment Speed:**
| Platform | First Deploy | Re-deploy | Build Time |
|----------|--------------|-----------|------------|
| Vercel | ~2-3 min | ~1-2 min | Fast ⚡ |
| Netlify | ~3-4 min | ~1-2 min | Fast ⚡ |
| GitHub Pages | ~5-10 min | ~2-3 min | Medium |
| Render | ~5-7 min | ~2-3 min | Medium |

---

### **Features:**
| Feature | Vercel | Netlify | GitHub Pages | Render |
|---------|--------|---------|--------------|--------|
| Custom Domain | ✅ | ✅ | ✅ | ✅ |
| Auto HTTPS | ✅ | ✅ | ✅ | ✅ |
| Preview Deploys | ✅ | ✅ | ❌ | ✅ |
| Serverless Functions | ✅ | ✅ | ❌ | ✅ |
| Analytics | ✅ | ✅ | ❌ | ✅ |
| Build Minutes (Free) | 6000/mo | 300/mo | Unlimited | 500/mo |

---

## 🎯 **Recommended Workflow**

### **Development → Production:**

```bash
# 1. Develop locally
npm run dev

# 2. Test changes
# Edit code, see live reload

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview

# 5. Commit and push
git add .
git commit -m "New feature"
git push

# 6. Auto-deploys to Vercel/Netlify!
# ✅ Live in 2-3 minutes
```

---

## 🔒 **Security Best Practices**

### **Environment Variables:**

**❌ NEVER commit to GitHub:**
```
.env
.env.local
.env.production
```

**✅ ALWAYS add to platform:**
- Vercel → Settings → Environment Variables
- Netlify → Site settings → Environment variables
- GitHub → Settings → Secrets

---

### **Supabase Security:**

**1. Use Row Level Security (RLS):**
```sql
-- Enable RLS on tables
ALTER TABLE kv_store_35e6abe9 ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON kv_store_35e6abe9
  FOR SELECT
  USING (auth.uid() = user_id);
```

**2. Never expose service role key in frontend!**
```javascript
// ❌ BAD (in frontend):
const supabase = createClient(url, SERVICE_ROLE_KEY)

// ✅ GOOD (in frontend):
const supabase = createClient(url, ANON_KEY)

// ✅ GOOD (in backend only):
const supabase = createClient(url, SERVICE_ROLE_KEY)
```

---

## 📱 **Progressive Web App (PWA)**

### **Make SAGRI installable on mobile!**

**Create `/public/manifest.json`:**
```json
{
  "name": "SAGRI - Krishi Shayak",
  "short_name": "SAGRI",
  "description": "Smart Agriculture Platform for Indian Farmers",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#10b981",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Add to `/index.html`:**
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#10b981">
```

**Install PWA plugin:**
```bash
npm install vite-plugin-pwa -D
```

**Update `vite.config.ts`:**
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SAGRI - Krishi Shayak',
        short_name: 'SAGRI',
        theme_color: '#10b981'
      }
    })
  ]
})
```

**Now users can "Add to Home Screen" on mobile!** 📱

---

## 🌟 **Custom Domain Setup**

### **Step 1: Buy Domain**

**Recommended registrars:**
- Namecheap: ~$10/year
- Google Domains: ~$12/year
- Cloudflare: ~$9/year

**Examples:**
- `sagri.com`
- `krishishayak.in`
- `smartagri.app`

---

### **Step 2: Configure DNS**

**For Vercel:**
1. Vercel → Settings → Domains
2. Add domain: `sagri.com`
3. Add DNS records at your registrar:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Netlify:**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

---

### **Step 3: Enable HTTPS**

**Automatic with Vercel/Netlify:**
- ✅ Free SSL certificate
- ✅ Auto-renewal
- ✅ HTTPS enforced

**Verify:**
```
https://sagri.com ✅
http://sagri.com → redirects to HTTPS ✅
```

---

## 📊 **Monitor Your Deployment**

### **Vercel Analytics (Free):**

**Enable:**
1. Vercel Dashboard → Your Project
2. Analytics tab
3. Enable Web Analytics

**Track:**
- Page views
- Unique visitors
- Top pages
- Referrers
- Performance metrics

---

### **Google Analytics (Free):**

**Setup:**
1. Create account: https://analytics.google.com/
2. Get tracking ID: `G-XXXXXXXXXX`
3. Add to `/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## ✅ **Deployment Checklist**

### **Pre-Deployment:**
- [ ] Build works locally (`npm run build`)
- [ ] No console errors
- [ ] All features tested
- [ ] Environment variables configured
- [ ] .env files in .gitignore
- [ ] Dependencies up to date

### **Deployment:**
- [ ] Platform account created
- [ ] Repository connected
- [ ] Build configuration correct
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Live URL works

### **Post-Deployment:**
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Authentication works
- [ ] Database connections work
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)
- [ ] Analytics added
- [ ] Performance tested

**All checked? Your app is production-ready! 🚀**

---

## 🎊 **Congratulations!**

### **Your SAGRI platform is now:**
- ✅ Live on the internet
- ✅ Accessible worldwide
- ✅ Automatically deployed
- ✅ Production-ready
- ✅ Scalable
- ✅ Secure

**Share your live URL:**
```
https://sagri-platform.vercel.app
```

**Show it to:**
- Investors 💰
- Users 👥
- Team members 👔
- Portfolio/Resume 📄
- Social media 📱

---

**You built and deployed a professional agriculture platform! 🌾🎉**

---

**Created:** March 27, 2026
**Platform:** SAGRI - Krishi Shayak
**Deployment:** Production Ready
