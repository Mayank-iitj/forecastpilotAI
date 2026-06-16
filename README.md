<div align="center">

![ForecastPilot AI](https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NextJS-Dark.svg)

# 🚀 ForecastPilot AI
**The Next-Generation Marketing Intelligence & Predictive Analytics Platform**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)]()
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)]()
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)]()
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)]()

ForecastPilot AI empowers modern growth teams to move beyond static spreadsheets. By combining cutting-edge Machine Learning, Monte Carlo simulations, and Generative AI (LLMs), ForecastPilot transforms your raw marketing data into highly accurate, actionable revenue and ROAS forecasts.

[Features](#-key-features) • [Architecture](#%EF%B8%8F-architecture) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## ✨ Key Features

### 📊 Executive Dashboard
A beautiful, glassmorphic command center providing an instant pulse on your marketing health. Monitor Actuals vs. Forecasts, Track overall ROAS, and view dynamic KPI cards.

### 🎲 Monte Carlo Simulation Engine
Quantify uncertainty and risk mathematically. Using Geometric Brownian Motion on your historical dataset, ForecastPilot generates 10,000+ probabilistic pathways to calculate exact revenue risk percentiles (P10, P50, P90) and ROAS confidence intervals.

### 🤖 AI CFO (Natural Language "What-If")
Chat with your data. Powered by Groq and Llama 3, the AI CFO translates natural language questions (e.g., *"What if I increase my Meta Ads budget by 20% next month?"*) into concrete ML budget parameters, automatically regenerating adjusted forecasts and explaining the financial impact.

### ⚡ Smart Budget Optimizer
Maximize returns using bounded optimization algorithms. Allocate your marketing spend across Meta, Google, and Microsoft Ads automatically to hit target revenue metrics.

### 📁 Automated Dataset Pipeline
Seamlessly ingest CSV files with automatic schema validation, datatype coercion, and anomaly detection.

---

## 🛠️ Architecture

ForecastPilot AI uses a decoupled, modern architecture optimized for high-performance machine learning and beautiful user experiences.

**Frontend:**
* **Framework:** Next.js 15 (App Router) + React 19
* **Styling:** Tailwind CSS + Vanilla CSS (Glassmorphism & Dynamic Gradients)
* **Animations:** Framer Motion
* **Charts:** Recharts
* **State & Fetching:** Axios / native Fetch API

**Backend:**
* **API Framework:** FastAPI (Python 3.10+)
* **Database:** SQLite (aiosqlite) + SQLAlchemy (Async ORM)
* **Data Science:** Pandas, NumPy
* **LLM Integration:** Groq API (Llama-3.3-70b-versatile)

---

## 🚀 Getting Started

Follow these steps to get a local instance of ForecastPilot AI up and running.

### Prerequisites
* Node.js 18+ and npm/yarn
* Python 3.10+
* A [Groq API Key](https://console.groq.com/)

### 1. Clone & Setup Backend
```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Start the FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*The backend will automatically initialize the database and seed it with realistic 30-day marketing data.*

### 2. Setup Frontend
```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

### 3. Launch
Open your browser and navigate to **`http://localhost:3000`** to access the ForecastPilot AI dashboard.

---

## 📖 Project Structure

```text
forecastpilot-ai/
├── backend/
│   ├── app/
│   │   ├── core/         # Config, DB, Security
│   │   ├── domains/      # FastAPI Routers (Datasets, Scenarios, Auth)
│   │   └── ml/           # LLM services, Monte Carlo, ML Forecasts
│   ├── data/             # Uploaded datasets
│   └── main.py           # FastAPI Application Entrypoint
│
└── frontend/
    ├── src/
    │   ├── app/          # Next.js App Router Pages
    │   ├── components/   # Reusable UI elements (Framer Motion)
    │   └── lib/          # API clients and utilities
    └── public/           # Static assets
```

---

## 🛡️ Security & Performance

- **Strict CORS & Preflight**: Fully secured REST endpoints utilizing strict origin verification.
- **Client-Side Failsafes**: Resilient React components featuring automatic fetch timeouts and graceful error boundaries to prevent UI freezes during heavy simulations.
- **Asynchronous Processing**: FastAPI's async core prevents I/O blocking during heavy SQLite aggregations.

---

<div align="center">
  <p>Built with ❤️ by the AI Engineering Team</p>
  <p>&copy; 2026 ForecastPilot AI. All rights reserved.</p>
</div>
