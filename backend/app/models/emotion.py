"""
감정 기록 모델
"""
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import JSON
from datetime import datetime
from typing import Optional, TYPE_CHECKING, Any
import uuid

if TYPE_CHECKING:
    from app.models.user import User


class EmotionRecordBase(SQLModel):
    """감정 기록 기본 정보"""
    emotion_level: int = Field(ge=1, le=5, description="감정 강도 (1-5)")
    emotion_type: str = Field(max_length=50, description="감정 타입")
    note: Optional[str] = Field(None, description="메모")
    recorded_at: datetime = Field(default_factory=datetime.utcnow)


class EmotionRecord(EmotionRecordBase, table=True):
    """감정 기록 테이블 모델"""
    __tablename__ = "emotion_records"
    
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    user_id: uuid.UUID = Field(
        foreign_key="users.id",
        index=True,
        nullable=False
    )
    ai_analysis: Any = Field(default_factory=dict, sa_column=Column(JSON))
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="emotion_records")


# 감정 타입 상수
class EmotionType:
    """감정 타입 상수"""
    HAPPY = "happy"
    SAD = "sad"
    ANXIOUS = "anxious"
    CALM = "calm"
    EXCITED = "excited"
    FRUSTRATED = "frustrated"
    CONTENT = "content"
    
    @classmethod
    def all(cls) -> list[str]:
        """모든 감정 타입 반환"""
        return [
            cls.HAPPY,
            cls.SAD,
            cls.ANXIOUS,
            cls.CALM,
            cls.EXCITED,
            cls.FRUSTRATED,
            cls.CONTENT,
        ]