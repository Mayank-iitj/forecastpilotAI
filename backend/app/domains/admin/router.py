"""Admin Domain — Router"""
from fastapi import APIRouter, Depends
from app.core.security import get_current_user, require_role

router = APIRouter()


@router.get("/users")
async def list_users(user: dict = Depends(require_role(["admin"]))):
    return [
        {"id": "user-001", "name": "Alex Morgan", "email": "alex@forecastpilot.ai", "role": "admin", "status": "active", "last_active": "2025-01-15T10:30:00Z"},
        {"id": "user-002", "name": "Sarah Chen", "email": "sarah@forecastpilot.ai", "role": "manager", "status": "active", "last_active": "2025-01-15T09:45:00Z"},
        {"id": "user-003", "name": "James Wilson", "email": "james@forecastpilot.ai", "role": "analyst", "status": "active", "last_active": "2025-01-14T16:20:00Z"},
        {"id": "user-004", "name": "Emily Davis", "email": "emily@forecastpilot.ai", "role": "viewer", "status": "invited", "last_active": None},
    ]


@router.get("/audit-logs")
async def audit_logs(user: dict = Depends(require_role(["admin"]))):
    return [
        {"id": "log-001", "user": "Alex Morgan", "action": "forecast.generate", "resource": "Q3 Revenue Forecast", "timestamp": "2025-01-15T10:30:00Z", "ip": "192.168.1.100"},
        {"id": "log-002", "user": "Sarah Chen", "action": "dataset.upload", "resource": "marketing_data_jan.csv", "timestamp": "2025-01-15T09:45:00Z", "ip": "192.168.1.101"},
        {"id": "log-003", "user": "James Wilson", "action": "scenario.simulate", "resource": "Aggressive Growth", "timestamp": "2025-01-14T16:20:00Z", "ip": "192.168.1.102"},
        {"id": "log-004", "user": "Alex Morgan", "action": "report.generate", "resource": "Executive Summary", "timestamp": "2025-01-14T14:00:00Z", "ip": "192.168.1.100"},
    ]


@router.get("/workspaces")
async def list_workspaces(user: dict = Depends(require_role(["admin", "manager"]))):
    return [
        {"id": "ws-001", "name": "Acme Corp", "projects": 3, "members": 4, "plan": "growth", "created_at": "2024-06-15"},
        {"id": "ws-002", "name": "TechStart Inc", "projects": 1, "members": 2, "plan": "starter", "created_at": "2024-09-20"},
    ]


@router.get("/api-keys")
async def list_api_keys(user: dict = Depends(require_role(["admin"]))):
    return [
        {"id": "key-001", "name": "Production API", "prefix": "fp_live_****", "created_at": "2024-12-01", "last_used": "2025-01-15T10:30:00Z", "status": "active"},
        {"id": "key-002", "name": "Development API", "prefix": "fp_test_****", "created_at": "2024-11-15", "last_used": "2025-01-10T08:00:00Z", "status": "active"},
    ]
