# SAGRI Dual-Platform Architecture & Operations Guide

This repository contains **two complete, fully functional versions** of the SAGRI frontend platform running side-by-side, sharing a unified Machine Learning and SQLite persistence backend.

---

## 1. Quick Access Matrix

| Platform Version | Primary Port | Source Directory | Tech Stack & Aesthetic | Ideal Audience |
| :--- | :--- | :--- | :--- | :--- |
| **SAGRI Classic** | `http://localhost:5173` | `/src` (Repository Root) | Vite + React + Tailwind + Motion (Vibrant emerald green agronomist portal, 3D Canvas visualizer, gamified rewards) | Farmers, village field extension officers, retail agronomists |
| **SAGRI Modern Intelligence** | `http://localhost:5174` | `/new_frontend` | Vite + React 18 + Tailwind v3 + Radix UI (Editorial beige/dark high-precision Linear/Palantir aesthetic) | Enterprise buyers, agritech executives, investors, agronomist researchers |
| **Unified ML Backend** | `http://localhost:8000` | `/backend` | FastAPI + ONNX Runtime (38-class MobileNetV2) + Scikit-Learn + XGBoost Classifier + SQLite WAL DB | Core intelligence engine serving both frontends |

---

## 2. Launching Both Versions Simultaneously

### Method A: Single-Click Launcher (Windows)
Double-click `start_all_servers.bat` in the repository root.
It will automatically launch:
1. Backend Uvicorn server on **Port 8000**
2. Classic SAGRI Frontend on **Port 5173**
3. Modern SAGRI Intelligence Frontend on **Port 5174**
4. Opens both browser tabs simultaneously.

---

### Method B: NPM Commands (Terminal)

From the repository root:

* **Run Classic Platform (Port 5173):**
  ```bash
  npm run dev:classic
  # or npm run dev
  ```

* **Run Modern Platform (Port 5174):**
  ```bash
  npm run dev:modern
  ```

* **Run Backend (Port 8000):**
  ```bash
  npm run dev:backend
  ```

---

## 3. Seamless Cross-Platform Navigation

Both frontends now include built-in header links for instant switching:
* In **Classic Platform (5173)**: Click the **`✨ Modern 5174 ↗`** button in the header bar.
* In **Modern Platform (5174)**: Click the **`🌿 Classic 5173 ↗`** button in the header bar.

---

## 4. Shared Backend & Persistent Database

Both frontends communicate with the same live backend at `http://localhost:8000`:
* **Prediction History:** Both platforms write and read from the permanent SQLite database (`backend/data/sagri.db`). Any prediction performed on either frontend is persisted and visible across restarts.
* **Disease Detection:** Both platforms use the 38-class ONNX MobileNetV2 model (`models/disease_model.onnx`).
* **Crop Recommendation:** Both platforms query the 22-crop Random Forest model with genuine unmanipulated probabilities.
* **Risk Radar:** Both platforms calculate calibrated risk using the trained XGBoost Classifier combined with agro-climatic shortfall metrics.
