"""AI Domain — Router (AI Marketing CFO + Report Generator)"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from typing import Optional, List, Dict
from app.core.security import get_current_user
from app.ml.llm_service import generate_cfo_chat_response

router = APIRouter()

# Pre-built intelligent demo responses
DEMO_RESPONSES = {
    "revenue_drop": {
        "title": "Revenue Decline Analysis",
        "response": """Based on the current forecast data, revenue is projected to decline by approximately 11% over the next 30 days. Here's my analysis:

**Primary Drivers:**
1. **Meta CPC Inflation (+23%)** — Cost-per-click on Meta has risen significantly, reducing the effective ROAS from 4.2x to 3.4x
2. **Conversion Rate Decline (-8%)** — Site-wide conversion rate has dropped, particularly on mobile devices (down 12%)
3. **Branded Search Volume (-15%)** — Organic branded queries are declining, suggesting reduced brand awareness or seasonal effect

**Recommended Actions:**
- Shift 12% of Meta prospecting budget to Google Shopping where ROAS remains strong at 5.2x
- Implement retargeting frequency caps to reduce audience fatigue
- Test new landing page variants to address conversion rate decline
- Increase email marketing frequency to capture existing audience

**Expected Impact:** Following these recommendations could recover 60-70% of the projected revenue decline, bringing the net impact to approximately -3.5%.""",
    },
    "budget_allocation": {
        "title": "Budget Allocation Recommendation",
        "response": """Here's my recommended budget allocation strategy for next month based on current channel performance and diminishing returns analysis:

**Optimal Allocation ($30,000 budget):**

| Channel | Current | Recommended | Change |
|---------|---------|-------------|--------|
| Google Ads | 35% | 38% | +3% |
| Meta Ads | 33% | 28% | -5% |
| Microsoft Ads | 12% | 14% | +2% |
| Email | 5% | 8% | +3% |
| Affiliate | 8% | 7% | -1% |
| Display | 7% | 5% | -2% |

**Rationale:**
- Google Shopping campaigns show the highest marginal ROAS (5.8x) with room for scale
- Meta Ads approaching saturation — each additional dollar yields diminishing returns
- Email marketing is severely underfunded relative to its 42x ROAS
- Display CPMs have inflated 18% — reduce until market normalizes

**Projected Impact:** +$8,400 incremental revenue (+5.5% improvement) with the same total spend.""",
    },
    "campaign_performance": {
        "title": "Campaign Performance Analysis",
        "response": """I've identified several underperforming campaigns that require attention:

**🔴 Critical — Immediate Action Required:**
1. **Meta Prospecting — Broad Audiences** (ROAS: 1.2x, Target: 3.0x)
   - Audience fatigue detected after 45-day run
   - Action: Refresh creatives and narrow targeting

2. **Google Display — Remarketing 180d** (ROAS: 0.8x)
   - Audience window too wide, capturing low-intent users
   - Action: Reduce to 30-day remarketing window

**🟡 Warning — Monitor Closely:**
3. **Microsoft Shopping — Non-Brand** (ROAS: 2.8x, declining)
   - Trending down 15% week-over-week
   - Action: Review search term report, add negatives

**🟢 Opportunity — Scale Up:**
4. **Google Shopping — PMAX** (ROAS: 6.1x, stable)
   - High efficiency with room for 25% budget increase
   - Action: Increase daily budget by $150""",
    },
    "roas_improvement": {
        "title": "ROAS Improvement Strategy",
        "response": """Here's a comprehensive strategy to improve overall ROAS from the current 4.2x to the target 5.0x:

**Quick Wins (1-2 weeks):**
1. Pause campaigns with ROAS below 2.0x — saves ~$2,100/month
2. Implement dayparting: reduce bids 30% during 11PM-6AM (low conversion hours)
3. Add negative keywords from search term analysis — estimated +0.3x ROAS lift

**Medium-Term (2-4 weeks):**
4. Launch lookalike audiences based on top 10% LTV customers
5. A/B test landing pages — current CVR of 2.8% has 40% improvement potential
6. Implement value-based bidding on Google Ads

**Strategic (1-2 months):**
7. Build first-party data strategy for cookieless future
8. Develop email nurture sequences to reduce CAC by 20%
9. Test incrementality of Display channel — may be cannibalizing organic

**Projected Timeline:**
- Week 2: ROAS → 4.5x (+7%)
- Week 4: ROAS → 4.8x (+14%)
- Week 8: ROAS → 5.1x (+21%)""",
    },
}


class ChatRequest(BaseModel):
    message: Optional[str] = None
    messages: Optional[List[Dict[str, str]]] = None
    context: Optional[dict] = None


class ReportRequest(BaseModel):
    report_type: str = "executive"
    forecast_data: Optional[dict] = None
    include_sections: list[str] = [
        "executive_summary",
        "key_insights",
        "forecast_drivers",
        "risk_analysis",
        "recommendations",
        "budget_strategy",
    ]


@router.post("/chat")
async def ai_chat(req: ChatRequest, user: dict = Depends(get_current_user)):
    """AI Marketing CFO chat endpoint using Groq."""
    
    # Support both single message and full message history
    if req.messages:
        messages = req.messages
    elif req.message:
        messages = [{"role": "user", "content": req.message}]
    else:
        messages = []

    # Get dynamic response from Groq
    ai_response = generate_cfo_chat_response(messages)

    return {
        "message": req.message or (messages[-1].get("content", "") if messages else ""),
        "response": ai_response,
        "title": "AI Analysis",
        "suggestions": [
            "Why is revenue expected to drop?",
            "Where should we invest next month?",
            "Which campaign is underperforming?",
            "How can we improve ROAS?",
            "Generate a client report",
            "What are the main risks?",
        ],
    }


@router.post("/generate-report")
async def generate_report(req: ReportRequest, user: dict = Depends(get_current_user)):
    """Generate AI-powered executive report."""
    report = {
        "title": f"ForecastPilot AI — {req.report_type.title()} Report",
        "generated_at": "2025-01-15T10:30:00Z",
        "sections": {},
    }

    if "executive_summary" in req.include_sections:
        report["sections"]["executive_summary"] = {
            "title": "Executive Summary",
            "content": "Revenue is projected at $153,000 over the next 30 days, representing a 3.2% increase from the previous period. ROAS is expected to maintain at 5.24x with 87.3% forecast confidence. The primary growth driver is Google Shopping, while Meta Ads shows early signs of audience fatigue requiring attention.",
        }

    if "key_insights" in req.include_sections:
        report["sections"]["key_insights"] = {
            "title": "Key Insights",
            "items": [
                {"insight": "Google Shopping ROAS increased 12% to 5.2x — highest in 6 months", "impact": "positive"},
                {"insight": "Meta CPC inflated 23% — monitor for continued upward pressure", "impact": "negative"},
                {"insight": "Email channel severely underutilized at 42x ROAS", "impact": "opportunity"},
                {"insight": "Conversion rate declined 8% across all channels", "impact": "negative"},
                {"insight": "Microsoft Ads showing strong growth trajectory (+18% MoM)", "impact": "positive"},
            ],
        }

    if "forecast_drivers" in req.include_sections:
        report["sections"]["forecast_drivers"] = {
            "title": "Forecast Drivers",
            "drivers": [
                {"name": "Channel Mix Optimization", "contribution": 35, "direction": "positive"},
                {"name": "Seasonal Demand Patterns", "contribution": 25, "direction": "positive"},
                {"name": "CPC Inflation", "contribution": -15, "direction": "negative"},
                {"name": "Conversion Rate Trends", "contribution": -10, "direction": "negative"},
                {"name": "Budget Efficiency Gains", "contribution": 20, "direction": "positive"},
            ],
        }

    if "risk_analysis" in req.include_sections:
        report["sections"]["risk_analysis"] = {
            "title": "Risk Analysis",
            "overall_risk": "medium",
            "risks": [
                {"risk": "Meta audience saturation", "probability": "high", "impact": "medium", "mitigation": "Diversify to TikTok and Pinterest"},
                {"risk": "CPC inflation continues", "probability": "medium", "impact": "high", "mitigation": "Increase quality score optimization efforts"},
                {"risk": "Conversion rate decline accelerates", "probability": "low", "impact": "critical", "mitigation": "CRO sprint with A/B testing"},
            ],
        }

    if "recommendations" in req.include_sections:
        report["sections"]["recommendations"] = {
            "title": "Recommendations",
            "items": [
                {"priority": "high", "action": "Shift 12% budget from Meta to Google Shopping", "expected_impact": "+$4,200 revenue"},
                {"priority": "high", "action": "Triple email marketing budget from $357 to $1,000", "expected_impact": "+$18,000 revenue at 42x ROAS"},
                {"priority": "medium", "action": "Launch Microsoft Ads Shopping campaigns", "expected_impact": "+$2,800 revenue"},
                {"priority": "medium", "action": "Implement retargeting frequency caps", "expected_impact": "+8% ROAS improvement"},
                {"priority": "low", "action": "Test Performance Max on Microsoft Ads", "expected_impact": "Potential new growth channel"},
            ],
        }

    if "budget_strategy" in req.include_sections:
        report["sections"]["budget_strategy"] = {
            "title": "Budget Strategy",
            "current_budget": 29262,
            "recommended_budget": 32000,
            "allocation": {
                "google_ads": {"pct": 38, "amount": 12160},
                "meta_ads": {"pct": 28, "amount": 8960},
                "microsoft_ads": {"pct": 14, "amount": 4480},
                "email": {"pct": 8, "amount": 2560},
                "affiliate": {"pct": 7, "amount": 2240},
                "display": {"pct": 5, "amount": 1600},
            },
        }

    return report


@router.get("/insights")
async def get_insights(user: dict = Depends(get_current_user)):
    """Get AI-generated insights."""
    return [
        {
            "id": "ins-001",
            "type": "opportunity",
            "title": "Email Channel Underutilized",
            "description": "Email marketing shows 42x ROAS but receives only 1.2% of total budget. Increasing allocation could yield significant incremental revenue.",
            "severity": "high",
            "impact": "+$18,000 potential revenue",
            "created_at": "2025-01-15T09:00:00Z",
        },
        {
            "id": "ins-002",
            "type": "risk",
            "title": "Meta Audience Fatigue Detected",
            "description": "Prospecting campaigns on Meta showing 23% CPM increase over 30 days. Frequency exceeding 4.2 indicates audience saturation.",
            "severity": "medium",
            "impact": "-$3,200 if unchecked",
            "created_at": "2025-01-15T08:30:00Z",
        },
        {
            "id": "ins-003",
            "type": "anomaly",
            "title": "Google CPC Drop Anomaly",
            "description": "Google Shopping CPCs dropped 18% yesterday — significantly outside normal variance. Possible competitor exit or algorithm change.",
            "severity": "low",
            "impact": "Monitor for sustainability",
            "created_at": "2025-01-14T16:00:00Z",
        },
        {
            "id": "ins-004",
            "type": "forecast",
            "title": "Seasonal Uplift Expected",
            "description": "Historical patterns indicate 15-20% revenue uplift in the next 2 weeks. Consider increasing budgets to capture incremental demand.",
            "severity": "medium",
            "impact": "+$12,000 opportunity",
            "created_at": "2025-01-14T12:00:00Z",
        },
    ]
