import sys
import asyncio
sys.path.append('.')
from app.core.database import async_session
from app.core.data_provider import get_historical_df
from app.ml.forecast_engine import generate_forecast
from app.ml.monte_carlo import run_monte_carlo_simulation

async def main():
    async with async_session() as db:
        df = await get_historical_df(db)
        print('df len:', len(df))
        
        try:
            f = generate_forecast(df)
            print('forecast keys:', f.keys())
        except Exception as e:
            print('forecast failed:', e)
            
        try:
            m = run_monte_carlo_simulation(df)
            print('monte keys:', m.keys())
        except Exception as e:
            print('monte failed:', e)

asyncio.run(main())
