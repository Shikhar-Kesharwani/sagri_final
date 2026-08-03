# 📐 SAGRI Architecture Documentation

SAGRI (Krishi Sahayak) is an AI-Powered Smart Agriculture Platform with a decoupled full-stack architecture.

---

## ☁️ Model 1: Cloud-Native Architecture (Free Tier)

```mermaid
graph TD
    User([Farmer / Web User]) -->|HTTPS / Port 443| Vercel[Vercel SPA Hosting - React + Vite]
    Vercel -->|REST API / JSON| Render[Render Web Service - FastAPI Backend Docker]
    Vercel -->|Auth & Edge API| Supabase[Supabase Cloud - Postgres & Edge Functions]
    Render -->|Queries & Auth| Supabase
    Render -->|SMS OTP| Fast2SMS[Fast2SMS Gateway]
```

### Components:
- **Frontend SPA**: React (Vite) hosted on Vercel (`https://sagri.vercel.app`)
- **Backend API**: Python FastAPI hosted on Render Web Service via Docker (`https://sagri-ml-backend.onrender.com`)
- **Database & Auth**: PostgreSQL, Auth, and Edge Functions hosted on Supabase Cloud
- **ML Models**: MobileNetV2 (Disease), Prophet (Price), Random Forest (Crop), XGBoost (Risk) loaded in-memory on FastAPI container

---

## 🐳 Model 2: Self-Hosted Docker Compose Architecture

```mermaid
graph TD
    Client([Client Browser]) -->|HTTP / Port 80| Nginx[Nginx Reverse Proxy Container]
    Nginx -->|/api/ & /health| FastAPI[SAGRI FastAPI Backend Container:8000]
    FastAPI -->|External Auth/DB| SupabaseCloud[Supabase Cloud]
    FastAPI -->|SMS Gateway| Fast2SMS[Fast2SMS API]
```

### Command to launch self-hosted stack:
```bash
docker-compose -f infra/docker/docker-compose.yml up -d
```
