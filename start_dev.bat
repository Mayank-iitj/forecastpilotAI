@echo off
echo Starting ForecastPilot AI...

echo Starting Backend...
start cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both services are starting up in new windows.
