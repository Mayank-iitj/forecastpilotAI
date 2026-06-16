@echo off
echo ========================================================
echo Starting ForecastPilot AI (Backend and Frontend)
echo ========================================================

echo Starting Python FastAPI Backend on port 8000...
start cmd /k "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Next.js Frontend on port 3000...
start cmd /k "cd frontend && npm run dev"

echo Both services are starting up! 
echo Open http://localhost:3000 in your browser.
