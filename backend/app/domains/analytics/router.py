"""Analytics Domain — Router"""
from fastapi import APIRouter, Depends
from app.core.security import get_current_user
import numpy as np

router = APIRouter()


@router.get("/overview")
async def analytics_overview(user: dict = Depends(get_current_user)):
    np.random.seed(42)
    days = 90
    dates = [f"2025-01-{(i%30)+1:02d}" for i in range(days)]

    return {
        "revenue_trend": {
            "dates": dates,
            "actual": (np.random.lognormal(np.log(5000), 0.12, days)).tolist(),
            "forecast": (np.random.lognormal(np.log(5100), 0.10, days)).tolist(),
        },
        "roas_trend": {
            "dates": dates,
            "values": (np.random.normal(5.2, 0.5, days).clip(2, 8)).tolist(),
        },
        "channel_performance": [
            {"channel": "Google Ads", "revenue": 135000, "spend": 32000, "roas": 4.22, "conversions": 1588, "color": "#4285F4"},
            {"channel": "Meta Ads", "revenue": 114000, "spend": 30000, "roas": 3.80, "conversions": 1341, "color": "#1877F2"},
            {"channel": "Microsoft Ads", "revenue": 36000, "spend": 10200, "roas": 3.53, "conversions": 424, "color": "#00A4EF"},
            {"channel": "Organic Search", "revenue": 84000, "spend": 0, "roas": 0, "conversions": 988, "color": "#34A853"},
            {"channel": "Email", "revenue": 45000, "spend": 1070, "roas": 42.06, "conversions": 529, "color": "#9333EA"},
            {"channel": "Affiliate", "revenue": 25500, "spend": 5000, "roas": 5.10, "conversions": 300, "color": "#FF6D01"},
            {"channel": "Display", "revenue": 19500, "spend": 9285, "roas": 2.10, "conversions": 229, "color": "#F59E0B"},
        ],
        "forecast_accuracy": {
            "overall": 91.2,
            "by_channel": {"google_ads": 93.1, "meta_ads": 89.4, "microsoft_ads": 88.7, "organic": 94.2, "email": 91.8},
        },
        "risk_heatmap": [
            {"channel": "Google Ads", "revenue_risk": "low", "roas_risk": "low", "stability": "high"},
            {"channel": "Meta Ads", "revenue_risk": "medium", "roas_risk": "high", "stability": "medium"},
            {"channel": "Microsoft Ads", "revenue_risk": "low", "roas_risk": "medium", "stability": "high"},
            {"channel": "Organic", "revenue_risk": "low", "roas_risk": "low", "stability": "high"},
            {"channel": "Email", "revenue_risk": "low", "roas_risk": "low", "stability": "high"},
            {"channel": "Display", "revenue_risk": "high", "roas_risk": "high", "stability": "low"},
        ],
        "feature_importance": [
            {"feature": "Spend", "importance": 0.32},
            {"feature": "Day of Week", "importance": 0.18},
            {"feature": "CPC", "importance": 0.15},
            {"feature": "Seasonality", "importance": 0.12},
            {"feature": "Conversion Rate", "importance": 0.10},
            {"feature": "Impressions", "importance": 0.08},
            {"feature": "CTR", "importance": 0.05},
        ],
    }


@router.get("/correlation")
async def correlation_matrix(user: dict = Depends(get_current_user)):
    metrics = ["Spend", "Revenue", "ROAS", "Conversions", "CPC", "CTR", "Impressions"]
    n = len(metrics)
    np.random.seed(42)
    corr = np.eye(n)
    corr[0, 1] = corr[1, 0] = 0.85
    corr[0, 3] = corr[3, 0] = 0.72
    corr[1, 3] = corr[3, 1] = 0.91
    corr[0, 2] = corr[2, 0] = -0.15
    corr[1, 2] = corr[2, 1] = 0.45
    corr[4, 2] = corr[2, 4] = -0.62
    corr[5, 3] = corr[3, 5] = 0.58
    corr[6, 0] = corr[0, 6] = 0.68
    corr[6, 1] = corr[1, 6] = 0.55

    return {"metrics": metrics, "matrix": corr.tolist()}
