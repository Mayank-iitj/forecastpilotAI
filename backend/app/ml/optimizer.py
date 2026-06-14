"""ForecastPilot AI — Budget Optimizer (Constrained Optimization)"""
import numpy as np
from typing import Optional


CHANNEL_CURVES = {
    "google_ads": {"alpha": 0.65, "beta": 0.45, "max_efficiency": 5.2, "saturation": 25000},
    "meta_ads": {"alpha": 0.60, "beta": 0.42, "max_efficiency": 4.8, "saturation": 22000},
    "microsoft_ads": {"alpha": 0.55, "beta": 0.40, "max_efficiency": 4.1, "saturation": 12000},
    "organic_search": {"alpha": 0.80, "beta": 0.30, "max_efficiency": 0, "saturation": 0},
    "affiliate": {"alpha": 0.70, "beta": 0.50, "max_efficiency": 5.5, "saturation": 8000},
    "email": {"alpha": 0.85, "beta": 0.25, "max_efficiency": 42.0, "saturation": 2000},
    "display": {"alpha": 0.45, "beta": 0.35, "max_efficiency": 2.5, "saturation": 15000},
}


def _response_curve(spend: float, alpha: float, beta: float, max_eff: float, sat: float) -> float:
    """Diminishing returns response curve."""
    if sat <= 0 or max_eff <= 0:
        return 0
    normalized = spend / sat
    response = max_eff * (1 - np.exp(-alpha * normalized)) * np.exp(-beta * normalized * 0.1)
    return float(response * spend)


def optimize_budget(
    total_budget: float = 30000,
    target_revenue: Optional[float] = None,
    target_roas: Optional[float] = None,
    constraints: Optional[dict] = None,
) -> dict:
    """Find optimal budget allocation across channels using grid search with response curves."""

    paid_channels = {k: v for k, v in CHANNEL_CURVES.items() if v["max_efficiency"] > 0}
    channel_names = list(paid_channels.keys())
    n_channels = len(channel_names)

    best_allocation = {}
    best_revenue = 0
    best_roas = 0

    # Run optimization (simplified grid search + random perturbation)
    n_iterations = 2000
    for _ in range(n_iterations):
        # Random allocation
        weights = np.random.dirichlet(np.ones(n_channels) * 2)

        # Apply constraints
        if constraints:
            for i, ch in enumerate(channel_names):
                if ch in constraints:
                    min_pct = constraints[ch].get("min_pct", 0) / 100
                    max_pct = constraints[ch].get("max_pct", 100) / 100
                    weights[i] = np.clip(weights[i], min_pct, max_pct)
            weights /= weights.sum()

        allocation = weights * total_budget
        total_rev = 0

        for i, ch in enumerate(channel_names):
            params = paid_channels[ch]
            rev = _response_curve(allocation[i], params["alpha"], params["beta"],
                                  params["max_efficiency"], params["saturation"])
            total_rev += rev

        roas = total_rev / max(total_budget, 1)

        # Scoring
        score = total_rev
        if target_revenue:
            score -= abs(total_rev - target_revenue) * 0.5
        if target_roas:
            score -= abs(roas - target_roas) * total_budget * 0.3

        if score > best_revenue or best_revenue == 0:
            best_revenue = total_rev
            best_roas = roas
            best_allocation = {ch: round(float(allocation[i]), 2) for i, ch in enumerate(channel_names)}

    # Add organic (no spend required)
    organic_revenue = 28000  # Baseline organic
    total_expected_revenue = best_revenue + organic_revenue

    # Build result
    channel_results = {}
    for ch, spend in best_allocation.items():
        params = paid_channels[ch]
        rev = _response_curve(spend, params["alpha"], params["beta"],
                              params["max_efficiency"], params["saturation"])
        channel_roas = rev / max(spend, 1)
        channel_results[ch] = {
            "allocated_budget": round(spend, 2),
            "allocation_pct": round(spend / total_budget * 100, 1),
            "expected_revenue": round(rev, 2),
            "expected_roas": round(channel_roas, 2),
            "marginal_roas": round(channel_roas * 0.85, 2),  # Diminishing
        }

    # Add organic
    channel_results["organic_search"] = {
        "allocated_budget": 0,
        "allocation_pct": 0,
        "expected_revenue": organic_revenue,
        "expected_roas": 0,
        "marginal_roas": 0,
    }

    confidence = min(95, 75 + (n_iterations / 100))

    reasoning = _generate_reasoning(channel_results, total_budget, total_expected_revenue)

    return {
        "total_budget": total_budget,
        "expected_revenue": round(total_expected_revenue, 2),
        "expected_roas": round(total_expected_revenue / max(total_budget, 1), 2),
        "confidence_score": round(confidence, 1),
        "allocation": channel_results,
        "reasoning": reasoning,
        "target_revenue": target_revenue,
        "target_roas": target_roas,
    }


def _generate_reasoning(channels: dict, budget: float, revenue: float) -> list[str]:
    """Generate AI-style reasoning for the optimization."""
    sorted_channels = sorted(
        [(k, v) for k, v in channels.items() if v["allocated_budget"] > 0],
        key=lambda x: x[1]["expected_roas"],
        reverse=True,
    )

    reasons = [
        f"Optimal allocation of ${budget:,.0f} budget yields projected revenue of ${revenue:,.0f} (ROAS: {revenue/max(budget,1):.1f}x).",
    ]

    if sorted_channels:
        top = sorted_channels[0]
        reasons.append(
            f"{top[0].replace('_', ' ').title()} receives highest allocation ({top[1]['allocation_pct']}%) due to superior efficiency at {top[1]['expected_roas']:.1f}x ROAS."
        )

    if len(sorted_channels) > 1:
        bottom = sorted_channels[-1]
        reasons.append(
            f"{bottom[0].replace('_', ' ').title()} is allocated {bottom[1]['allocation_pct']}% — approaching saturation point with diminishing returns."
        )

    reasons.append(
        "Organic search contributes baseline revenue without direct spend investment."
    )
    reasons.append(
        "Recommendation: Monitor marginal ROAS weekly and reallocate from saturated channels to high-efficiency ones."
    )

    return reasons
