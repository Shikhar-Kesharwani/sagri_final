# 📍 WHERE IS EVERYTHING STORED? - Simple Visual Guide

## 🎯 QUICK ANSWER

### **Backend & Database - WHERE?**
```
🌐 CLOUD (Supabase Platform)
   ↓
   📍 Hosted on AWS (via Supabase)
   ↓
   📍 Region: Likely Singapore/Mumbai (Asia-Pacific)
   ↓
   ✅ NOT on your computer
   ✅ NOT on Figma servers
   ✅ ON Supabase cloud infrastructure
```

### **Frontend - WHERE?**
```
💻 BUILT: On your computer (during development)
   ↓
   📦 BUNDLED: By Vite (creates /dist folder)
   ↓
   🚀 DEPLOYED: To Figma Make platform
   ↓
   🌍 SERVED: Via Figma's CDN to users
```

---

## 📊 VISUAL BREAKDOWN

### 1️⃣ **DATABASE** (PostgreSQL)

```
┌─────────────────────────────────────────────┐
│          SUPABASE CLOUD ☁️                  │
│  (Physical servers: AWS data centers)       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  PostgreSQL Database                │   │
│  │  Project: wofpjmzhspgsestrhney     │   │
│  │                                     │   │
│  │  Table: kv_store_35e6abe9          │   │
│  │  ├─ User data                      │   │
│  │  ├─ Predictions                    │   │
│  │  ├─ Community posts                │   │
│  │  └─ All app data                   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Location: 🌏 Asia-Pacific AWS region      │
│  Managed by: Supabase (automatic backups)  │
└─────────────────────────────────────────────┘
```

**Access URL**: 
```
postgres://[connection-string].supabase.co:5432/postgres
```

**Who manages it**: Supabase team (automatic updates, backups, scaling)

---

### 2️⃣ **BACKEND SERVER** (API)

```
┌─────────────────────────────────────────────┐
│     SUPABASE EDGE FUNCTIONS 🚀              │
│  (Runs on Deno Deploy - Global CDN)        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Server Code (Hono Framework)      │   │
│  │  File: /supabase/functions/server/ │   │
│  │                                     │   │
│  │  ├─ index.tsx (main server)        │   │
│  │  └─ kv_store.tsx (DB helpers)      │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Location: 🌍 Edge locations worldwide     │
│  Runtime: Deno (serverless)                 │
│  Auto-scaling: ✅ Yes                       │
└─────────────────────────────────────────────┘
```

**Access URL**: 
```
https://wofpjmzhspgsestrhney.supabase.co/functions/v1/make-server-35e6abe9
```

**Where code is stored**: In your project, but RUNS on Supabase Edge Functions

---

### 3️⃣ **FILE STORAGE** (Images/Documents)

```
┌─────────────────────────────────────────────┐
│       SUPABASE STORAGE 📁                   │
│  (AWS S3-compatible blob storage)           │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Bucket: make-35e6abe9-crop-images │   │
│  │                                     │   │
│  │  └─ user123/                       │   │
│  │      ├─ crop1.jpg                  │   │
│  │      ├─ crop2.jpg                  │   │
│  │      └─ disease_photo.png          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Location: 🌏 AWS S3 (via Supabase)        │
│  Access: Private (signed URLs only)         │
└─────────────────────────────────────────────┘
```

**Access**: Via temporary signed URLs (expire after 7 days)

---

### 4️⃣ **FRONTEND** (React App)

#### **Development (Your Computer)**
```
📁 /src/
   └─ Your code here
        ↓
   [Run: npm run dev]
        ↓
   Vite dev server (localhost:5173)
```

#### **Production (After Build)**
```
📁 /src/
   └─ Source code
        ↓
   [Run: npm run build]
        ↓
   📦 /dist/
      ├─ index.html
      ├─ assets/
      │  ├─ index-abc123.js   (bundled JS)
      │  └─ index-def456.css  (bundled CSS)
      └─ ...
        ↓
   🚀 DEPLOYED TO: Figma Make Platform
        ↓
   🌐 SERVED TO USERS via CDN
```

**Where users access it**: 
```
https://[your-make-app].figma.com
(or custom domain if configured)
```

---

## 🗺️ COMPLETE DATA FLOW MAP

```
USER'S BROWSER 💻
      ↓
      │ Opens app URL
      ↓
┌─────────────────────────────────┐
│   FIGMA MAKE CDN 🌐             │
│   Serves: HTML, CSS, JS         │
│   (Frontend static files)       │
└────────────┬────────────────────┘
             │
             │ User interacts with UI
             │
      ┌──────▼─────────┐
      │  REACT APP ⚛️  │
      │  (In browser)  │
      └──────┬─────────┘
             │
             │ Makes API call
             │ (e.g., upload image)
             ↓
┌────────────────────────────────────┐
│  SUPABASE EDGE FUNCTION 🚀         │
│  URL: *.supabase.co/functions/...  │
│  Location: Nearest edge server     │
└────────┬───────────────────────────┘
         │
         ├─ Validates JWT token
         │
         ├─ Stores data ───────────────┐
         │                             │
         ↓                             ↓
┌──────────────────┐        ┌─────────────────────┐
│  SUPABASE DB 🗄️  │        │  SUPABASE STORAGE   │
│  PostgreSQL      │        │  (S3) 📁            │
│  kv_store table  │        │  Crop images        │
└──────────────────┘        └─────────────────────┘
         │
         │ Returns data
         ↓
   BACKEND RESPONSE
         ↓
   REACT APP updates UI
         ↓
   USER SEES RESULT
```

---

## 🏢 PHYSICAL LOCATIONS (Where servers actually are)

### **Supabase Infrastructure**

```
┌──────────────────────────────────────────────────────┐
│  SUPABASE CLOUD ARCHITECTURE                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│  🌐 EDGE FUNCTIONS (Deno Deploy)                    │
│  ├─ North America: US East, US West                 │
│  ├─ Europe: UK, Germany, France                     │
│  ├─ Asia: Singapore, Tokyo, Mumbai                  │
│  └─ Auto-routes to nearest location                 │
│                                                      │
│  🗄️ DATABASE (PostgreSQL on AWS)                    │
│  ├─ Primary region: Singapore OR Mumbai             │
│  │  (chosen when project created)                   │
│  ├─ Automatic backups: Daily                        │
│  └─ Point-in-time recovery: 7 days                  │
│                                                      │
│  📁 STORAGE (AWS S3)                                 │
│  ├─ Region: Same as database                        │
│  ├─ Redundancy: Multi-zone replication              │
│  └─ CDN: CloudFront (global edge cache)             │
│                                                      │
│  🔐 AUTH SERVICE                                     │
│  └─ Global: Runs alongside edge functions           │
└──────────────────────────────────────────────────────┘
```

**Your Project ID**: `wofpjmzhspgsestrhney`
**Base URL**: `https://wofpjmzhspgsestrhney.supabase.co`

---

## 💾 WHERE IS DATA ACTUALLY SAVED?

### **When User Signs Up:**

```
1. Frontend sends POST request
        ↓
2. Edge Function receives it
        ↓
3. Supabase Auth creates user
   📍 Saved in: auth.users table (PostgreSQL)
   📍 Location: Supabase DB server
        ↓
4. KV Store saves profile
   📍 Saved in: kv_store_35e6abe9 table
   📍 Key: "user:abc123"
   📍 Value: { name, role, points, ... }
        ↓
5. Frontend receives response
   📍 Saved in: Browser localStorage
   📍 Location: User's device
```

### **When User Uploads Image:**

```
1. User selects image file
   📍 Location: User's device (temporarily in memory)
        ↓
2. Frontend sends FormData
        ↓
3. Edge Function receives file
   📍 Location: Edge function memory (temporary)
        ↓
4. Uploaded to Supabase Storage
   📍 Saved in: AWS S3 bucket (make-35e6abe9-crop-images)
   📍 Location: AWS data center (Singapore/Mumbai)
   📍 Path: user123/1711234567_wheat.jpg
        ↓
5. Signed URL generated
   📍 Returned to: Frontend
        ↓
6. Image displayed
   📍 Loaded from: S3 via CloudFront CDN
```

### **When AI Prediction is Made:**

```
1. Frontend runs prediction (mock AI)
   📍 Location: User's browser (JavaScript)
        ↓
2. Result sent to backend
        ↓
3. Saved in database
   📍 Table: kv_store_35e6abe9
   📍 Key: "prediction:xyz789"
   📍 Value: { type, result, confidence, ... }
   📍 Location: PostgreSQL on AWS
```

---

## 📱 WHAT'S STORED WHERE?

| Data Type | Storage Location | Persistence | Access |
|-----------|-----------------|-------------|--------|
| **User accounts** | Supabase Auth (PostgreSQL) | ✅ Permanent | Backend only |
| **User profiles** | kv_store_35e6abe9 table | ✅ Permanent | Via API |
| **Predictions** | kv_store_35e6abe9 table | ✅ Permanent | Via API |
| **Crop images** | Supabase Storage (S3) | ✅ Permanent | Signed URLs |
| **Community posts** | kv_store_35e6abe9 table | ✅ Permanent | Via API |
| **JWT tokens** | Browser localStorage | ⚠️ Temporary | Frontend |
| **Theme preference** | Browser localStorage | ⚠️ Temporary | Frontend |
| **Language choice** | Browser localStorage | ⚠️ Temporary | Frontend |
| **Source code** | Your computer + Git | ✅ Version controlled | Developers |
| **Built app** | Figma Make CDN | ✅ Until redeployed | Public |

---

## 🔧 HOW TO ACCESS YOUR DATA

### **1. Database (PostgreSQL)**

**Via Supabase Dashboard:**
```
1. Go to: https://supabase.com/dashboard
2. Select project: wofpjmzhspgsestrhney
3. Click: Table Editor
4. View: kv_store_35e6abe9 table
```

**Via API:**
```typescript
// From your backend code
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const { data } = await supabase
  .from('kv_store_35e6abe9')
  .select('*');
```

**Via SQL:**
```sql
-- In Supabase SQL Editor
SELECT * FROM kv_store_35e6abe9 
WHERE key LIKE 'user:%' 
LIMIT 10;
```

---

### **2. Storage (Files)**

**Via Supabase Dashboard:**
```
1. Go to: https://supabase.com/dashboard
2. Select project: wofpjmzhspgsestrhney
3. Click: Storage
4. Open bucket: make-35e6abe9-crop-images
```

**Via API:**
```typescript
// List files
const { data: files } = await supabase.storage
  .from('make-35e6abe9-crop-images')
  .list('user123/');

// Download file
const { data } = await supabase.storage
  .from('make-35e6abe9-crop-images')
  .download('user123/crop1.jpg');
```

---

### **3. Backend Logs**

**Via Supabase Dashboard:**
```
1. Go to: https://supabase.com/dashboard
2. Select project: wofpjmzhspgsestrhney
3. Click: Edge Functions
4. Select: make-server-35e6abe9
5. View: Logs tab
```

---

## 💡 KEY TAKEAWAYS

### ✅ **Backend & Database:**
- 🌐 **Hosted on**: Supabase cloud (AWS infrastructure)
- 📍 **Physical location**: Asia-Pacific data centers
- 💾 **Storage type**: PostgreSQL database + S3 file storage
- 🔐 **Access**: Only via secure API with authentication
- 🚀 **Scalability**: Auto-scales with demand
- 💰 **Cost**: Pay-as-you-grow (free tier available)

### ✅ **Frontend:**
- 💻 **Source code**: On your computer (during development)
- 📦 **Built files**: Generated by Vite (static HTML/CSS/JS)
- 🌐 **Deployed to**: Figma Make platform
- 🚀 **Served from**: CDN (Content Delivery Network)
- ⚡ **Speed**: Fast global delivery
- 📱 **Access**: Via web browser (any device)

### ✅ **No Local Servers Needed:**
- ❌ No database on your computer
- ❌ No backend server on your computer
- ❌ No complex deployment process
- ✅ Everything is cloud-native
- ✅ Automatic scaling
- ✅ Zero infrastructure management

---

## 🎓 FOR NON-TECHNICAL PEOPLE

Think of it like this:

**Your App is like a Restaurant:**
- 🏪 **Frontend** = The dining room (what customers see)
- 👨‍🍳 **Backend** = The kitchen (where work happens)
- 🗄️ **Database** = The storage room (where ingredients are kept)
- 📁 **File Storage** = The freezer (for big items like images)

**Where is the restaurant?**
- **NOT in your house** (your computer) ❌
- **IN the cloud** (Supabase's data centers) ✅
- **Accessible from anywhere in the world** 🌍

**When you update the menu (deploy code):**
1. You write the recipe (code) on your computer
2. You send it to the kitchen (Supabase)
3. The kitchen starts serving it (goes live)
4. Customers get the new dish (users see updates)

---

**Last Updated**: March 26, 2026
**Your Project**: SAGRI - Krishi Shayak
**Project ID**: wofpjmzhspgsestrhney
**Status**: Fully Cloud-Hosted ✅
