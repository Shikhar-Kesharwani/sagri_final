# 🛠️ SAGRI Deployment & Runtime Troubleshooting Guide

This guide addresses common deployment and runtime issues for both Cloud Native (Vercel + Render) and Self-Hosted Docker environments.

---

## 1. CORS Errors (Frontend cannot reach backend)
- **Symptom**: Console error `Access-Control-Allow-Origin missing` or `Failed to fetch`.
- **Cause**: Backend CORS middleware blocking the Vercel domain.
- **Fix**:
  - Update `ALLOWED_ORIGINS` in Render dashboard or `.env`:
    ```
    ALLOWED_ORIGINS=https://sagri.vercel.app,http://localhost:5173
    ```
  - Verify `VITE_BACKEND_URL` environment variable on Vercel points to `https://sagri-ml-backend.onrender.com`.

---

## 2. Health Check Failures on Render / Docker
- **Symptom**: Render build fails with "Health check failed on /health".
- **Fix**:
  - Verify endpoint returns HTTP 200: `curl -f http://localhost:8000/health`
  - Ensure `PORT` environment variable is read correctly by Uvicorn (`ENV PORT=8000`).

---

## 3. Large Model Memory Limits (Out of Memory)
- **Symptom**: Container crashes during model load.
- **Fix**:
  - If model weights exceed 500MB, deploy backend to **HuggingFace Spaces** (which offers 16GB free RAM).
  - Push repo to HuggingFace Space with Docker SDK.

---

## 4. Local Development Zero-Breakage Verification
- **Test Command**:
  ```bash
  # Terminal 1: Backend
  python backend/main.py

  # Terminal 2: Frontend
  npm run dev
  ```
- localhost behavior remains 100% untouched and functional.
