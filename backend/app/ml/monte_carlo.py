"""ForecastPilot AI — Monte Carlo Simulation Engine"""
import numpy as np
import pandas as pd
from typing import Optional

def run_monte_carlo_simulation(
    df: pd.DataFrame,
    num_simulations: int = 5000,
    forecast_days: int = 30,
) -> dict:
    """Run Monte Carlo simulation for revenue and ROAS forecasting using empirical data."""
    if df is None or df.empty:
        raise ValueError("Historical data is required for legit Monte Carlo.")

    np.random.seed(None)  # True randomness for each run
    
    # 1. Prepare historical daily data
    daily_df = df.groupby('date').agg({
        'revenue': 'sum',
        'spend': 'sum'
    }).reset_index().sort_values('date')
    
    # 2. Calculate daily returns (log returns) for revenue and roas
    # Filter out zeros to avoid log issues
    daily_df = daily_df[daily_df['revenue'] > 0].copy()
    daily_df['revenue_return'] = np.log(daily_df['revenue'] / daily_df['revenue'].shift(1))
    
    daily_df['roas'] = daily_df['revenue'] / np.maximum(daily_df['spend'], 1)
    daily_df['roas_return'] = np.log(daily_df['roas'] / daily_df['roas'].shift(1))

    # Drop NaNs
    returns_df = daily_df.replace([np.inf, -np.inf], np.nan).dropna()

    # Empirical stats with fallbacks
    mu_rev = returns_df['revenue_return'].mean() if not returns_df.empty else 0.001
    sigma_rev = returns_df['revenue_return'].std() if not returns_df.empty else 0.05

    mu_roas = returns_df['roas_return'].mean() if not returns_df.empty else 0.0
    sigma_roas = returns_df['roas_return'].std() if not returns_df.empty else 0.05
    
    # Fill NaN from std if there was only 1 row
    if pd.isna(sigma_rev) or sigma_rev == 0: sigma_rev = 0.05
    if pd.isna(sigma_roas) or sigma_roas == 0: sigma_roas = 0.05
    if pd.isna(mu_rev): mu_rev = 0.001
    if pd.isna(mu_roas): mu_roas = 0.0

    # Current Base Values
    current_revenue = daily_df['revenue'].iloc[-1]
    current_roas = daily_df['roas'].iloc[-1]
    
    # 3. Simulate future paths using Geometric Brownian Motion
    Z_rev = np.random.normal(0, 1, (forecast_days, num_simulations))
    daily_returns_rev = np.exp((mu_rev - 0.5 * sigma_rev**2) + sigma_rev * Z_rev)
    
    Z_roas = np.random.normal(0, 1, (forecast_days, num_simulations))
    daily_returns_roas = np.exp((mu_roas - 0.5 * sigma_roas**2) + sigma_roas * Z_roas)

    rev_paths = np.zeros_like(Z_rev)
    roas_paths = np.zeros_like(Z_roas)
    
    rev_paths[0] = current_revenue * daily_returns_rev[0]
    roas_paths[0] = current_roas * daily_returns_roas[0]
    
    for t in range(1, forecast_days):
        rev_paths[t] = rev_paths[t-1] * daily_returns_rev[t]
        roas_paths[t] = roas_paths[t-1] * daily_returns_roas[t]

    # Total predicted revenue across the period per simulation
    revenue_sims = rev_paths.sum(axis=0)
    
    # Average ROAS across the period per simulation
    roas_sims = roas_paths.mean(axis=0)

    # 4. Extract Percentiles
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

    rev_hist, rev_edges = np.histogram(revenue_sims, bins=50)
    rev_bin_centers = ((rev_edges[:-1] + rev_edges[1:]) / 2).tolist()
    rev_density = (rev_hist / rev_hist.sum()).tolist()

    roas_hist, roas_edges = np.histogram(roas_sims, bins=50)
    roas_bin_centers = ((roas_edges[:-1] + roas_edges[1:]) / 2).tolist()
    roas_density = (roas_hist / roas_hist.sum()).tolist()

    fan_data = {
        "p10": np.percentile(rev_paths, 10, axis=1).tolist(),
        "p25": np.percentile(rev_paths, 25, axis=1).tolist(),
        "p50": np.percentile(rev_paths, 50, axis=1).tolist(),
        "p75": np.percentile(rev_paths, 75, axis=1).tolist(),
        "p90": np.percentile(rev_paths, 90, axis=1).tolist(),
    }

    base_forecast_revenue = current_revenue * forecast_days
    
    prob_above_target = float(np.mean(revenue_sims > base_forecast_revenue * 1.05) * 100)
    prob_above_optimistic = float(np.mean(revenue_sims > base_forecast_revenue * 1.15) * 100)
    prob_below_pessimistic = float(np.mean(revenue_sims < base_forecast_revenue * 0.95) * 100)

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
