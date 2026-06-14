"""Reports Domain — Router"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from app.core.security import get_current_user
from app.ml.llm_service import generate_report_content
import uuid
from datetime import datetime, timezone

router = APIRouter()

# In-memory store for reports
REPORTS_DB = [
    {
        "id": "rpt-001",
        "title": "Q3 Executive Summary",
        "type": "executive",
        "status": "Generated",
        "pages": 8,
        "content": {
            "summary": "Strong Q3 performance with 8.2% revenue growth driven by Google Shopping optimization.",
            "key_metrics": {"revenue": 459000, "roas": 5.1, "spend": 90000, "conversions": 5400},
        },
        "created_at": "2025-01-15T10:30:00Z",
    }
]

@router.get("/")
async def list_reports(user: dict = Depends(get_current_user)):
    # Return brief info for listing
    return [
        {
            "id": r["id"],
            "title": r["title"],
            "type": r["type"],
            "status": r["status"],
            "pages": r["pages"],
            "created_at": r["created_at"]
        } for r in REPORTS_DB
    ]

@router.get("/{report_id}")
async def get_report(report_id: str, user: dict = Depends(get_current_user)):
    report = next((r for r in REPORTS_DB if r["id"] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.post("/")
async def generate_report(payload: dict, user: dict = Depends(get_current_user)):
    report_type = payload.get("type", "Executive Summary")
    report_id = f"rpt-{uuid.uuid4().hex[:6]}"
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    # Generate content using Groq AI
    generated_summary = generate_report_content(report_type)
    
    new_report = {
        "id": report_id,
        "title": f"AI Generated {report_type}",
        "type": report_type,
        "status": "Generated",
        "pages": 5,
        "content": {
            "summary": generated_summary,
            "key_metrics": {"revenue": 150000, "roas": 4.2, "spend": 35000, "conversions": 1200},
        },
        "created_at": now_iso,
    }
    # Insert at beginning
    REPORTS_DB.insert(0, new_report)
    return new_report

@router.get("/{report_id}/download")
async def download_report(report_id: str, user: dict = Depends(get_current_user)):
    report = next((r for r in REPORTS_DB if r["id"] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Generate CSV content
    metrics = report.get("content", {}).get("key_metrics", {})
    csv_content = f"Metric,Value\n"
    for k, v in metrics.items():
        csv_content += f"{k},{v}\n"
        
    csv_content += f"\nSummary,\"{report.get('content', {}).get('summary', '')}\"\n"
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="report_{report_id}.csv"'}
    )
