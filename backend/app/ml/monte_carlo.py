"""ForecastPilot AI — Monte Carlo Simulation Engine"""
import numpy as np
from typing import Optional


def run_monte_carlo_simulation(
    base_revenue: float = 153000,
    base_roas: float = 5.24,
    base_spend: float = 29262,
    num_simulations: int = 5000,
    forecast_days: int = 30,
    revenue_volatility: float = 0.15,
    roas_volatility: float = 0.12,
) -> dict:
    """Run Monte Carlo simulation for revenue and ROAS forecasting."""
    np.random.seed(None)  # True randomness for each run

    # Revenue simulations — log-normal distribution
    revenue_sims = np.random.lognormal(
        mean=np.log(base_revenue) - 0.5 * revenue_volatility**2,
        sigma=revenue_volatility,
        size=num_simulations,
    )

    # ROAS simulations — normal with floor
    roas_sims = np.maximum(
        0.5,
        np.random.normal(loc=base_roas, scale=base_roas * roas_volatility, size=num_simulations),
    )

    # Spend simulations
    spend_sims = revenue_sims / np.maximum(roas_sims, 0.1)

    # Revenue distribution stats
    rev_percentiles = {
        "p5": round(float(np.percentile(revenue_sims, 5)), 2),
        "p10": round(float(np.percentile(revenue_sims, 10)), 2),
        "p25": round(float(np.percentile(revenue_sims, 25)), 2),
        "p50": round(float(np.percentile(revenue_sims, 50)), 2),
        "p75": round(float(np.percentile(revenue_sims, 75)), 2),
        "p90": round(float(np.percentile(revenue_sims, 90)), 2),
        "p95": round(float(np.percentile(revenue_sims, 95)), 2),
    }

    roas_percentiles = {
        "p5": round(float(np.percentile(roas_sims, 5)), 2),
        "p10": round(float(np.percentile(roas_sims, 10)), 2),
        "p25": round(float(np.percentile(roas_sims, 25)), 2),
        "p50": round(float(np.percentile(roas_sims, 50)), 2),
        "p75": round(float(np.percentile(roas_sims, 75)), 2),
        "p90": round(float(np.percentile(roas_sims, 90)), 2),
        "p95": round(float(np.percentile(roas_sims, 95)), 2),
    }

    # Revenue histogram (for density chart)
    rev_hist, rev_edges = np.histogram(revenue_sims, bins=50)
    rev_bin_centers = ((rev_edges[:-1] + rev_edges[1:]) / 2).tolist()
    rev_density = (rev_hist / rev_hist.sum()).tolist()

    # ROAS histogram
    roas_hist, roas_edges = np.histogram(roas_sims, bins=50)
    roas_bin_centers = ((roas_edges[:-1] + roas_edges[1:]) / 2).tolist()
    roas_density = (roas_hist / roas_hist.sum()).tolist()

    # Fan chart data — simulate daily paths
    num_fan_paths = min(100, num_simulations)
    daily_paths = []
    for i in range(num_fan_paths):
        daily_revenue = base_revenue / forecast_days
        path = [daily_revenue]
        for d in range(1, forecast_days):
            shock = np.random.normal(0, daily_revenue * revenue_volatility * 0.1)
            path.append(max(0, path[-1] + shock))
        daily_paths.append(path)

    fan_data = {
        "p10": [float(np.percentile([p[d] for p in daily_paths], 10)) for d in range(forecast_days)],
        "p25": [float(np.percentile([p[d] for p in daily_paths], 25)) for d in range(forecast_days)],
        "p50": [float(np.percentile([p[d] for p in daily_paths], 50)) for d in range(forecast_days)],
        "p75": [float(np.percentile([p[d] for p in daily_paths], 75)) for d in range(forecast_days)],
        "p90": [float(np.percentile([p[d] for p in daily_paths], 90)) for d in range(forecast_days)],
    }

    # Probability calculations
    prob_above_target = float(np.mean(revenue_sims > base_revenue * 0.9) * 100)
    prob_above_optimistic = float(np.mean(revenue_sims > base_revenue * 1.1) * 100)
    prob_below_pessimistic = float(np.mean(revenue_sims < base_revenue * 0.8) * 100)

    return {
        "num_simulations": num_simulations,
        "forecast_days": forecast_days,
        "revenue": {
            "mean": round(float(np.mean(revenue_sims)), 2),
            "median": round(float(np.median(revenue_sims)), 2),
            "std": round(float(np.std(revenue_sims)), 2),
            "min": round(float(np.min(revenue_sims)), 2),
            "max": round(float(np.max(revenue_sims)), 2),
            "percentiles": rev_percentiles,
            "histogram": {"bins": rev_bin_centers, "density": rev_density},
        },
        "roas": {
            "mean": round(float(np.mean(roas_sims)), 2),
            "median": round(float(np.median(roas_sims)), 2),
            "std": round(float(np.std(roas_sims)), 2),
            "min": round(float(np.min(roas_sims)), 2),
            "max": round(float(np.max(roas_sims)), 2),
            "percentiles": roas_percentiles,
            "histogram": {"bins": roas_bin_centers, "density": roas_density},
        },
        "fan_chart": fan_data,
        "probabilities": {
            "above_90pct_target": round(prob_above_target, 1),
            "above_110pct_target": round(prob_above_optimistic, 1),
            "below_80pct_target": round(prob_below_pessimistic, 1),
        },
        "confidence_interval_95": {
            "revenue": [rev_percentiles["p5"], rev_percentiles["p95"]],
            "roas": [roas_percentiles["p5"], roas_percentiles["p95"]],
        },
    }
