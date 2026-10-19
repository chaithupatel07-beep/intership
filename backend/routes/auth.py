"""
Authentication and Farmer User Management Routes for AgriAI.
Handles multi-user registration, secure login, profile switching,
and demo farmer accounts.
"""

import time
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr

from database import (
    authenticate_user,
    create_user,
    get_all_users,
    get_user_by_email,
    get_user_by_id,
    update_user_profile,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication & User Management"])


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = ""
    role: Optional[str] = "Farmer"
    state: Optional[str] = "Telangana"
    district: Optional[str] = "Hyderabad"
    acres: Optional[float] = 4.5
    soil_type: Optional[str] = "Clay Loam"
    primary_crops: Optional[str] = "Rice (Paddy), Maize"
    water_source: Optional[str] = "Borewell + Rainfed"
    avatar_url: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    acres: Optional[float] = None
    soil_type: Optional[str] = None
    primary_crops: Optional[str] = None
    water_source: Optional[str] = None


@router.post("/signup")
async def signup(req: SignupRequest):
    """Registers a new farmer or agricultural user."""
    email_clean = req.email.strip().lower()
    if not email_clean or not req.name.strip():
        raise HTTPException(status_code=400, detail="Name and Email are required.")

    if len(req.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters.")

    existing = get_user_by_email(email_clean)
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists. Please log in.")

    user = create_user(req.dict())
    token = f"token_{user['id']}_{int(time.time())}"

    return {
        "status": "success",
        "message": f"Welcome to AgriAI, {user['name']}! Your farmer account has been created.",
        "user": user,
        "token": token,
    }


@router.post("/login")
async def login(req: LoginRequest):
    """Authenticates existing farmer credentials."""
    user = authenticate_user(req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = f"token_{user['id']}_{int(time.time())}"
    return {
        "status": "success",
        "user": user,
        "token": token,
    }


@router.get("/demo-users")
async def list_demo_users():
    """
    Returns pre-configured demo farmer accounts across multiple states and crops
    for seamless 1-click test authentication.
    """
    users = get_all_users()
    return {
        "demo_users": users,
        "default_password": "farmer123",
    }


@router.get("/me")
async def get_current_user(user_id: Optional[str] = None, authorization: Optional[str] = Header(None)):
    """Retrieves current farmer user details."""
    uid = user_id
    if not uid and authorization:
        # Extract user ID from token format token_<user_id>_<timestamp>
        token_str = authorization.replace("Bearer ", "").strip()
        parts = token_str.split("_")
        if len(parts) >= 2 and parts[0] == "token":
            uid = f"usr_{parts[1]}" if not parts[1].startswith("usr") else parts[1]

    if not uid:
        uid = "usr_ramesh"

    user = get_user_by_id(uid)
    if not user:
        # Fallback to first user
        all_u = get_all_users()
        user = all_u[0] if all_u else None

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    return {"user": user}


@router.put("/profile")
async def update_profile(req: ProfileUpdateRequest, user_id: str):
    """Updates farmer profile and farm specifications."""
    updates = {k: v for k, v in req.dict().items() if v is not None}
    updated_user = update_user_profile(user_id, updates)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"status": "success", "user": updated_user}
