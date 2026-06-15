import os
import pandas as pd
from datetime import datetime
from sqlalchemy import select
from app.core.database import async_session
from app.core.models import Project, Organization, User, Dataset, Campaign, Channel

CHANNELS = [
    {"name": "google_ads", "display_name": "Google Ads", "color": "#4285F4"},
    {"name": "meta_ads", "display_name": "Meta Ads", "color": "#1877F2"},
    {"name": "microsoft_ads", "display_name": "Microsoft Ads", "color": "#00A4EF"},
]

def load_and_standardize_datasets():
    print("[ForecastPilot AI] Loading raw datasets...")
    demo_dir = "demo_datasets"
    
    # 1. Meta Ads
    meta_path = os.path.join(demo_dir, "meta_ads_campaign_stats.csv")
    meta_std = pd.DataFrame()
    if os.path.exists(meta_path):
        meta_df = pd.read_csv(meta_path)
        meta_std = pd.DataFrame({
            "date": meta_df["date_start"],
            "channel": "meta_ads",
            "campaign_name": meta_df["campaign_name"],
            "spend": meta_df["spend"],
            "revenue": meta_df["conversion"] * 85.0,  # Mocking AOV of $85
            "impressions": meta_df["impressions"],
            "clicks": meta_df["clicks"],
            "conversions": meta_df["conversion"]
        })

    # 2. Google Ads
    google_path = os.path.join(demo_dir, "google_ads_campaign_stats.csv")
    google_std = pd.DataFrame()
    if os.path.exists(google_path):
        google_df = pd.read_csv(google_path)
        google_std = pd.DataFrame({
            "date": google_df["segments_date"],
            "channel": "google_ads",
            "campaign_name": google_df["campaign_name"],
            "spend": google_df["metrics_cost_micros"] / 1000000.0,
            "revenue": google_df["metrics_conversions_value"],
            "impressions": google_df["metrics_impressions"],
            "clicks": google_df["metrics_clicks"],
            "conversions": google_df["metrics_conversions"]
        })

    # 3. Bing Ads (MS Ads)
    bing_path = os.path.join(demo_dir, "bing_campaign_stats.csv")
    bing_std = pd.DataFrame()
    if os.path.exists(bing_path):
        bing_df = pd.read_csv(bing_path)
        bing_std = pd.DataFrame({
            "date": bing_df["TimePeriod"],
            "channel": "microsoft_ads",
            "campaign_name": bing_df["CampaignName"],
            "spend": bing_df["Spend"],
            "revenue": bing_df["Revenue"],
            "impressions": bing_df["Impressions"],
            "clicks": bing_df["Clicks"],
            "conversions": bing_df["Conversions"]
        })

    combined_df = pd.concat([meta_std, google_std, bing_std], ignore_index=True)
    combined_df.fillna(0, inplace=True)
    combined_df.sort_values(by="date", inplace=True)
    return combined_df

async def seed_demo_data():
    """Seed demo data on startup."""
    async with async_session() as session:
        # Check if data already seeded
        result = await session.execute(select(Dataset))
        if result.scalars().first() is not None:
            print("[ForecastPilot AI] DB already seeded.")
            return

        print("[ForecastPilot AI] Seeding demo data from the 3 source datasets...")
        
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

        # 3. Create dataset record
        dataset = Dataset(project_id=project.id, filename="combined_hackathon_data", file_path="internal", status="ready")
        session.add(dataset)
        await session.flush()

        # 4. Load CSV and generate Campaigns
        df = load_and_standardize_datasets()
        if df.empty:
            print("[ForecastPilot AI] Error: No datasets found in demo_datasets/.")
            return

        campaigns = []
        for _, row in df.iterrows():
            spend = float(row["spend"])
            revenue = float(row["revenue"])
            clicks = int(row["clicks"])
            impressions = int(row["impressions"])
            conversions = int(row["conversions"])
            
            try:
                dt = datetime.strptime(str(row["date"]), "%Y-%m-%d").date()
            except ValueError:
                continue # Skip invalid dates
                
            camp = Campaign(
                dataset_id=dataset.id,
                name=row["campaign_name"],
                channel=row["channel"],
                date=dt,
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
        print(f"[ForecastPilot AI] Successfully seeded {len(campaigns)} campaign records.")
