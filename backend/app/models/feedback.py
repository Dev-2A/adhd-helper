import uuid as uuid_lib
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from app.models.base import BaseModel
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.user import User


class FeedbackType(str, Enum):
    DAILY_SUMMARY = "daily_summary"
    WEEKLY_REPORT = "weekly_report"
    EMOTION_ANALYSIS = "emotion_analysis"
    PRODUCTIVITY_INSIGHT = "productivity_insight"
    CUSTOM = "custom"


class AIFeedbackBase(SQLModel):
    """AIFeedback 기본 스키마"""

    feedback_text: str = Field(max_length=2000)
    feedback_type: FeedbackType = Field(default=FeedbackType.DAILY_SUMMARY)
    sentiment_score: Optional[float] = Field(default=None, ge=-1.0, le=1.0)


class AIFeedback(AIFeedbackBase, BaseModel, table=True):
    """AIFeedback 데이터베이스 모델"""

    __tablename__ = "ai_feedbacks"

    user_id: uuid_lib.UUID = Field(foreign_key="users.id", index=True)
    ai_metadata: Optional[str] = Field(
        default=None, max_length=1000
    )  # metadata → ai_metadata로 변경

    # Relationship
    user: Optional["User"] = Relationship(back_populates="ai_feedbacks")


class AIFeedbackCreate(AIFeedbackBase):
    """AIFeedback 생성 스키마"""

    pass


class AIFeedbackRead(AIFeedbackBase):
    """AIFeedback 읽기 스키마"""

    id: str
    user_id: str
    ai_metadata: Optional[str]  # metadata → ai_metadata로 변경
    created_at: datetime
