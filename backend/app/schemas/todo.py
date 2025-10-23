"""
Todo 항목 스키마 (요청/응답)
"""
from pydantic import BaseModel, Field
from datetime import datetime
import uuid


class TodoItemCreate(BaseModel):
    """Todo 생성 스키마"""
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    priority: int = Field(default=1, ge=1, le=5)
    due_date: datetime | None = None


class TodoItemUpdate(BaseModel):
    """Todo 수정 스키마"""
    title: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    completed: bool | None = None
    priority: int | None = Field(None, ge=1, le=5)
    due_date: datetime | None = None


class TodoItemResponse(BaseModel):
    """Todo 응답 스키마"""
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: str | None
    completed: bool
    priority: int
    due_date: datetime | None
    created_at: datetime
    completed_at: datetime | None
    
    class Config:
        from_attributes = True