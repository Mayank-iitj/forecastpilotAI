import math
import random
from datetime import datetime, timedelta
from sqlalchemy import select
from app.core.database import async_session
from app.core.models import Project, Organization, User, Dataset, Campaign, Channel

CHANNELS = [
    {"name": "google_ads", "display_name": "Google Ads", "color": "#4285F4", "base_spend": 300, "base_roas": 4.2},
    {"name": "meta_ads", "display_name": "Meta Ads", "color": "#1877F2", "base_spend": 280, "base_roas": 3.8},
    {"name": "microsoft_ads", "display_name": "Microsoft Ads", "color": "#00A4EF", "base_spend": 100, "base_roas": 3.5},
    {"name": "organic_search", "display_name": "Organic Search", "color": "#34A853", "base_spend": 0, "base_roas": 0},
    {"name": "affiliate", "display_name": "Affiliate", "color": "#FF6D01", "base_spend": 50, "base_roas": 5.1},
    {"name": "email", "display_name": "Email", "color": "#9333EA", "base_spend": 10, "base_roas": 42.0},
    {"name": "display", "display_name": "Display", "color": "#F59E0B", "base_spend": 80, "base_roas": 2.1},
]

async def seed_demo_data():
    """Seed demo data on startup. Populates DB with 365 days of historical data."""
    async with async_session() as session:
        # Check if data already seeded
        result = await session.execute(select(Dataset))
        if result.scalars().first() is not None:
            print("[ForecastPilot AI] DB already seeded.")
            return

        print("[ForecastPilot AI] Seeding demo data...")
        
        # 1. Create org, user, project
        org = Organization(name="Demo Org", slug="demo-org")
        session.add(org)
        await session.flush()

        user = User(email="admin@forecastpilot.ai", name="Admin User", password_hash="dummy", org_id=org.id)
        session.add(user)
        await session.flush()

        project = Project(name="Demo Project", org_id=org.id, owner_id=user.id)
        session.add(project)
        await session.flush()

        # 2. Create channels
        for ch_data in CHANNELS:
            ch = Channel(name=ch_data["name"], display_name=ch_data["display_name"], color=ch_data["color"])
            session.add(ch)

        # 3. Create dataset
        dataset = Dataset(project_id=project.id, filename="historical_data.csv", file_path="internal", status="ready")
        session.add(dataset)
        await session.flush()

        # 4. Generate 365 days of campaigns
        start_date = datetime.now() - timedelta(days=365)
        
        campaigns = []
        for day in range(365):
            current_date = start_date + timedelta(days=day)
            
            # Global seasonality (weekend drop, summer bump, holiday spike)
            day_of_week = current_date.weekday()
            weekend_multiplier = 0.8 if day_of_week >= 5 else 1.0
            
            # Simple yearly seasonality
            day_of_year = current_date.timetuple().tm_yday
            season_multiplier = 1.0 + 0.2 * math.sin(2 * math.pi * day_of_year / 365)
            
            # Holiday spike near day 330 (Black Friday approx)
            if 320 <= day_of_year <= 340:
                season_multiplier *= 1.5
                
            for ch_data in CHANNELS:
                base_spend = ch_data["base_spend"]
                base_roas = ch_data["base_roas"]
                
                # Introduce some random noise
                noise = random.uniform(0.85, 1.15)
                
                if base_spend > 0:
                    spend = base_spend * weekend_multiplier * season_multiplier * noise
                    # Diminishing returns noise
                    eff_roas = base_roas * random.uniform(0.9, 1.1)
                    revenue = spend * eff_roas
                else:
                    spend = 0
                    if ch_data["name"] == "organic_search":
                        # Organic revenue
                        revenue = 800 * weekend_multiplier * season_multiplier * noise
                    else:
                        revenue = 0
                        
                clicks = int(spend / random.uniform(0.5, 2.0)) if spend > 0 else int(revenue / 5)
                impressions = clicks * int(random.uniform(20, 100))
                conversions = int(revenue / 85.0) # approx 85 AOV
                
                camp = Campaign(
                    dataset_id=dataset.id,
                    name=f"{ch_data['display_name']} - General",
                    channel=ch_data["name"],
                    date=current_date,
                    spend=round(spend, 2),
                    revenue=round(revenue, 2),
                    conversions=conversions,
                    clicks=clicks,
                    impressions=impressions,
                    cpc=round(spend/max(1, clicks), 2),
                    ctr=round(clicks/max(1, impressions), 4),
                    roas=round(revenue/max(1, spend), 2) if spend > 0 else 0.0,
                    aov=round(revenue/max(1, conversions), 2) if conversions > 0 else 0.0
                )
                campaigns.append(camp)

        session.add_all(campaigns)
        await session.commit()
        print("[ForecastPilot AI] Demo data seeded successfully.")
