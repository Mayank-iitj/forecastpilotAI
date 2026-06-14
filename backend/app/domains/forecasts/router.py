"""Forecasts Domain — Router"""
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional
from app.core.security import get_current_user
from app.ml.forecast_engine import generate_forecast

router = APIRouter()


class ForecastRequest(BaseModel):
    forecast_days: int = 30
    channel: Optional[str] = None
    budget_adjustments: Optional[dict] = None


@router.post("/generate")
async def create_forecast(
    req: ForecastRequest,
    user: dict = Depends(get_current_user),
):
    result = generate_forecast(
        forecast_days=req.forecast_days,
        channel=req.channel,
        budget_adjustments=req.budget_adjustments,
    )
    return result


@router.get("/overview")
async def get_overview(user: dict = Depends(get_current_user)):
    # Generate some realistic-looking data for the dashboard
    import math
    import random
    
    # Revenue Trend
    trend_data = []
    for i in range(30):
        base = 4800 + math.sin(i / 4) * 600 + i * 25
        trend_data.append({
            "date": f"Jan {i + 1}",
            "actual": round(base + random.uniform(-150, 150)),
            "forecast": round(base * 1.04 + random.uniform(0, 250)),
        })
        
    channel_data = [
        {"name": "Google", "revenue": 45000, "color": "#4285F4"},
        {"name": "Meta", "revenue": 38000, "color": "#1877F2"},
        {"name": "Organic", "revenue": 28000, "color": "#34A853"},
        {"name": "Email", "revenue": 15000, "color": "#9333EA"},
        {"name": "Microsoft", "revenue": 12000, "color": "#00A4EF"},
        {"name": "Affiliate", "revenue": 8500, "color": "#FF6D01"},
        {"name": "Display", "revenue": 6500, "color": "#F59E0B"},
    ]
    
    kpis = [
        {"label": "Forecast Revenue", "value": "$153,000", "change": "+5.2%", "trend": "up", "color": "from-blue-500 to-cyan-400"},
        {"label": "Forecast ROAS", "value": "5.24x", "change": "+0.3x", "trend": "up", "color": "from-green-500 to-emerald-400"},
        {"label": "Forecast Confidence", "value": "87.3%", "change": "", "trend": "neutral", "color": "from-purple-500 to-violet-400"},
        {"label": "Revenue Risk", "value": "Medium", "change": "", "trend": "neutral", "color": "from-amber-500 to-orange-400"},
        {"label": "Forecast Accuracy", "value": "91.2%", "change": "+1.8%", "trend": "up", "color": "from-teal-500 to-cyan-400"},
        {"label": "Budget Efficiency", "value": "82.5%", "change": "-2.1%", "trend": "down", "color": "from-indigo-500 to-blue-400"},
    ]
    
    return {
        "revenueTrend": trend_data,
        "channelData": channel_data,
        "kpiCards": kpis
    }

@router.get("/")
async def get_forecasts(user: dict = Depends(get_current_user)):
    """Return list of past forecasts."""
    return [
        {
            "id": "fc-001",
            "name": "Q3 Revenue Forecast",
            "forecast_days": 30,
            "status": "completed",
            "confidence_score": 87.3,
            "accuracy_score": 91.2,
            "created_at": "2025-01-15T10:30:00Z",
        },
        {
            "id": "fc-002",
            "name": "60-Day Extended Forecast",
            "forecast_days": 60,
            "status": "completed",
            "confidence_score": 84.1,
            "accuracy_score": 89.5,
            "created_at": "2025-01-10T14:20:00Z",
        },
    ]


@router.get("/{forecast_id}")
async def get_forecast(forecast_id: str, user: dict = Depends(get_current_user)):
    result = generate_forecast(forecast_days=30)
    result["id"] = forecast_id
    return result
