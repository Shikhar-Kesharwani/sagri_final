# 🚀 SAGRI Cloud Deployment Guide (100% Free - No Credit Card Required)

This guide provides step-by-step instructions to deploy **SAGRI** to production completely free using Vercel, Render / HuggingFace, and Supabase.

---

## 🏛️ Architecture Overview

- **Frontend**: React + Vite SPA → Deployed on **Vercel** (Free Tier)
- **Backend**: FastAPI Python ML API → Deployed on **Render Web Service** / **HuggingFace Spaces** (Docker, Free Tier)
- **Database & Auth**: PostgreSQL & Auth → Deployed on **Supabase Cloud** (Free Tier)
- **Edge Functions**: Marketplace & Community APIs → Hosted on **Supabase Edge Functions**

---

## ⚡ Step 1: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **New Project** → Select `AyushGU12/sagri_final`.
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `VITE_BACKEND_URL` = `https://your-sagri-backend.onrender.com` (or HuggingFace URL)
5. Click **Deploy**. Your app will be live at `https://sagri.vercel.app`.

---

## 🐍 Step 2: Deploy FastAPI Backend on Render or HuggingFace

### Option A: Render (Standard API)
1. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**.
2. Connect your GitHub repository `sagri_final`.
3. Configuration:
   - **Name**: `sagri-ml-backend`
   - **Language**: `Docker`
   - **Branch**: `main`
   - **Plan**: `Free`
4. Add Environment Variables:
   - `SUPABASE_URL` = `https://tnaoasoznlzmbkennoiy.supabase.co`
   - `SUPABASE_KEY` = `your-supabase-anon-key`
   - `FAST2SMS_API_KEY` = `your-fast2sms-api-key`
   - `ALLOWED_ORIGINS` = `https://sagri.vercel.app,http://localhost:5173`
5. Click **Create Web Service**. Live API endpoint: `https://sagri-ml-backend.onrender.com/health`.

### Option B: HuggingFace Spaces (For 16GB RAM Heavy ML Models)
1. Go to [huggingface.co/spaces](https://huggingface.co/spaces) → **Create new Space**.
2. Select **SDK: Docker** → Blank template (Hardware: Free 16GB RAM).
3. Push your repository to HuggingFace space:
   ```bash
   git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/sagri-backend
   git push hf main
   ```
4. Set Space Secrets: `PORT=7860`, `SUPABASE_URL`, `SUPABASE_KEY`, `FAST2SMS_API_KEY`.

---

## 🔒 Step 3: Supabase Cloud Verification

1. Ensure your Supabase Database migrations & tables (`users`, `equipment_bookings`, `community_posts`, `expert_chats`) are active on `https://tnaoasoznlzmbkennoiy.supabase.co`.
2. Ensure Edge Functions under `supabase/functions/server` are deployed:
   ```bash
   npx supabase functions deploy server
   ```

---

## ✅ Step 4: Verification

- Health Check Endpoint: `GET https://your-sagri-backend.onrender.com/health` -> `{"status":"ok","uptime":...}`
- Live Web Application: `https://sagri.vercel.app`
