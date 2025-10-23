"""
집중 세션 스키마 (요청/응답)
"""
from pydantic import BaseModel, Field
from datetime import datetime
import uuid


class FocusSessionCreate(BaseModel):
    """집중 세션 시작 스키마"""
    session_type: str = Field(default="pomodoro")
    planned_duration: int = Field(default=25, ge=1, description="계획된 시간 (분)")


class FocusSessionUpdate(BaseModel):
    """집중 세션 종료 스키마"""
    end_time: datetime
    productivity_rating: int | None = Field(None, ge=1, le=5)
    notes: str | None = None


class FocusSessionResponse(BaseModel):
    """집중 세션 응답 스키마"""
    id: uuid.UUID
    user_id: uuid.UUID
    start_time: datetime
    end_time: datetime | None
    duration_minutes: int
    session_type: str
    productivity_rating: int | None
    notes: str | None
    
    class Config:
        from_attributes = True