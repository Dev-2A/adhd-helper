import uuid as uuid_lib
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from app.models.base import BaseModel
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.user import User


class EmotionType(str, Enum):
    HAPPY = "happy"
    SAD = "sad"
    ANXIOUS = "anxious"
    CALM = "calm"
    EXCITED = "excited"
    ANGRY = "angry"
    NEUTRAL = "neutral"


class EmotionRecordBase(SQLModel):
    """EmotionRecord 기본 스키마"""

    emotion_level: int = Field(ge=1, le=5)  # 1-5 scale
    emotion_type: EmotionType
    note: Optional[str] = Field(default=None, max_length=500)
    recorded_at: datetime = Field(default_factory=datetime.utcnow)


class EmotionRecord(EmotionRecordBase, BaseModel, table=True):
    """EmotionRecord 데이터베이스 모델"""

    __tablename__ = "emotion_records"

    user_id: uuid_lib.UUID = Field(foreign_key="users.id", index=True)
    ai_analysis: Optional[str] = Field(default=None, max_length=1000)  # JSON string

    # Relationship
    user: Optional["User"] = Relationship(back_populates="emotion_records")


class EmotionRecordCreate(EmotionRecordBase):
    """EmotionRecord 생성 스키마"""

    pass


class EmotionRecordRead(EmotionRecordBase):
    """EmotionRecord 읽기 스키마"""

    id: str
    user_id: str
    ai_analysis: Optional[str]
    created_at: datetime


class EmotionRecordUpdate(SQLModel):
    """EmotionRecord 업데이트 스키마"""

    emotion_level: Optional[int] = Field(default=None, ge=1, le=5)
    emotion_type: Optional[EmotionType] = None
    note: Optional[str] = None
