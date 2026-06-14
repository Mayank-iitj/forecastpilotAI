"""Auth Domain — Router"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from app.core.security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "analyst"


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# In-memory user store for demo
_demo_users = {
    "demo@forecastpilot.ai": {
        "id": "demo-user-001",
        "email": "demo@forecastpilot.ai",
        "name": "Alex Morgan",
        "role": "admin",
        "org_id": "org-001",
        "password_hash": hash_password("demo1234"),
        "avatar_url": None,
    }
}


@router.post("/register", response_model=AuthResponse)
async def register(req: RegisterRequest):
    if req.email in _demo_users:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = {
        "id": f"user-{len(_demo_users)+1:03d}",
        "email": req.email,
        "name": req.name,
        "role": req.role,
        "org_id": "org-001",
        "password_hash": hash_password(req.password),
        "avatar_url": None,
    }
    _demo_users[req.email] = user

    token = create_access_token({"sub": user["id"], "email": user["email"], "role": user["role"]})
    return AuthResponse(
        access_token=token,
        user={"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]},
    )


@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    user = _demo_users.get(req.email)
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user["id"], "email": user["email"], "role": user["role"]})
    return AuthResponse(
        access_token=token,
        user={"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]},
    )


@router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    return user


@router.post("/forgot-password")
async def forgot_password(email: str):
    return {"message": "If this email exists, a reset link has been sent."}
