from datetime import datetime, timedelta
from typing import List, Optional

from app.api.deps import get_current_active_user, get_db
from app.models.emotion import (
    EmotionRecord,
    EmotionRecordCreate,
    EmotionRecordRead,
    EmotionRecordUpdate,
)
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

router = APIRouter()


@router.post("/", response_model=EmotionRecordRead)
async def create_emotion_record(
    emotion: EmotionRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """감정 기록 생성"""
    db_emotion = EmotionRecord(**emotion.dict(), user_id=current_user.id)
    db.add(db_emotion)
    db.commit()
    db.refresh(db_emotion)

    return EmotionRecordRead(
        id=str(db_emotion.id),
        user_id=str(db_emotion.user_id),
        emotion_level=db_emotion.emotion_level,
        emotion_type=db_emotion.emotion_type,
        note=db_emotion.note,
        recorded_at=db_emotion.recorded_at,
        ai_analysis=db_emotion.ai_analysis,
        created_at=db_emotion.created_at,
    )


@router.get("/", response_model=List[EmotionRecordRead])
async def get_emotion_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """감정 기록 목록 조회"""
    query = select(EmotionRecord).where(EmotionRecord.user_id == current_user.id)

    if start_date:
        query = query.where(EmotionRecord.recorded_at >= start_date)
    if end_date:
        query = query.where(EmotionRecord.recorded_at <= end_date)

    query = query.offset(skip).limit(limit).order_by(EmotionRecord.recorded_at.desc())
    emotions = db.exec(query).all()

    return [
        EmotionRecordRead(
            id=str(e.id),
            user_id=str(e.user_id),
            emotion_level=e.emotion_level,
            emotion_type=e.emotion_type,
            note=e.note,
            recorded_at=e.recorded_at,
            ai_analysis=e.ai_analysis,
            created_at=e.created_at,
        )
        for e in emotions
    ]


@router.get("/{emotion_id}", response_model=EmotionRecordRead)
async def get_emotion_record(
    emotion_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """특정 감정 기록 조회"""
    emotion = db.exec(
        select(EmotionRecord).where(
            EmotionRecord.id == emotion_id, EmotionRecord.user_id == current_user.id
        )
    ).first()

    if not emotion:
        raise HTTPException(status_code=404, detail="Emotion record not found")

    return EmotionRecordRead(
        id=str(emotion.id),
        user_id=str(emotion.user_id),
        emotion_level=emotion.emotion_level,
        emotion_type=emotion.emotion_type,
        note=emotion.note,
        recorded_at=emotion.recorded_at,
        ai_analysis=emotion.ai_analysis,
        created_at=emotion.created_at,
    )


@router.put("/{emotion_id}", response_model=EmotionRecordRead)
async def update_emotion_record(
    emotion_id: str,
    emotion_update: EmotionRecordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """감정 기록 수정"""
    emotion = db.exec(
        select(EmotionRecord).where(
            EmotionRecord.id == emotion_id, EmotionRecord.user_id == current_user.id
        )
    ).first()

    if not emotion:
        raise HTTPException(status_code=404, detail="Emotion record not found")

    update_data = emotion_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(emotion, key, value)

    emotion.updated_at = datetime.utcnow()
    db.add(emotion)
    db.commit()
    db.refresh(emotion)

    return EmotionRecordRead(
        id=str(emotion.id),
        user_id=str(emotion.user_id),
        emotion_level=emotion.emotion_level,
        emotion_type=emotion.emotion_type,
        note=emotion.note,
        recorded_at=emotion.recorded_at,
        ai_analysis=emotion.ai_analysis,
        created_at=emotion.created_at,
    )


@router.delete("/{emotion_id}")
async def delete_emotion_record(
    emotion_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """감정 기록 삭제"""
    emotion = db.exec(
        select(EmotionRecord).where(
            EmotionRecord.id == emotion_id, EmotionRecord.user_id == current_user.id
        )
    ).first()

    if not emotion:
        raise HTTPException(status_code=404, detail="Emotion record not found")

    db.delete(emotion)
    db.commit()

    return {"message": "Emotion record deleted Successfully"}


@router.get("/stats/summary")
async def get_emotion_stats(
    days: int = Query(7, ge=1, le=90),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """감정 통계 조회"""
    start_date = datetime.utcnow() - timedelta(days=days)

    emotions = db.exec(
        select(EmotionRecord).where(
            EmotionRecord.user_id == current_user.id,
            EmotionRecord.recorded_at >= start_date,
        )
    ).all()

    if not emotions:
        return {
            "total_records": 0,
            "average_level": 0,
            "most_common_emotion": None,
            "emotion_distribution": {},
        }

    # 통계 계산
    total = len(emotions)
    avg_level = sum(e.emotion_level for e in emotions) / total

    # 감정 분포
    emotion_counts = {}
    for e in emotions:
        emotion_counts[e.emotion_type] = emotion_counts.get(e.emotion_type, 0) + 1

    most_common = (
        max(emotion_counts, key=emotion_counts.get) if emotion_counts else None
    )

    return {
        "total_records": total,
        "average_level": round(avg_level, 2),
        "most_common_emotion": most_common,
        "emotion_distribution": emotion_counts,
        "period_days": days,
    }
