import uuid as uuid_lib
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from app.models.base import BaseModel
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.user import User


class SessionType(str, Enum):
    POMODORO = "pomodoro"
    DEEP_WORK = "deep_work"
    BREAK = "break"
    CUSTOM = "custom"


class FocusSessionBase(SQLModel):
    """FocusSession 기본 스키마"""

    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = Field(default=None)
    duration_minutes: int = Field(ge=0, default=25)
    session_type: SessionType = Field(default=SessionType.POMODORO)
    productivity_rating: Optional[int] = Field(default=None, ge=1, le=5)
    notes: Optional[str] = Field(default=None, max_length=500)


class FocusSession(FocusSessionBase, BaseModel, table=True):
    """FocusSession 데이터베이스 모델"""

    __tablename__ = "focus_sessions"

    user_id: uuid_lib.UUID = Field(foreign_key="users.id", index=True)

    # Relationship
    user: Optional["User"] = Relationship(back_populates="focus_sessions")


class FocusSessionCreate(FocusSessionBase):
    """FocusSession 생성 스키마"""

    pass


class FocusSessionRead(FocusSessionBase):
    """FocusSession 읽기 스키마"""

    id: str
    user_id: str
    created_at: datetime


class FocusSessionUpdate(SQLModel):
    """FocusSession 업데이트 스키마"""

    end_time: Optional[datetime] = None
    productivity_rating: Optional[int] = Field(default=None, ge=1, le=5)
    notes: Optional[str] = None
