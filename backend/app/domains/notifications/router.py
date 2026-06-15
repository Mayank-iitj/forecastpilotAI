"""Notifications Domain — Router"""
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from typing import List
from app.core.security import get_current_user

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # We don't really expect much incoming data, just keep connection alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@router.get("/")
async def list_notifications(user: dict = Depends(get_current_user)):
    return [
        {"id": "notif-001", "type": "forecast_complete", "title": "Forecast Complete", "message": "Q3 Revenue Forecast has completed with 87.3% confidence.", "is_read": False, "created_at": "2025-01-15T10:30:00Z", "icon": "chart-line"},
        {"id": "notif-002", "type": "anomaly", "title": "Anomaly Detected", "message": "Unusual revenue spike detected in Google Ads — +42% above expected.", "is_read": False, "created_at": "2025-01-15T09:15:00Z", "icon": "alert-triangle"},
        {"id": "notif-003", "type": "risk_alert", "title": "Risk Alert", "message": "Meta Ads ROAS has dropped below 3.0x threshold for 3 consecutive days.", "is_read": True, "created_at": "2025-01-14T16:00:00Z", "icon": "shield-alert"},
        {"id": "notif-004", "type": "budget_opportunity", "title": "Budget Opportunity", "message": "Email channel shows potential for 3x budget increase with maintained ROAS.", "is_read": True, "created_at": "2025-01-14T12:00:00Z", "icon": "trending-up"},
        {"id": "notif-005", "type": "forecast_complete", "title": "Weekly Forecast Updated", "message": "Automated weekly forecast refresh completed. Revenue projection: +3.2%.", "is_read": True, "created_at": "2025-01-13T06:00:00Z", "icon": "refresh-cw"},
    ]


@router.put("/{notification_id}/read")
async def mark_read(notification_id: str, user: dict = Depends(get_current_user)):
    return {"id": notification_id, "is_read": True}


@router.put("/read-all")
async def mark_all_read(user: dict = Depends(get_current_user)):
    return {"message": "All notifications marked as read"}
