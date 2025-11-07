import json
from datetime import datetime, timedelta
from typing import Optional

from app.api.deps import get_current_active_user, get_db
from app.models.feedback import AIFeedback, AIFeedbackRead
from app.models.user import User, UserSettings
from app.services.ai_service import AIBackgroundService, AIService
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlmodel import Session, select

router = APIRouter()


@router.post("/settings")
async def update_ai_settings(
    settings: UserSettings,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """AI 설정 업데이트 (API 키 등)"""
    current_user.update_settings(settings.dict(exclude_none=True))
    db.add(current_user)
    db.commit()

    return {"message": "AI  설정이 업데이트되었습니다"}


@router.get("/settings", response_model=UserSettings)
async def get_ai_settings(current_user: User = Depends(get_current_active_user)):
    """현재 AI 설정 조회"""
    settings = current_user.get_settings()
    return UserSettings(
        openai_api_key="*" * 10 if settings.get("openai_api_key") else None,
        enable_ai_analysis=settings.get("enable_ai_analysis", True),
        ai_feedback_frequency=settings.get("ai_feedback_frequency", "daily"),
    )


@router.post("/analyze-emotion")
async def analyze_emotion(
    text: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
):
    """텍스트 감정 분석 (HuggingFace)"""
    ai_service = AIService()

    try:
        result = ai_service.analyze_emotion_text(text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-feedback")
async def generate_feedback(
    feedback_type: Optional[str] = "daily_summary",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """AI 피드백 생성 (OpenAI GPT)"""
    settings = current_user.get_settings()
    api_key = settings.get("openai_api_key")

    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="OpenAI API  키가 설정되지 않았습니다. 설정에서 API 키를 입력해주세요.",
        )

    # 데이터 수집 (최근 7일)
    week_ago = datetime.utcnow() - timedelta(days=7)

    from app.models.emotion import EmotionRecord
    from app.models.focus import FocusSession
    from app.models.todo import TodoItem

    emotions = db.exec(
        select(EmotionRecord).where(
            EmotionRecord.user_id == current_user.id,
            EmotionRecord.recorded_at >= week_ago,
        )
    ).all()

    sessions = db.exec(
        select(FocusSession).where(
            FocusSession.user_id == current_user.id, FocusSession.start_time >= week_ago
        )
    ).all()

    todos = db.exec(select(TodoItem).where(TodoItem.user_id == current_user.id)).all()

    ai_service = AIService()

    try:
        feedback_text = ai_service.generate_feedback_with_gpt(
            api_key, current_user.name, emotions, sessions, todos, feedback_type
        )

        if feedback_text:
            # 피드백 저장
            feedback = AIFeedback(
                user_id=current_user.id,
                feedback_text=feedback_text,
                feedback_type=feedback_type,
                ai_metadata=json.dumps(
                    {
                        "generated_at": datetime.utcnow().isoformat(),
                        "requested_by": "user",
                    }
                ),
            )
            db.add(feedback)
            db.commit()

            return {
                "feedback": feedback_text,
                "generated_at": datetime.utcnow().isoformat(),
            }
        else:
            raise HTTPException(status_code=500, detail="피드백 생성에 실패했습니다")

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"피드백 생성 중 오류: {str(e)}")


@router.get("/feedbacks", response_model=list[AIFeedbackRead])
async def get_feedbacks(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """AI 피드백 목록 조회"""
    feedbacks = db.exec(
        select(AIFeedback)
        .where(AIFeedback.user_id == current_user.id)
        .order_by(AIFeedback.created_at.desc())
        .limit(limit)
    ).all()

    return [
        AIFeedbackRead(
            id=str(f.id),
            user_id=str(f.user_id),
            feedback_text=f.feedback_text,
            feedback_type=f.feedback_type,
            sentiment_score=f.sentiment_score,
            ai_metadata=f.ai_metadata,
            created_at=f.created_at,
        )
        for f in feedbacks
    ]


@router.post("/test-api-key")
async def test_api_key(
    api_key: str, current_user: User = Depends(get_current_active_user)
):
    """OpenAI API 키 테스트"""
    import openai

    try:
        client = openai.OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=5,
        )
        return {"valid": True, "messasge": "API 키가 유효합니다"}
    except openai.AuthenticationError:
        return {"valid": False, "message": "유효하지 않은 API 키입니다"}
    except Exception as e:
        return {"valid": False, "message": f"오류: {str(e)}"}
