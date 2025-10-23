"""
사용자 모델
"""
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import JSON
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING, Any
import uuid

if TYPE_CHECKING:
    from app.models.emotion import EmotionRecord
    from app.models.focus_session import FocusSession
    from app.models.todo import TodoItem
    from app.models.ai_feedback import AIFeedback


class UserBase(SQLModel):
    """사용자 기본 정보"""
    email: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=100)
    timezone: str = Field(default="Asia/Seoul", max_length=50)


class User(UserBase, table=True):
    """사용자 테이블 모델"""
    __tablename__ = "users"
    
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    hashed_password: str = Field(max_length=255)
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    settings: Any = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    emotion_records: List["EmotionRecord"] = Relationship(back_populates="user")
    focus_sessions: List["FocusSession"] = Relationship(back_populates="user")
    todo_items: List["TodoItem"] = Relationship(back_populates="user")
    ai_feedbacks: List["AIFeedback"] = Relationship(back_populates="user")