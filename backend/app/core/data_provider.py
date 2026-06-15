"""ForecastPilot AI — Data Provider"""
import pandas as pd
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.models import Campaign

async def get_historical_df(db: AsyncSession) -> pd.DataFrame:
    result = await db.execute(select(Campaign).order_by(Campaign.date))
    campaigns = result.scalars().all()
    if not campaigns:
        return pd.DataFrame()
    
    data = []
    for c in campaigns:
        data.append({
            "date": c.date,
            "channel": c.channel,
            "spend": c.spend,
            "revenue": c.revenue,
            "conversions": c.conversions,
            "clicks": c.clicks,
            "impressions": c.impressions
        })
    return pd.DataFrame(data)
