from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from app.models.base import BaseModel
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.emotion import EmotionRecord
    from app.models.feedback import AIFeedback
    from app.models.focus import FocusSession
    from app.models.todo import TodoItem


class UserBase(SQLModel):
    """User 기본 스키마"""

    email: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=100)
    timezone: str = Field(default="Asia/Seoul", max_length=50)
    is_active: bool = Field(default=True)


class User(UserBase, BaseModel, table=True):
    """User 데이터베이스 모델"""

    __tablename__ = "users"

    hashed_password: str = Field(max_length=255)
    settings: Optional[str] = Field(default="{}", max_length=1000)  # JSON string

    # Relationships
    emotion_records: List["EmotionRecord"] = Relationship(back_populates="user")
    focus_sessions: List["FocusSession"] = Relationship(back_populates="user")
    todo_items: List["TodoItem"] = Relationship(back_populates="user")
    ai_feedbacks: List["AIFeedback"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    """User 생성 스키마"""

    password: str = Field(min_length=8)


class UserRead(UserBase):
    """User 읽기 스키마"""

    id: str
    created_at: datetime


class UserUpdate(SQLModel):
    """User 업데이트 스키마"""

    name: Optional[str] = None
    timezone: Optional[str] = None
    password: Optional[str] = Field(default=None, min_length=8)
