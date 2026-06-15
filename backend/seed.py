import asyncio
from app.core.database import init_db
from app.seed.seed_data import seed_demo_data

async def main():
    await init_db()
    await seed_demo_data()

if __name__ == "__main__":
    asyncio.run(main())
