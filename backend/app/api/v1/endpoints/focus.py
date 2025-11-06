from datetime import datetime, timedelta
from typing import List, Optional

from app.api.deps import get_current_active_user, get_db
from app.models.focus import (
    FocusSession,
    FocusSessionCreate,
    FocusSessionRead,
    FocusSessionUpdate,
)
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

router = APIRouter()


@router.post("/", response_model=FocusSessionRead)
async def create_focus_session(
    session: FocusSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """집중 세션 시작"""
    db_session = FocusSession(**session.dict(), user_id=current_user.id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)

    return FocusSessionRead(
        id=str(db_session.id),
        user_id=str(db_session.user_id),
        start_time=db_session.start_time,
        end_time=db_session.end_time,
        duration_minutes=db_session.duration_minutes,
        session_type=db_session.session_type,
        productivity_rating=db_session.productivity_rating,
        notes=db_session.notes,
        created_at=db_session.created_at,
    )


@router.get("/current", response_model=Optional[FocusSessionRead])
async def get_current_session(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
):
    """현재 진행 중인 세션 조회"""
    session = db.exec(
        select(FocusSession)
        .where(FocusSession.user_id == current_user.id, FocusSession.end_time == None)
        .order_by(FocusSession.start_time.desc())
    ).first()

    if not session:
        return None

    return FocusSessionRead(
        id=str(session.id),
        user_id=str(session.user_id),
        start_time=session.start_time,
        end_time=session.end_time,
        duration_minutes=session.duration_minutes,
        session_type=session.session_type,
        productivity_rating=session.productivity_rating,
        notes=session.notes,
        created_at=session.created_at,
    )


@router.put("/{session_id}/end", response_model=FocusSessionRead)
async def end_focus_session(
    session_id: str,
    session_update: FocusSessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """집중 세션 종료"""
    session = db.exec(
        select(FocusSession).where(
            FocusSession.id == session_id, FocusSession.user_id == current_user.id
        )
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.end_time:
        raise HTTPException(status_code=400, detail="Session already ended")

    session.end_time = datetime.utcnow()
    session.productivity_rating = session_update.productivity_rating
    session.notes = session_update.notes
    session.updated_at = datetime.utcnow()

    db.add(session)
    db.commit()
    db.refresh(session)

    return FocusSessionRead(
        id=str(session.id),
        user_id=str(session.user_id),
        start_time=session.start_time,
        end_time=session.end_time,
        duration_minutes=session.duration_minutes,
        session_type=session.session_type,
        productivity_rating=session.productivity_rating,
        notes=session.notes,
        created_at=session.created_at,
    )


@router.get("/", response_model=List[FocusSessionRead])
async def get_focus_sessions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """집중 세션 목록 조회"""
    query = select(FocusSession).where(FocusSession.user_id == current_user.id)

    if start_date:
        query = query.where(FocusSession.start_time >= start_date)
    if end_date:
        query = query.where(FocusSession.start_time <= end_date)

    query = query.offset(skip).limit(limit).order_by(FocusSession.start_time.desc())
    sessions = db.exec(query).all()

    return [
        FocusSessionRead(
            id=str(s.id),
            user_id=str(s.user_id),
            start_time=s.start_time,
            end_time=s.end_time,
            duration_minutes=s.duration_minutes,
            session_type=s.session_type,
            productivity_rating=s.productivity_rating,
            notes=s.notes,
            created_at=s.created_at,
        )
        for s in sessions
    ]


@router.get("/stats/summary")
async def get_focus_stats(
    days: int = Query(7, ge=1, le=90),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """집중 세션 통계 조회"""
    start_date = datetime.utcnow() - timedelta(days=days)

    sessions = db.exec(
        select(FocusSession).where(
            FocusSession.user_id == current_user.id,
            FocusSession.start_time >= start_date,
            FocusSession.end_time != None,
        )
    ).all()

    if not sessions:
        return {
            "total_sessions": 0,
            "total_minutes": 0,
            "average_duration": 0,
            "average_productivity": 0,
        }

    total_sessions = len(sessions)
    total_minutes = sum(s.duration_minutes for s in sessions)
    avg_duration = total_minutes / total_sessions

    rated_sessions = [s for s in sessions if s.productivity_rating]
    avg_productivity = (
        sum(s.productivity_rating for s in rated_sessions) / len(rated_sessions)
        if rated_sessions
        else 0
    )

    return {
        "total_sessions": total_sessions,
        "total_minutes": total_minutes,
        "average_duration": round(avg_duration, 1),
        "average_productivity": round(avg_productivity, 2),
        "period_days": days,
    }
