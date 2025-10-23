"""
감정 기록 스키마 (요청/응답)
"""
from pydantic import BaseModel, Field
from datetime import datetime
import uuid


class EmotionRecordCreate(BaseModel):
    """감정 기록 생성 스키마"""
    emotion_level: int = Field(ge=1, le=10)
    emotion_type: str
    note: str | None = None


class EmotionRecordUpdate(BaseModel):
    """감정 기록 수정 스키마"""
    emotion_level: int | None = Field(None, ge=1, le=10)
    emotion_type: str | None = None
    note: str | None = None


class EmotionRecordResponse(BaseModel):
    """감정 기록 응답 스키마"""
    id: uuid.UUID
    user_id: uuid.UUID
    emotion_level: int
    emotion_type: str
    note: str | None
    ai_analysis: dict
    recorded_at: datetime
    
    class Config:
        from_attributes = True


class EmotionStatsResponse(BaseModel):
    """감정 통계 응답 스키마"""
    average_level: float
    total_records: int
    emotion_distribution: dict[str, int]
    trend: str # 'improving', 'declining', 'stable'