"""ForecastPilot AI — Seed Demo Data"""


async def seed_demo_data():
    """Seed demo data on startup. Uses in-memory stores for the demo."""
    # Demo data is handled in-memory by each domain router
    # In production, this would insert into PostgreSQL
    print("[ForecastPilot AI] Demo data initialized successfully.")
