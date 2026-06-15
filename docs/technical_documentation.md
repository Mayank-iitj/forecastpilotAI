# ForecastPilot AI - Technical Documentation

## 1. Overview
ForecastPilot AI is an advanced probabilistic forecasting and scenario-planning platform tailored for digital marketing. It moves beyond traditional deterministic forecasting (e.g., standard ROAS targets) by incorporating stochastic models to generate confidence intervals (P5 to P95) for key performance metrics such as Aggregate Revenue and Blended ROAS across Google Ads, Meta Ads, and Microsoft Ads.

## 2. Methodology

### 2.1 Baseline Generation (Facebook Prophet)
We utilize Facebook's Prophet library to establish the deterministic baseline forecast. Prophet is highly resilient to missing data and shifts in the trend, and it effectively models multiple seasonality cycles (weekly, yearly).
*   **Inputs:** Daily aggregated marketing spend, revenue, and conversions from historical CSVs.
*   **Outputs:** Expected daily values (yhat).

### 2.2 Probabilistic Simulation (Monte Carlo)
To account for the inherent volatility in digital marketing environments, we apply a Monte Carlo simulation.
*   **Model:** Geometric Brownian Motion (GBM).
*   **Mechanism:** We calculate the historical daily log returns and volatility of ROAS and Revenue. We then project 5,000 parallel futures over 30, 60, and 90-day windows.
*   **Output:** A distribution of outcomes from which we extract the 5th percentile (Pessimistic) and 95th percentile (Optimistic) bounds.

## 3. Data Ingestion & Preprocessing
Data is ingested via CSV files originating from multiple ad platforms.
1.  **Standardization:** Columns are mapped to standard schemas (`date`, `channel`, `campaign_name`, `spend`, `revenue`, `impressions`, `clicks`, `conversions`).
2.  **Imputation:** Missing metrics (e.g., Meta Ads lacking direct revenue) are derived using assumed or historical Average Order Value (AOV).
3.  **Aggregation:** Data is grouped by date to provide an aggregate view of total business performance.

## 4. LLM Causal Inference Layer
A standard challenge with quantitative forecasting is the lack of "why." We integrate Groq's high-speed inference (Llama-3) to bridge this gap.
*   **Natural Language Scenario Parsing:** The LLM translates user questions (e.g., "What if Google spend drops 10%?") into structured JSON parameters for the ML engine.
*   **Impact Explanation:** After the ML model computes the delta between the baseline and the adjusted scenario, the numerical results are fed back to the LLM. The LLM generates a natural-language executive summary explaining the causal impact of the budget shift, highlighting risks like diminishing returns or channel saturation.

## 5. Assumptions & Limitations
*   **Diminishing Returns:** The current model assumes a simplified diminishing returns factor when budgets increase rapidly.
*   **Attribution:** The system currently relies on platform-reported conversions and does not yet implement a multi-touch attribution (MTA) model.
