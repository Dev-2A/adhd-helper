"""
집중 세션 모델
"""
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from app.models.user import User


class FocusSessionBase(SQLModel):
    """집중 세션 기본 정보"""
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_minutes: int = Field(default=0, ge=0, description="실제 집중 시간 (분)")
    session_type: str = Field(default="pomodoro", max_length=20)
    productivity_rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None


class FocusSession(FocusSessionBase, table=True):
    """집중 세션 테이블 모델"""
    __tablename__ = "focus_sessions"
    
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
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="focus_sessions")


# 세션 타입 상수
class SessionType:
    POMODORO = "pomodoro"       # 25분 + 5분 휴식
    DEEP_WORK = "deep_work"     # 90분 이상 집중
    SHORT_BREAK = "short_break" # 5-10분 휴식
    LONG_BREAK = "long_break"   # 15-30분 휴식
    
    @classmethod
    def all(cls) -> list[str]:
        """모든 세션 타입 반환"""
        return [
            cls.POMODORO,
            cls.DEEP_WORK,
            cls.SHORT_BREAK,
            cls.LONG_BREAK
        ]