import json
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

import openai
from app.models.emotion import EmotionRecord
from app.models.feedback import AIFeedback, FeedbackType
from app.models.focus import FocusSession
from app.models.todo import TodoItem
from sqlmodel import Session, select
from transformers import pipeline

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        # HuggingFace 감정 분석 모델 초기화 (로컬 실행)
        try:
            self.emotion_analyzer = pipeline(
                "sentiment-analysis",
                model="nlptown/bert-base-multilingual-uncased-sentiment",
                device=-1,  # CPU 사용 (GPU 사용 시 0)
            )
        except Exception as e:
            logger.error(f"Failed to load emotion analyzer: {e}")
            self.emotion_analyzer = None

    def analyze_emotion_text(self, text: str) -> Dict[str, Any]:
        """텍스트 감정 분석 (HuggingFace)"""
        if not text or not self.emotion_analyzer:
            return {}

        try:
            results = self.emotion_analyzer(text[:512])  # 최대 512자

            # 결과를 1-5 스케일로 변환
            if results:
                result = results[0]
                # nlptown 모델은 1-5 별점을 반환
                stars = int(result["label"].split()[0])
                confidence = result["score"]

                # 감정 추론
                emotion_inference = {
                    1: "very_negative",
                    2: "negative",
                    3: "neutral",
                    4: "positive",
                    5: "very_positive",
                }

                return {
                    "sentiment_score": stars,
                    "confidence": confidence,
                    "emotion_inference": emotion_inference.get(stars, "neutral"),
                    "analyzed_at": datetime.utcnow().isoformat(),
                }
        except Exception as e:
            logger.error(f"Emotion analysis failed: {e}")
            return {}

    def generate_feedback_with_gpt(
        self,
        user_api_key: str,
        user_name: str,
        emotions: list[EmotionRecord],
        sessions: list[FocusSession],
        todos: list[TodoItem],
        feedback_type: FeedbackType = FeedbackType.DAILY_SUMMARY,
    ) -> Optional[str]:
        """GPT를 사용한 개인화된 피드백 생성"""

        if not user_api_key:
            return None

        try:
            # OpenAI 클라이언트 설정 (사용자 API 키 사용)
            client = openai.OpenAI(api_key=user_api_key)

            # 데이터 요약 생성
            emotion_summary = self._summarize_emotions(emotions)
            focus_summary = self._summarize_focus(sessions)
            todo_summary = self._summarize_todos(todos)

            # 프롬프트 생성
            prompt = self._create_feedback_prompt(
                user_name, emotion_summary, focus_summary, todo_summary, feedback_type
            )

            # GPT API 호출
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a supportive ADHD coach providing personalized feedback in Korean.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=500,
                temperature=0.7,
            )

            return response.choices[0].message.content

        except openai.AuthenticationError:
            logger.error("Invalid OpenAI API key")
            raise ValueError("유효하지 않은 OpenAI API 키입니다.")
        except openai.RateLimitError:
            logger.error("OpenAI rate limit exceeded")
            raise ValueError(
                "API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
            )
        except Exception as e:
            logger.error(f"GPT feedback generation failed: {e}")
            raise ValueError(f"피드백 생성 중 오류가 발생했습니다: {str(e)}")

    def _summarize_emotions(self, emotions: list[EmotionRecord]) -> str:
        """감정 기록 요악"""
        if not emotions:
            return "감정 기록 없음"

        avg_level = sum(e.emotion_level for e in emotions) / len(emotions)
        emotion_counts = {}
        for e in emotions:
            emotion_counts[e.emotion_type] = emotion_counts.get(e.emotion_type, 0) + 1

        most_common = max(emotion_counts, key=emotion_counts.get)

        return f"""
        - 총 {len(emotions)}개의 감정 기록
        - 평균 감정 레벨: {avg_level:.1f}/5
        - 가장 많이 기록된 감정: {most_common} ({emotion_counts[most_common]}회)
        - 감정 분포: {emotion_counts}
        """

    def _summarize_focus(self, sessions: list[FocusSession]) -> str:
        """집중 세션 요약"""
        if not sessions:
            return "집중 세션 없음"

        total_minutes = sum(s.duration_minutes for s in sessions if s.end_time)
        completed_sessions = [s for s in sessions if s.end_time]
        avg_productivity = (
            sum(s.productivity_rating or 0 for s in completed_sessions)
            / len(completed_sessions)
            if completed_sessions
            else 0
        )

        return f"""
        - 총 {len(sessions)}개의 집중 세션
        - 총 집중 시간: {total_minutes}분
        - 평균 생산성: {avg_productivity:.1f}/5
        """

    def _summarize_todos(self, todos: list[TodoItem]) -> str:
        """할 일 요약"""
        if not todos:
            return "할 일 없음"

        completed = [t for t in todos if t.completed]
        pending = [t for t in todos if not t.completed]

        return f"""
        - 총 {len(todos)}개의 할 일
        - 완료: {len(completed)}개
        - 미완료: {len(pending)}개
        - 완료율: {len(completed)/len(todos)*100:.1f}%
        """

    def _create_feedback_prompt(
        self,
        user_name: str,
        emotion_summary: str,
        focus_summary: str,
        todo_summary: str,
        feedback_type: FeedbackType,
    ) -> str:
        """피드백 프롬프트 생성"""

        base_prompt = f"""
        사용자 이름: {user_name}
        
        오늘의 활동 요약:
        
        [감정 상태]
        {emotion_summary}
        
        [집중력 및 생산성]
        {focus_summary}
        
        [할 일 관리]
        {todo_summary}
        """

        if feedback_type == FeedbackType.DAILY_SUMMARY:
            return (
                base_prompt
                + """
            
            위 데이터를 바탕으로 오늘 하루를 마무리하는 따뜻하고 건설적인 피드백을 작성해주세요.
            다음 내용을 포함해주세요:
            1. 오늘의 긍정적인 점
            2. 개선할 수 있는 부분
            3. 내일을 위한 실용적인 팁 1-2개
            
            ADHD를 가진 사람에게 도움이 되도록 짧고 명확하게 작성해주세요.
            """
            )

        elif feedback_type == FeedbackType.WEEKLY_REPORT:
            return (
                base_prompt
                + """

            이번 주의 패턴과 트렌드를 분석하여 주간 리포트를 작성해주세요.
            다음 내용을 포함해주세요:
            1. 이번 주의 전반적인 패턴
            2. 가장 생산적이었던 시간대
            3. 감정과 생산성의 상관관계
            4. 다음 주를 위한 구체적인 제안
            """
            )

        else:
            return (
                base_prompt
                + """
            
            사용자의 현재 상태에 대한 간단한 분석과 격려의 메시지를 작성해주세요.
            """
            )


class AIBackgroundService:
    """백그라운드 AI 작업 서비스"""

    def __init__(self, db: Session):
        self.db = db
        self.ai_service = AIService()

    async def process_emotion_analysis(self, emotion_id: str, text: str):
        """감정 기록에 대한 AI 분석 수행"""
        try:
            analysis = self.ai_service.analyze_emotion_text(text)

            if analysis:
                emotion = self.db.exec(
                    select(EmotionRecord).where(EmotionRecord.id == emotion_id)
                ).first()

                if emotion:
                    emotion.ai_analysis = json.dumps(analysis)
                    self.db.add(emotion)
                    self.db.commit()
        except Exception as e:
            logger.error(f"Failed to process emotion analysis: {e}")

    async def generate_daily_feedback(self, user_id: str):
        """일일 피드백 생성"""
        from app.models.user import User

        user = self.db.exec(select(User).where(User.id == user_id)).first()
        if not user:
            return

        settings = user.get_settings()
        api_key = settings.get("openai_api_key")

        if not api_key or not settings.get("enable_ai_analysis", True):
            return

        # 오늘의 데이터 수집
        today = datetime.utcnow().date()
        start_of_day = datetime.combine(today, datetime.min.time())

        emotions = self.db.exec(
            select(EmotionRecord).where(
                EmotionRecord.user_id == user_id,
                EmotionRecord.recorded_at >= start_of_day,
            )
        ).all()

        sessions = self.db.exec(
            select(FocusSession).where(
                FocusSession.user_id == user_id, FocusSession.start_time >= start_of_day
            )
        ).all()

        todos = self.db.exec(select(TodoItem).where(TodoItem.user_id == user_id)).all()

        try:
            # 피드백 생성
            feedback_text = self.ai_service.generate_feedback_with_gpt(
                api_key,
                user.name,
                emotions,
                sessions,
                todos,
                FeedbackType.DAILY_SUMMARY,
            )

            if feedback_text:
                # 피드백 저장
                feedback = AIFeedback(
                    user_id=user_id,
                    feedback_text=feedback_text,
                    feedback_type=FeedbackType.DAILY_SUMMARY,
                    ai_metadata=json.dumps(
                        {
                            "generated_at": datetime.utcnow().isoformat(),
                            "data_count": {
                                "emotions": len(emotions),
                                "sessions": len(sessions),
                                "todos": len(todos),
                            },
                        }
                    ),
                )
                self.db.add(feedback)
                self.db.commit()

        except Exception as e:
            logger.error(f"Failed to generate daily feedback: {e}")
