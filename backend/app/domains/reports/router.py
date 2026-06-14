"""Reports Domain — Router"""
from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter()


@router.get("/")
async def list_reports(user: dict = Depends(get_current_user)):
    return [
        {"id": "rpt-001", "title": "Q3 Executive Summary", "type": "executive", "created_at": "2025-01-15T10:30:00Z", "status": "generated"},
        {"id": "rpt-002", "title": "Client Performance Report — Acme Corp", "type": "client", "created_at": "2025-01-14T14:00:00Z", "status": "generated"},
        {"id": "rpt-003", "title": "Board Presentation — January", "type": "board", "created_at": "2025-01-12T09:00:00Z", "status": "generated"},
        {"id": "rpt-004", "title": "Weekly Forecast Update", "type": "agency", "created_at": "2025-01-10T16:30:00Z", "status": "generated"},
    ]


@router.get("/{report_id}")
async def get_report(report_id: str, user: dict = Depends(get_current_user)):
    return {
        "id": report_id,
        "title": "Q3 Executive Summary",
        "type": "executive",
        "content": {
            "summary": "Strong Q3 performance with 8.2% revenue growth driven by Google Shopping optimization.",
            "key_metrics": {"revenue": 459000, "roas": 5.1, "spend": 90000, "conversions": 5400},
        },
        "created_at": "2025-01-15T10:30:00Z",
    }
