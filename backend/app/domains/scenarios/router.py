"""Scenarios Domain — Router"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from app.core.security import get_current_user
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.data_provider import get_historical_df
from app.ml.forecast_engine import generate_forecast
from app.ml.monte_carlo import run_monte_carlo_simulation
from app.ml.optimizer import optimize_budget
from app.ml.llm_service import parse_what_if_scenario, generate_forecast_explanation

router = APIRouter()


class ScenarioRequest(BaseModel):
    name: str = "Custom Scenario"
    budget_adjustments: dict = {}
    total_budget: Optional[float] = None


class MonteCarloRequest(BaseModel):
    num_simulations: int = 5000
    base_revenue: float = 153000
    base_roas: float = 5.24
    forecast_days: int = 30


class OptimizeRequest(BaseModel):
    total_budget: float = 30000
    target_revenue: Optional[float] = None
    target_roas: Optional[float] = None
    constraints: Optional[dict] = None


class WhatIfRequest(BaseModel):
    question: str
    parameters: dict = {}


@router.post("/simulate")
async def simulate_scenario(req: ScenarioRequest, user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    df = await get_historical_df(db)
    forecast = generate_forecast(df=df, forecast_days=30, budget_adjustments=req.budget_adjustments)

    base_forecast = generate_forecast(df=df, forecast_days=30)
    base_revenue = base_forecast["metrics"]["revenue"]["total"]
    scenario_revenue = forecast["metrics"]["revenue"]["total"]
    incremental = scenario_revenue - base_revenue

    return {
        "name": req.name,
        "forecast": forecast,
        "comparison": {
            "base_revenue": round(base_revenue, 2),
            "scenario_revenue": round(scenario_revenue, 2),
            "incremental_revenue": round(incremental, 2),
            "incremental_pct": round(incremental / max(base_revenue, 1) * 100, 1),
            "base_roas": base_forecast["metrics"]["roas"]["average"],
            "scenario_roas": forecast["metrics"]["roas"]["average"],
        },
        "risk_level": "medium" if abs(incremental / max(base_revenue, 1)) < 0.15 else "high",
    }


@router.post("/monte-carlo")
async def monte_carlo(req: MonteCarloRequest, user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    df = await get_historical_df(db)
    return run_monte_carlo_simulation(
        df=df,
        num_simulations=req.num_simulations,
        forecast_days=req.forecast_days,
    )


@router.post("/optimize")
async def optimize(req: OptimizeRequest, user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    df = await get_historical_df(db)
    return optimize_budget(
        df=df,
        total_budget=req.total_budget,
        target_revenue=req.target_revenue,
        target_roas=req.target_roas,
        constraints=req.constraints,
    )


@router.post("/what-if")
async def what_if(req: WhatIfRequest, user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Process what-if scenarios using Groq AI."""
    # 1. Parse natural language intent into budget adjustments using Groq
    adjustments = parse_what_if_scenario(req.question)

    # 2. Generate baseline and adjusted ML forecasts
    df = await get_historical_df(db)
    base = generate_forecast(df=df, forecast_days=30)
    adjusted = generate_forecast(df=df, forecast_days=30, budget_adjustments=adjustments)
    
    base_revenue = base["metrics"]["revenue"]["total"]
    adjusted_revenue = adjusted["metrics"]["revenue"]["total"]

    # 3. Generate natural language explanation of the impact using Groq
    explanation = generate_forecast_explanation(req.question, base_revenue, adjusted_revenue)

    return {
        "question": req.question,
        "base_forecast": {
            "revenue": base_revenue,
            "roas": base["metrics"]["roas"]["average"],
        },
        "adjusted_forecast": {
            "revenue": adjusted_revenue,
            "roas": adjusted["metrics"]["roas"]["average"],
        },
        "impact": {
            "revenue_change": round(adjusted_revenue - base_revenue, 2),
            "roas_change": round(
                adjusted["metrics"]["roas"]["average"] - base["metrics"]["roas"]["average"], 2
            ),
        },
        "explanation": explanation,
    }


@router.get("/")
async def list_scenarios(user: dict = Depends(get_current_user)):
    return [
        {"id": "sc-001", "name": "Baseline", "risk_level": "low", "created_at": "2025-01-15T10:30:00Z"},
        {"id": "sc-002", "name": "Aggressive Growth", "risk_level": "high", "created_at": "2025-01-14T09:15:00Z"},
        {"id": "sc-003", "name": "Conservative", "risk_level": "low", "created_at": "2025-01-13T16:45:00Z"},
    ]
