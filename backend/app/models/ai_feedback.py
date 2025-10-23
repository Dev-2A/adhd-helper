"""
AI 피드백 모델
"""
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import JSON
from datetime import datetime
from typing import Optional, TYPE_CHECKING, Any
import uuid

if TYPE_CHECKING:
    from app.models.user import User


class AIFeedbackBase(SQLModel):
    """AI 피드백 기본 정보"""
    feedback_text: str = Field(description="피드백 내용")
    feedback_type: str = Field(default="daily_summary", max_length=50)
    generated_at: datetime = Field(default_factory=datetime.utcnow)


class AIFeedback(AIFeedbackBase, table=True):
    """AI 피드백 테이블 모델"""
    __tablename__ = "ai_feedbacks"
    
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
    data_sources: Any = Field(default_factory=dict, sa_column=Column(JSON))
    extra_data: Any = Field(default_factory=dict, sa_column=Column(JSON))  # metadata -> extra_data로 변경
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="ai_feedbacks")


# 피드백 타입 상수
class FeedbackType:
    """피드백 타입 상수"""
    DAILY_SUMMARY = "daily_summary"       # 일일 요약
    WEEKLY_REPORT = "weekly_report"       # 주간 리포트
    MONTHLY_REPORT = "monthly_report"     # 월간 리포트
    INSIGHT = "insight"                   # 인사이트
    ENCOURAGEMENT = "encouragement"       # 격려 메시지
    
    @classmethod
    def all(cls) -> list[str]:
        """모든 피드백 타입 반환"""
        return [
            cls.DAILY_SUMMARY,
            cls.WEEKLY_REPORT,
            cls.MONTHLY_REPORT,
            cls.INSIGHT,
            cls.ENCOURAGEMENT,
        ]