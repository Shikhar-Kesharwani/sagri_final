@echo off
TITLE SAGRI - Dual Platform Orchestrator
COLOR 0A

echo =====================================================================
echo              SAGRI AGRICULTURAL INTELLIGENCE PLATFORM
echo               Dual Version Concurrent Orchestration
echo =====================================================================
echo.
echo [1/3] Starting Fast-Inference ML Backend (Port 8000)...
start "SAGRI - ML Backend (Port 8000)" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Classic SAGRI Platform (Port 5173)...
start "SAGRI - Classic Platform (Port 5173)" cmd /k "cd /d %~dp0 && npm run dev:classic"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Modern SAGRI Intelligence (Port 5174)...
start "SAGRI - Modern Intelligence (Port 5174)" cmd /k "cd /d %~dp0new_frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo =====================================================================
echo   ALL 3 SERVICES SUCCESSFULLY LAUNCHED!
echo.
echo   * ML Backend API:     http://localhost:8000  (FastAPI + ONNX + XGBoost + SQLite)
echo   * Classic Platform:   http://localhost:5173  (Classic Green Agronomist Suite)
echo   * Modern Intelligence:http://localhost:5174  (Editorial High-Precision UI)
echo =====================================================================
echo.
echo Launching default browser to both portals...
start http://localhost:5174
start http://localhost:5173

echo.
echo Press any key to stop all background windows or close this terminal.
pause >nul
