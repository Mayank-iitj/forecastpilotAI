# ForecastPilot AI - Architecture Overview

ForecastPilot AI is built using a modern, scalable stack designed for rapid prototyping and robust data processing.

## 1. Frontend Stack
*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Framer Motion (for dynamic micro-animations and "wow" factor)
*   **Charting:** Recharts (for responsive, interactive data visualization including confidence intervals)

## 2. Backend Stack
*   **Framework:** FastAPI (Python)
*   **Language:** Python 3.10+
*   **Database:** SQLite (for local hackathon prototyping, easily swappable to PostgreSQL)
*   **Concurrency:** Async routes for non-blocking I/O during heavy ML processing.

## 3. Forecasting Pipeline
The ML pipeline is located in the `app/ml/` directory.
1.  **Data Aggregation:** Raw campaign data is aggregated daily across all channels.
2.  **Prophet Engine (`forecast_engine.py`):** Extracts trend, yearly seasonality, and weekly seasonality from historical Revenue, Spend, and Conversions. Generates deterministic baseline forecasts.
3.  **Monte Carlo Engine (`monte_carlo.py`):** Calculates historical log returns and standard deviations. Runs 5,000+ simulations using Geometric Brownian Motion to generate a distribution of possible future outcomes.
4.  **Synthesis:** The API combines Prophet trends with Monte Carlo percentiles to produce the final Expected, Optimistic (p95), and Pessimistic (p5) bands.

## 4. LLM Integration Workflow
Located in `app/ml/llm_service.py`, using the Groq API:
1.  **Intent Parsing:** User questions (e.g., "What if Google Ads spend drops 10%?") are sent to the LLM to extract structured JSON parameters (`{"google_ads": -10}`).
2.  **Simulation Execution:** The extracted parameters are applied to the forecasting engine with a diminishing returns factor.
3.  **Causal Explanation:** The numerical difference between the base forecast and the simulated forecast is passed back to the LLM to generate a natural language, executive-style explanation of the impact.
