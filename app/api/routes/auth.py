from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.core.auth import (
    Token, UserCreate, User, authenticate_user, create_access_token, 
    get_current_active_user, register_user
)
from app.core.config import settings

router = APIRouter()

@router.post("/register", response_model=User)
async def register(user_data: UserCreate):
    """Register a new user"""
    return await register_user(user_data)

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Get access token for authentication"""
    user = await authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current authenticated user"""
    return current_user

@router.post("/logout")
async def logout():
    """Logout current user (client-side only for JWT)"""
    return {"message": "Successfully logged out"}