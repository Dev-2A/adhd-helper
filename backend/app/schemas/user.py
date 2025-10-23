"""
사용자 스키마 (요청/응답)
"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone
import uuid


class UserCreate(BaseModel):
    """사용자 생성 스키마"""
    email: EmailStr
    name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=100)
    timezone: str = Field(default="Asia/Seoul")


class UserUpdate(BaseModel):
    """사용자 수정 스키마"""
    name: str | None = Field(None, min_length=1, max_length=100)
    timezone: str | None = None
    settings: dict | None = None


class UserResponse(BaseModel):
    """사용자 응답 스키마"""
    id: uuid.UUID
    email: str
    name: str
    timezone: str
    settings: dict
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True