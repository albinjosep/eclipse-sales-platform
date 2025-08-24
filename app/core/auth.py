from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.core.config import settings
from app.core.database import supabase

# Token model
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

# User models
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

# Password functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Token functions
def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        
        if email is None or user_id is None:
            raise credentials_exception
            
        token_data = TokenData(email=email, user_id=user_id)
    except JWTError:
        raise credentials_exception
    
    # Verify user exists in Supabase
    try:
        user_response = await supabase.table("users").select("*").eq("id", user_id).execute()
        user = user_response.data[0] if user_response.data else None
        
        if user is None:
            raise credentials_exception
            
        return User(
            id=user["id"],
            email=user["email"],
            full_name=user.get("full_name"),
            is_active=user.get("is_active", True),
            created_at=user["created_at"]
        )
    except Exception:
        raise credentials_exception

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Supabase auth functions
async def register_user(user_data: UserCreate):
    # Check if user already exists
    existing_user = await supabase.table("users").select("*").eq("email", user_data.email).execute()
    
    if existing_user.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user in Supabase Auth
    try:
        auth_response = await supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password
        })
        
        if auth_response.error:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=auth_response.error.message
            )
        
        # Create user in users table
        user_id = auth_response.user.id
        
        user_record = {
            "id": user_id,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "created_at": datetime.utcnow().isoformat(),
            "is_active": True
        }
        
        await supabase.table("users").insert(user_record).execute()
        
        return User(**user_record)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register user: {str(e)}"
        )

async def authenticate_user(email: str, password: str):
    try:
        # Sign in with Supabase Auth
        auth_response = await supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if auth_response.error:
            return None
        
        # Get user from users table
        user_id = auth_response.user.id
        user_response = await supabase.table("users").select("*").eq("id", user_id).execute()
        
        if not user_response.data:
            return None
            
        user = user_response.data[0]
        
        return User(
            id=user["id"],
            email=user["email"],
            full_name=user.get("full_name"),
            is_active=user.get("is_active", True),
            created_at=user["created_at"]
        )
    
    except Exception:
        return None