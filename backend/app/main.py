"""ForecastPilot AI — FastAPI Main Application"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    # Seed demo data on startup
    from app.seed.seed_data import seed_demo_data
    await seed_demo_data()
    # Load CSV datasets into memory
    from app.domains.datasets.router import load_demo_datasets
    load_demo_datasets()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register routers
from app.domains.auth.router import router as auth_router
from app.domains.datasets.router import router as datasets_router
from app.domains.forecasts.router import router as forecasts_router
from app.domains.scenarios.router import router as scenarios_router
from app.domains.ai.router import router as ai_router
from app.domains.reports.router import router as reports_router
from app.domains.analytics.router import router as analytics_router
from app.domains.admin.router import router as admin_router
from app.domains.notifications.router import router as notifications_router

app.include_router(auth_router, prefix=f"{settings.API_PREFIX}/auth", tags=["Authentication"])
app.include_router(datasets_router, prefix=f"{settings.API_PREFIX}/datasets", tags=["Datasets"])
app.include_router(forecasts_router, prefix=f"{settings.API_PREFIX}/forecasts", tags=["Forecasts"])
app.include_router(scenarios_router, prefix=f"{settings.API_PREFIX}/scenarios", tags=["Scenarios"])
app.include_router(ai_router, prefix=f"{settings.API_PREFIX}/ai", tags=["AI"])
app.include_router(reports_router, prefix=f"{settings.API_PREFIX}/reports", tags=["Reports"])
app.include_router(analytics_router, prefix=f"{settings.API_PREFIX}/analytics", tags=["Analytics"])
app.include_router(admin_router, prefix=f"{settings.API_PREFIX}/admin", tags=["Admin"])
app.include_router(notifications_router, prefix=f"{settings.API_PREFIX}/notifications", tags=["Notifications"])


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs": f"{settings.API_PREFIX}/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
