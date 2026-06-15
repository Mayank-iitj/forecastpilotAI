# ForecastPilot AI - Demo Workflow

This document outlines the presentation flow for demonstrating the prototype.

## 1. Data Ingestion
**Goal:** Show how fragmented marketing data is unified.
*   **Action:** Open the Datasets tab.
*   **Talking Point:** "Agencies struggle with siloed data. We ingest CSVs from Google Ads, Meta Ads, and MS Ads directly into our system, validating them for consistency and merging them into a unified schema."
*   **Visual:** Show the `hackathon_campaign_stats.csv` being processed.

## 2. Forecast Generation
**Goal:** Demonstrate probabilistic forecasting on aggregate metrics.
*   **Action:** Navigate to the Forecasts Dashboard. Select the 30-day, then 60-day window.
*   **Talking Point:** "Most forecasts just optimize for traffic. We optimize for Blended ROAS and Aggregate Revenue across Google, Meta, and MS Ads. Here is the 60-day forecast."
*   **Visual:** Point out the chart showing Expected (Solid Blue), Optimistic (Green dashed), and Pessimistic (Red dash) ranges. Explain that this isn't a simple straight line, but a 95% Confidence Interval generated via Monte Carlo simulation.

## 3. Budget Simulation (What-If Scenario)
**Goal:** Show interactive, forward-looking decision support.
*   **Action:** Open the What-If Simulator.
*   **Talking Point:** "Forecasts rarely explain *why* or what to do next. We allow marketers to simulate budget shifts."
*   **Visual:** Adjust the budget slider for Meta Ads up by 20% and Google Ads down by 10%. Show the charts instantly updating the predicted Blended ROAS and Aggregate Revenue.

## 4. AI-Generated Business Insights
**Goal:** Highlight the AI Causal Inference Layer.
*   **Action:** View the "AI Explanation" generated after running the simulation.
*   **Talking Point:** "Instead of just giving you numbers, our AI layer (powered by Groq/Llama-3) interprets the result and provides a causal summary, identifying operational risks."
*   **Visual:** Read the AI summary explaining *why* the Blended ROAS shifted based on the specific channel efficiencies.
