# ADHD 도우미 백엔드 상세 설계서

## 📋 문서 정보
- **프로젝트명**: ADHD Helper Backend API
- **버전**: 1.0.0
- **작성일**: 2025년 10월 21일
- **문서 타입**: 백엔드 설계서

---

## 1. 백엔드 개요

### 1.1 목적
FastAPI 기반의 RESTful API 서버로, ADHD 사용자의 감정 기록, 집중력 추적, AI 기반 피드백 생성을 담당합니다.

### 1.2 핵심 책임
1. **데이터 관리**: 사용자 데이터, 감정 기록, 집중 세션, Todo 항목의 CRUD 작업
2. **인증/인가**: JWT 기반 사용자 인증 및 권한 관리
3. **AI 통합**: HuggingFace 감정 분석 및 OpenAI GPT 피드백 생성
4. **데이터 분석**: 주간/월간 통계 및 트렌드 분석
5. **API 문서화**: 자동 생성된 OpenAPI 문서 제공

---

## 2. 기술 스택

### 2.1 Core Framework
```yaml
Framework: FastAPI 0.104+
- 빠른 API 개발 및 자동 문서 생성
- Type hints 기반 자동 검증
- 비동기 처리 지원 (async/await)
- 높은 성능 (Starlette + Pydantic 기반)

Python: 3.11+
- 최신 문법 지원 (match-case, Union types)
- 성능 개선 (10-60% 빠름)
- 향상된 에러 메시지
```

### 2.2 Database & ORM
```yaml
ORM: SQLModel 0.0.14+
- SQLAlchemy 2.0 기반
- Pydantic 통합 (자동 검증)
- Type safety
- 간결한 모델 정의

Database:
  Development: SQLite 3.40+
  - 로컬 파일 기반
  - 빠른 개발 환경 구성
  
  Production: PostgreSQL 15+
  - 확장성과 성능
  - ACID 트랜잭션
  - JSON/JSONB 지원
```

### 2.3 AI & ML
```yaml
HuggingFace Transformers:
- 목적: 텍스트 감정 분석
- 모델: xlm-roberta-base-sentiment
- 언어: 다국어 지원 (한국어 포함)

OpenAI API:
- 목적: 개인화된 피드백 생성
- 모델: GPT-3.5-turbo / GPT-4
- 활용: 일일 요약, 주간 리포트, 인사이트
```

### 2.4 Additional Libraries
```python
# requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlmodel==0.0.14
pydantic==2.5.0
pydantic-settings==2.1.0

# 인증
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# AI/ML
transformers==4.35.0
torch==2.1.0
openai==1.3.0

# 데이터베이스
psycopg2-binary==2.9.9
alembic==1.13.0
redis==5.0.1

# 유틸리티
python-dateutil==2.8.2
pytz==2023.3

# 모니터링
sentry-sdk[fastapi]==1.38.0

# 테스팅
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
```

---

## 3. 프로젝트 구조

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI 애플리케이션 진입점
│   ├── config.py              # 환경 설정 관리
│   ├── database.py            # 데이터베이스 연결 설정
│   ├── dependencies.py        # 의존성 주입 정의
│   │
│   ├── models/                # SQLModel 데이터 모델
│   │   ├── __init__.py
│   │   ├── user.py           # 사용자 모델
│   │   ├── emotion.py        # 감정 기록 모델
│   │   ├── focus_session.py  # 집중 세션 모델
│   │   ├── todo.py           # Todo 모델
│   │   └── ai_feedback.py    # AI 피드백 모델
│   │
│   ├── schemas/               # Pydantic 스키마 (요청/응답)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── emotion.py
│   │   ├── focus_session.py
│   │   ├── todo.py
│   │   ├── ai_feedback.py
│   │   └── auth.py           # 인증 관련 스키마
│   │
│   ├── api/                   # API 라우터
│   │   ├── __init__.py
│   │   ├── deps.py           # API 레벨 의존성
│   │   ├── auth.py           # 인증 엔드포인트
│   │   ├── users.py          # 사용자 엔드포인트
│   │   ├── emotions.py       # 감정 엔드포인트
│   │   ├── focus_sessions.py # 집중 세션 엔드포인트
│   │   ├── todos.py          # Todo 엔드포인트
│   │   ├── analytics.py      # 분석 엔드포인트
│   │   └── ai.py             # AI 관련 엔드포인트
│   │
│   ├── services/              # 비즈니스 로직
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   ├── emotion_service.py
│   │   ├── focus_service.py
│   │   ├── todo_service.py
│   │   ├── analytics_service.py
│   │   └── ai_service.py
│   │
│   ├── core/                  # 핵심 유틸리티
│   │   ├── __init__.py
│   │   ├── security.py       # JWT, 암호화, 해싱
│   │   ├── exceptions.py     # 커스텀 예외
│   │   ├── logging.py        # 로깅 설정
│   │   └── cache.py          # Redis 캐싱
│   │
│   └── utils/                 # 헬퍼 함수
│       ├── __init__.py
│       ├── date_utils.py     # 날짜/시간 유틸리티
│       └── validation.py     # 추가 검증 로직
│
├── tests/                     # 테스트 코드
│   ├── __init__.py
│   ├── conftest.py           # pytest 설정
│   ├── test_auth.py
│   ├── test_emotions.py
│   ├── test_focus_sessions.py
│   ├── test_todos.py
│   ├── test_analytics.py
│   └── test_ai_service.py
│
├── alembic/                   # 데이터베이스 마이그레이션
│   ├── versions/             # 마이그레이션 파일
│   ├── env.py
│   └── script.py.mako
│
├── scripts/                   # 유틸리티 스크립트
│   ├── init_db.py            # DB 초기화
│   ├── migrate.py            # 마이그레이션 실행
│   └── seed_data.py          # 테스트 데이터 생성
│
├── .env.example              # 환경 변수 예시
├── .gitignore
├── alembic.ini               # Alembic 설정
├── requirements.txt
├── requirements-dev.txt      # 개발 의존성
├── Dockerfile
├── docker-compose.yml
├── pytest.ini
└── README.md
```

---

## 4. 데이터 모델 설계

### 4.1 User Model

```python
# app/models/user.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
import uuid

class UserBase(SQLModel):
    """사용자 기본 정보"""
    email: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=100)
    timezone: str = Field(default="UTC", max_length=50)
    settings: dict = Field(default_factory=dict, sa_column_kwargs={"type_": "JSON"})

class User(UserBase, table=True):
    """사용자 테이블 모델"""
    __tablename__ = "users"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str = Field(max_length=255)
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    emotion_records: List["EmotionRecord"] = Relationship(back_populates="user")
    focus_sessions: List["FocusSession"] = Relationship(back_populates="user")
    todo_items: List["TodoItem"] = Relationship(back_populates="user")
    ai_feedbacks: List["AIFeedback"] = Relationship(back_populates="user")

class UserCreate(UserBase):
    """사용자 생성 스키마"""
    password: str = Field(min_length=8, max_length=100)

class UserUpdate(SQLModel):
    """사용자 수정 스키마"""
    name: Optional[str] = Field(None, max_length=100)
    timezone: Optional[str] = Field(None, max_length=50)
    settings: Optional[dict] = None

class UserResponse(UserBase):
    """사용자 응답 스키마"""
    id: uuid.UUID
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
```

### 4.2 Emotion Record Model

```python
# app/models/emotion.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
import uuid

class EmotionRecordBase(SQLModel):
    """감정 기록 기본 정보"""
    emotion_level: int = Field(ge=1, le=5, description="감정 강도 (1-5)")
    emotion_type: str = Field(max_length=50, description="감정 타입")
    note: Optional[str] = Field(None, description="메모")
    recorded_at: datetime = Field(default_factory=datetime.utcnow)

class EmotionRecord(EmotionRecordBase, table=True):
    """감정 기록 테이블 모델"""
    __tablename__ = "emotion_records"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    ai_analysis: dict = Field(default_factory=dict, sa_column_kwargs={"type_": "JSON"})
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="emotion_records")

class EmotionRecordCreate(EmotionRecordBase):
    """감정 기록 생성 스키마"""
    pass

class EmotionRecordUpdate(SQLModel):
    """감정 기록 수정 스키마"""
    emotion_level: Optional[int] = Field(None, ge=1, le=5)
    emotion_type: Optional[str] = Field(None, max_length=50)
    note: Optional[str] = None

class EmotionRecordResponse(EmotionRecordBase):
    """감정 기록 응답 스키마"""
    id: uuid.UUID
    user_id: uuid.UUID
    ai_analysis: dict
    
    class Config:
        from_attributes = True

# 감정 타입 상수
class EmotionType:
    HAPPY = "happy"
    SAD = "sad"
    ANXIOUS = "anxious"
    CALM = "calm"
    EXCITED = "excited"
    FRUSTRATED = "frustrated"
    CONTENT = "content"
```

### 4.3 Focus Session Model

```python
# app/models/focus_session.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
import uuid

class FocusSessionBase(SQLModel):
    """집중 세션 기본 정보"""
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_minutes: int = Field(ge=0, description="실제 집중 시간 (분)")
    session_type: str = Field(default="pomodoro", max_length=20)
    productivity_rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None

class FocusSession(FocusSessionBase, table=True):
    """집중 세션 테이블 모델"""
    __tablename__ = "focus_sessions"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="focus_sessions")

class FocusSessionCreate(SQLModel):
    """집중 세션 시작 스키마"""
    session_type: str = Field(default="pomodoro", max_length=20)
    planned_duration: int = Field(default=25, ge=1, description="계획된 시간 (분)")

class FocusSessionUpdate(SQLModel):
    """집중 세션 종료 스키마"""
    end_time: datetime
    productivity_rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None

class FocusSessionResponse(FocusSessionBase):
    """집중 세션 응답 스키마"""
    id: uuid.UUID
    user_id: uuid.UUID
    
    class Config:
        from_attributes = True

# 세션 타입 상수
class SessionType:
    POMODORO = "pomodoro"          # 25분 + 5분 휴식
    DEEP_WORK = "deep_work"        # 90분 이상 집중
    SHORT_BREAK = "short_break"    # 5-10분 휴식
    LONG_BREAK = "long_break"      # 15-30분 휴식
```

### 4.4 Todo Item Model

```python
# app/models/todo.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
import uuid

class TodoItemBase(SQLModel):
    """Todo 항목 기본 정보"""
    title: str = Field(max_length=255)
    description: Optional[str] = None
    completed: bool = Field(default=False)
    priority: int = Field(default=1, ge=1, le=5, description="우선순위 (1-5)")
    due_date: Optional[datetime] = None

class TodoItem(TodoItemBase, table=True):
    """Todo 항목 테이블 모델"""
    __tablename__ = "todo_items"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="todo_items")

class TodoItemCreate(TodoItemBase):
    """Todo 생성 스키마"""
    pass

class TodoItemUpdate(SQLModel):
    """Todo 수정 스키마"""
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[int] = Field(None, ge=1, le=5)
    due_date: Optional[datetime] = None

class TodoItemResponse(TodoItemBase):
    """Todo 응답 스키마"""
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True
```

### 4.5 AI Feedback Model

```python
# app/models/ai_feedback.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
import uuid

class AIFeedbackBase(SQLModel):
    """AI 피드백 기본 정보"""
    feedback_text: str = Field(description="피드백 내용")
    feedback_type: str = Field(default="daily_summary", max_length=50)
    generated_at: datetime = Field(default_factory=datetime.utcnow)

class AIFeedback(AIFeedbackBase, table=True):
    """AI 피드백 테이블 모델"""
    __tablename__ = "ai_feedbacks"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    data_sources: dict = Field(default_factory=dict, sa_column_kwargs={"type_": "JSON"})
    metadata: dict = Field(default_factory=dict, sa_column_kwargs={"type_": "JSON"})
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="ai_feedbacks")

class AIFeedbackResponse(AIFeedbackBase):
    """AI 피드백 응답 스키마"""
    id: uuid.UUID
    user_id: uuid.UUID
    data_sources: dict
    metadata: dict
    
    class Config:
        from_attributes = True

# 피드백 타입 상수
class FeedbackType:
    DAILY_SUMMARY = "daily_summary"       # 일일 요약
    WEEKLY_REPORT = "weekly_report"       # 주간 리포트
    MONTHLY_REPORT = "monthly_report"     # 월간 리포트
    INSIGHT = "insight"                   # 인사이트
    ENCOURAGEMENT = "encouragement"       # 격려 메시지
```

---

## 5. API 엔드포인트 상세

### 5.1 Authentication API

```python
# app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from datetime import timedelta

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: Session = Depends(get_session)
) -> UserResponse:
    """
    사용자 등록
    
    - **email**: 이메일 주소 (고유해야 함)
    - **password**: 비밀번호 (최소 8자)
    - **name**: 사용자 이름
    - **timezone**: 타임존 (기본값: UTC)
    """
    # 이메일 중복 체크
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # 비밀번호 해싱
    hashed_password = get_password_hash(user_in.password)
    
    # 사용자 생성
    db_user = User(
        **user_in.model_dump(exclude={"password"}),
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_session)
) -> Token:
    """
    로그인 및 JWT 토큰 발급
    
    - **username**: 이메일 주소
    - **password**: 비밀번호
    
    Returns:
        - **access_token**: 액세스 토큰
        - **refresh_token**: 리프레시 토큰
        - **token_type**: Bearer
    """
    # 사용자 인증
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 토큰 생성
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_token: str,
    db: Session = Depends(get_session)
) -> Token:
    """토큰 갱신"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.get(User, user_id)
    if user is None:
        raise credentials_exception
    
    # 새 액세스 토큰 생성
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
) -> UserResponse:
    """현재 로그인한 사용자 정보 조회"""
    return current_user
```

### 5.2 Emotions API

```python
# app/api/emotions.py
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/emotions", tags=["emotions"])

@router.post("/", response_model=EmotionRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_emotion_record(
    emotion_in: EmotionRecordCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
    ai_service: AIService = Depends(get_ai_service)
) -> EmotionRecordResponse:
    """
    감정 기록 생성
    
    - **emotion_level**: 감정 강도 (1-5)
    - **emotion_type**: 감정 타입 (happy, sad, anxious 등)
    - **note**: 메모 (선택사항)
    """
    # 감정 분석 수행 (note가 있는 경우)
    ai_analysis = {}
    if emotion_in.note:
        ai_analysis = await ai_service.analyze_sentiment(emotion_in.note)
    
    # 감정 기록 생성
    db_emotion = EmotionRecord(
        **emotion_in.model_dump(),
        user_id=current_user.id,
        ai_analysis=ai_analysis
    )
    db.add(db_emotion)
    db.commit()
    db.refresh(db_emotion)
    
    return db_emotion

@router.get("/", response_model=List[EmotionRecordResponse])
async def list_emotion_records(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[EmotionRecordResponse]:
    """
    감정 기록 목록 조회
    
    Query Parameters:
    - **skip**: 건너뛸 레코드 수
    - **limit**: 가져올 최대 레코드 수
    - **start_date**: 시작 날짜 (옵션)
    - **end_date**: 종료 날짜 (옵션)
    """
    query = select(EmotionRecord).where(EmotionRecord.user_id == current_user.id)
    
    if start_date:
        query = query.where(EmotionRecord.recorded_at >= start_date)
    if end_date:
        query = query.where(EmotionRecord.recorded_at <= end_date)
    
    query = query.order_by(EmotionRecord.recorded_at.desc()).offset(skip).limit(limit)
    
    emotions = db.exec(query).all()
    return emotions

@router.get("/stats", response_model=EmotionStats)
async def get_emotion_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
    days: int = Query(7, ge=1, le=90)
) -> EmotionStats:
    """
    감정 통계 조회
    
    Query Parameters:
    - **days**: 조회할 일수 (기본값: 7일)
    """
    start_date = datetime.utcnow() - timedelta(days=days)
    
    emotions = db.exec(
        select(EmotionRecord)
        .where(EmotionRecord.user_id == current_user.id)
        .where(EmotionRecord.recorded_at >= start_date)
    ).all()
    
    if not emotions:
        return EmotionStats(
            average_level=0,
            total_records=0,
            emotion_distribution={},
            trend="stable"
        )
    
    # 통계 계산
    average_level = sum(e.emotion_level for e in emotions) / len(emotions)
    
    emotion_distribution = {}
    for emotion in emotions:
        emotion_distribution[emotion.emotion_type] = emotion_distribution.get(emotion.emotion_type, 0) + 1
    
    # 트렌드 분석 (간단한 로직)
    recent_half = emotions[:len(emotions)//2]
    older_half = emotions[len(emotions)//2:]
    
    recent_avg = sum(e.emotion_level for e in recent_half) / len(recent_half)
    older_avg = sum(e.emotion_level for e in older_half) / len(older_half)
    
    if recent_avg > older_avg + 0.5:
        trend = "improving"
    elif recent_avg < older_avg - 0.5:
        trend = "declining"
    else:
        trend = "stable"
    
    return EmotionStats(
        average_level=average_level,
        total_records=len(emotions),
        emotion_distribution=emotion_distribution,
        trend=trend
    )
```

### 5.3 Analytics API

```python
# app/api/analytics.py
from fastapi import APIRouter, Depends
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/dashboard", response_model=DashboardData)
async def get_dashboard_data(
    current_user: User = Depends(get_current_active_user),
    analytics_service: AnalyticsService = Depends(get_analytics_service)
) -> DashboardData:
    """
    대시보드 데이터 조회 (오늘 요약)
    
    Returns:
    - 오늘의 감정 평균
    - 오늘의 집중 시간
    - 오늘의 Todo 완료율
    - 최근 AI 피드백
    """
    return await analytics_service.get_dashboard_data(current_user.id)

@router.get("/weekly", response_model=WeeklyAnalytics)
async def get_weekly_analytics(
    current_user: User = Depends(get_current_active_user),
    analytics_service: AnalyticsService = Depends(get_analytics_service)
) -> WeeklyAnalytics:
    """
    주간 분석 데이터
    
    Returns:
    - 주간 감정 트렌드
    - 주간 집중 시간 통계
    - 주간 Todo 완료율
    - 일별 상세 데이터
    - AI 인사이트
    """
    return await analytics_service.get_weekly_summary(current_user.id)

@router.get("/monthly", response_model=MonthlyAnalytics)
async def get_monthly_analytics(
    current_user: User = Depends(get_current_active_user),
    analytics_service: AnalyticsService = Depends(get_analytics_service)
) -> MonthlyAnalytics:
    """월간 분석 데이터"""
    return await analytics_service.get_monthly_summary(current_user.id)
```

---

## 6. 서비스 레이어 구현

### 6.1 AI Service

```python
# app/services/ai_service.py
from transformers import pipeline
from openai import AsyncOpenAI
import asyncio
from typing import Dict, List

class AIService:
    """AI 기반 감정 분석 및 피드백 생성 서비스"""
    
    def __init__(self):
        # HuggingFace 감정 분석 모델 초기화
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-xlm-roberta-base-sentiment"
        )
        
        # OpenAI 클라이언트 초기화
        self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def analyze_sentiment(self, text: str) -> Dict:
        """
        텍스트 감정 분석
        
        Args:
            text: 분석할 텍스트
        
        Returns:
            {
                "sentiment": "positive" | "negative" | "neutral",
                "confidence": 0.0 ~ 1.0,
                "scores": {...}
            }
        """
        # 비동기 처리를 위해 별도 스레드에서 실행
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, self.sentiment_analyzer, text)
        
        sentiment_map = {
            "LABEL_0": "negative",
            "LABEL_1": "neutral",
            "LABEL_2": "positive"
        }
        
        return {
            "sentiment": sentiment_map.get(result[0]["label"], "neutral"),
            "confidence": result[0]["score"],
            "raw_result": result[0]
        }
    
    async def generate_daily_feedback(
        self,
        user_id: str,
        emotions: List[EmotionRecord],
        focus_sessions: List[FocusSession],
        todos: List[TodoItem]
    ) -> str:
        """
        일일 피드백 생성
        
        Args:
            user_id: 사용자 ID
            emotions: 오늘의 감정 기록
            focus_sessions: 오늘의 집중 세션
            todos: 오늘의 Todo 목록
        
        Returns:
            AI가 생성한 개인화된 피드백 텍스트
        """
        # 데이터 요약 생성
        summary = self._create_data_summary(emotions, focus_sessions, todos)
        
        # GPT 프롬프트 작성
        prompt = f"""
        당신은 ADHD 사용자를 위한 친절하고 공감적인 AI 코치입니다.
        다음 데이터를 바탕으로 사용자에게 오늘 하루에 대한 따뜻한 피드백을 작성해주세요.
        
        [오늘의 데이터]
        감정 기록: {summary['emotions']}
        총 집중 시간: {summary['focus_time']}분 ({summary['session_count']}개 세션)
        완료한 할 일: {summary['completed_todos']}/{summary['total_todos']}개
        
        [피드백 작성 가이드라인]
        1. 오늘의 성과를 구체적으로 인정하고 칭찬하기
        2. 감정과 생산성의 연관성 언급하기
        3. 내일을 위한 구체적이고 실행 가능한 제안 1-2가지
        4. 따뜻하고 격려하는 톤 유지
        5. 150-200자 내외로 작성
        
        피드백:
        """
        
        # GPT API 호출
        response = await self.openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.7
        )
        
        feedback_text = response.choices[0].message.content
        return feedback_text
    
    async def generate_weekly_insights(
        self,
        user_id: str,
        weekly_data: Dict
    ) -> List[str]:
        """
        주간 인사이트 생성
        
        Returns:
            인사이트 목록 (3-5개)
        """
        prompt = f"""
        다음은 사용자의 지난 주 데이터입니다:
        
        평균 감정 점수: {weekly_data['emotion_average']}/5
        총 집중 시간: {weekly_data['total_focus_minutes']}분
        Todo 완료율: {weekly_data['todo_completion_rate']*100}%
        가장 생산적이었던 날: {weekly_data['best_day']}
        
        이 데이터를 바탕으로 3-5개의 인사이트를 JSON 배열 형식으로 작성해주세요.
        각 인사이트는 구체적이고 실행 가능한 내용이어야 합니다.
        
        예시:
        ["이번 주는 지난 주보다 집중 시간이 20% 증가했습니다. 좋은 흐름을 유지하세요!",
         "화요일에 가장 생산적이었습니다. 중요한 일정을 화요일에 배치해보는 것은 어떨까요?",
         "저녁 시간대에 집중력이 높은 경향이 있습니다."]
        
        응답 (JSON 배열만):
        """
        
        response = await self.openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.8,
            response_format={"type": "json_object"}
        )
        
        # JSON 파싱
        import json
        insights = json.loads(response.choices[0].message.content)
        return insights.get("insights", [])
    
    def _create_data_summary(
        self,
        emotions: List[EmotionRecord],
        focus_sessions: List[FocusSession],
        todos: List[TodoItem]
    ) -> Dict:
        """데이터 요약 생성"""
        emotion_types = [e.emotion_type for e in emotions]
        emotion_levels = [e.emotion_level for e in emotions]
        
        return {
            "emotions": emotion_types,
            "emotion_average": sum(emotion_levels) / len(emotion_levels) if emotion_levels else 0,
            "focus_time": sum(s.duration_minutes for s in focus_sessions),
            "session_count": len(focus_sessions),
            "completed_todos": len([t for t in todos if t.completed]),
            "total_todos": len(todos)
        }
```

### 6.2 Analytics Service

```python
# app/services/analytics_service.py
from datetime import datetime, timedelta
from sqlmodel import Session, select, func
from typing import Dict, List
import uuid

class AnalyticsService:
    """데이터 분석 서비스"""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def get_dashboard_data(self, user_id: uuid.UUID) -> Dict:
        """대시보드 데이터 조회"""
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timedelta(days=1)
        
        # 오늘의 감정 기록
        emotions_today = self.db.exec(
            select(EmotionRecord)
            .where(EmotionRecord.user_id == user_id)
            .where(EmotionRecord.recorded_at >= today_start)
            .where(EmotionRecord.recorded_at < today_end)
        ).all()
        
        # 오늘의 집중 세션
        focus_today = self.db.exec(
            select(FocusSession)
            .where(FocusSession.user_id == user_id)
            .where(FocusSession.start_time >= today_start)
            .where(FocusSession.start_time < today_end)
        ).all()
        
        # 오늘의 Todo
        todos_today = self.db.exec(
            select(TodoItem)
            .where(TodoItem.user_id == user_id)
            .where(TodoItem.created_at >= today_start)
        ).all()
        
        # 최근 AI 피드백
        recent_feedback = self.db.exec(
            select(AIFeedback)
            .where(AIFeedback.user_id == user_id)
            .order_by(AIFeedback.generated_at.desc())
            .limit(1)
        ).first()
        
        return {
            "emotion_average": sum(e.emotion_level for e in emotions_today) / len(emotions_today) if emotions_today else 0,
            "total_focus_time": sum(s.duration_minutes for s in focus_today),
            "completed_todos": len([t for t in todos_today if t.completed]),
            "total_todos": len(todos_today),
            "recent_feedback": recent_feedback.feedback_text if recent_feedback else None
        }
    
    async def get_weekly_summary(self, user_id: uuid.UUID) -> Dict:
        """주간 요약 데이터"""
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=7)
        
        # 감정 데이터 집계
        emotions = await self._get_emotions_in_range(user_id, start_date, end_date)
        emotion_avg = sum(e.emotion_level for e in emotions) / len(emotions) if emotions else 0
        
        # 집중 시간 집계
        focus_sessions = await self._get_focus_sessions_in_range(user_id, start_date, end_date)
        total_focus_time = sum(s.duration_minutes for s in focus_sessions)
        
        # Todo 완료율
        todos = await self._get_todos_in_range(user_id, start_date, end_date)
        completion_rate = len([t for t in todos if t.completed]) / len(todos) if todos else 0
        
        # 일별 분해 데이터
        daily_breakdown = await self._get_daily_breakdown(user_id, start_date, end_date)
        
        # 가장 생산적이었던 날 찾기
        best_day = max(daily_breakdown, key=lambda x: x['focus_minutes']) if daily_breakdown else None
        
        return {
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "emotion_average": emotion_avg,
            "total_focus_minutes": total_focus_time,
            "todo_completion_rate": completion_rate,
            "daily_breakdown": daily_breakdown,
            "best_day": best_day['date'] if best_day else None
        }
    
    async def _get_daily_breakdown(
        self,
        user_id: uuid.UUID,
        start_date: datetime,
        end_date: datetime
    ) -> List[Dict]:
        """일별 데이터 분해"""
        daily_data = []
        current_date = start_date.date()
        
        while current_date <= end_date.date():
            day_start = datetime.combine(current_date, datetime.min.time())
            day_end = datetime.combine(current_date, datetime.max.time())
            
            emotions = await self._get_emotions_in_range(user_id, day_start, day_end)
            focus_sessions = await self._get_focus_sessions_in_range(user_id, day_start, day_end)
            
            daily_data.append({
                "date": current_date.isoformat(),
                "emotion_avg": sum(e.emotion_level for e in emotions) / len(emotions) if emotions else 0,
                "focus_minutes": sum(s.duration_minutes for s in focus_sessions),
                "session_count": len(focus_sessions)
            })
            
            current_date += timedelta(days=1)
        
        return daily_data
    
    async def _get_emotions_in_range(
        self,
        user_id: uuid.UUID,
        start_date: datetime,
        end_date: datetime
    ) -> List[EmotionRecord]:
        """기간 내 감정 기록 조회"""
        return self.db.exec(
            select(EmotionRecord)
            .where(EmotionRecord.user_id == user_id)
            .where(EmotionRecord.recorded_at >= start_date)
            .where(EmotionRecord.recorded_at <= end_date)
        ).all()
    
    async def _get_focus_sessions_in_range(
        self,
        user_id: uuid.UUID,
        start_date: datetime,
        end_date: datetime
    ) -> List[FocusSession]:
        """기간 내 집중 세션 조회"""
        return self.db.exec(
            select(FocusSession)
            .where(FocusSession.user_id == user_id)
            .where(FocusSession.start_time >= start_date)
            .where(FocusSession.start_time <= end_date)
        ).all()
    
    async def _get_todos_in_range(
        self,
        user_id: uuid.UUID,
        start_date: datetime,
        end_date: datetime
    ) -> List[TodoItem]:
        """기간 내 Todo 조회"""
        return self.db.exec(
            select(TodoItem)
            .where(TodoItem.user_id == user_id)
            .where(TodoItem.created_at >= start_date)
            .where(TodoItem.created_at <= end_date)
        ).all()
```

---

## 7. 보안 구현

### 7.1 Security Core

```python
# app/core/security.py
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

# 비밀번호 해싱 설정
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """비밀번호 검증"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """비밀번호 해싱"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """액세스 토큰 생성"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    """리프레시 토큰 생성"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt

def decode_token(token: str) -> dict:
    """토큰 디코딩 및 검증"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
```

### 7.2 Dependencies

```python
# app/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from app.database import get_session
from app.core.security import decode_token
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_session)
) -> User:
    """현재 인증된 사용자 가져오기"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    token_type: str = payload.get("type")
    
    if user_id is None or token_type != "access":
        raise credentials_exception
    
    user = db.get(User, user_id)
    if user is None:
        raise credentials_exception
    
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """활성 사용자 확인"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
```

---

## 8. 테스트 전략

### 8.1 Unit Tests

```python
# tests/test_ai_service.py
import pytest
from app.services.ai_service import AIService

@pytest.mark.asyncio
async def test_sentiment_analysis():
    """감정 분석 테스트"""
    ai_service = AIService()
    result = await ai_service.analyze_sentiment("오늘 기분이 정말 좋아요!")
    
    assert "sentiment" in result
    assert "confidence" in result
    assert result["sentiment"] in ["positive", "negative", "neutral"]
    assert 0 <= result["confidence"] <= 1

@pytest.mark.asyncio
async def test_generate_daily_feedback():
    """일일 피드백 생성 테스트"""
    ai_service = AIService()
    
    # Mock 데이터
    emotions = []  # EmotionRecord 목 데이터
    focus_sessions = []  # FocusSession 목 데이터
    todos = []  # TodoItem 목 데이터
    
    feedback = await ai_service.generate_daily_feedback(
        user_id="test-user-id",
        emotions=emotions,
        focus_sessions=focus_sessions,
        todos=todos
    )
    
    assert isinstance(feedback, str)
    assert len(feedback) > 0
```

### 8.2 Integration Tests

```python
# tests/test_api.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_emotion_record():
    """감정 기록 생성 API 테스트"""
    # 로그인
    login_response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "testpass123"}
    )
    token = login_response.json()["access_token"]
    
    # 감정 기록 생성
    response = client.post(
        "/api/emotions/",
        json={
            "emotion_level": 4,
            "emotion_type": "happy",
            "note": "프로젝트 완료해서 기분이 좋아요!"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["emotion_level"] == 4
    assert data["emotion_type"] == "happy"
    assert "ai_analysis" in data

def test_get_weekly_analytics():
    """주간 분석 API 테스트"""
    # 로그인
    login_response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "testpass123"}
    )
    token = login_response.json()["access_token"]
    
    # 주간 분석 조회
    response = client.get(
        "/api/analytics/weekly",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "period" in data
    assert "emotion_average" in data
    assert "total_focus_minutes" in data
    assert "daily_breakdown" in data
```

---

## 9. 배포 설정

### 9.1 Dockerfile

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY ./app ./app

# 비루트 사용자 생성
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app
USER appuser

# 헬스체크
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 9.2 환경 설정

```python
# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # 애플리케이션
    APP_NAME: str = "ADHD Helper API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # 보안
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # 데이터베이스
    DATABASE_URL: Optional[str] = None
    
    # AI 서비스
    OPENAI_API_KEY: str
    HUGGINGFACE_API_KEY: Optional[str] = None
    
    # Redis
    REDIS_URL: Optional[str] = None
    
    # CORS
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://adhd-helper.vercel.app"
    ]
    
    # Sentry
    SENTRY_DSN: Optional[str] = None
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
```

---

## 10. 모니터링 및 로깅

### 10.1 Logging Setup

```python
# app/core/logging.py
import logging
import sys
from app.config import settings

def setup_logging():
    """로깅 설정"""
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO
    
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # 외부 라이브러리 로그 레벨 조정
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("sqlalchemy").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)
```

### 10.2 Sentry Integration

```python
# app/core/sentry.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from app.config import settings

def setup_sentry():
    """Sentry 초기화"""
    if settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.ENVIRONMENT,
            integrations=[
                FastApiIntegration(auto_enabling_integrations=False),
                SqlalchemyIntegration(),
            ],
            traces_sample_rate=1.0 if settings.ENVIRONMENT == "development" else 0.1,
            profiles_sample_rate=1.0 if settings.ENVIRONMENT == "development" else 0.1,
        )
```

---

## 11. 성능 최적화

### 11.1 Database Optimization

```python
# 인덱스 최적화
CREATE INDEX idx_emotion_user_date ON emotion_records(user_id, recorded_at);
CREATE INDEX idx_focus_user_start ON focus_sessions(user_id, start_time);
CREATE INDEX idx_todo_user_completed ON todo_items(user_id, completed);

# 쿼리 최적화 예시
from sqlmodel import select

# 비효율적
users = db.exec(select(User)).all()
for user in users:
    emotions = db.exec(select(EmotionRecord).where(EmotionRecord.user_id == user.id)).all()

# 효율적 (N+1 문제 해결)
from sqlalchemy.orm import selectinload

users = db.exec(
    select(User).options(selectinload(User.emotion_records))
).all()
```

### 11.2 Caching Strategy

```python
# app/core/cache.py
import redis
from functools import wraps
import json
import hashlib
from app.config import settings

redis_client = redis.from_url(settings.REDIS_URL) if settings.REDIS_URL else None

def cache_result(expire_time: int = 300):
    """결과 캐싱 데코레이터"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if not redis_client:
                return await func(*args, **kwargs)
            
            # 캐시 키 생성
            cache_key = f"{func.__name__}:{hashlib.md5(str(args + tuple(kwargs.items())).encode()).hexdigest()}"
            
            # 캐시에서 확인
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return json.loads(cached_result)
            
            # 함수 실행 및 캐싱
            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, expire_time, json.dumps(result, default=str))
            
            return result
        return wrapper
    return decorator

# 사용 예시
@cache_result(expire_time=600)  # 10분 캐싱
async def get_user_statistics(user_id: str) -> dict:
    # 통계 계산 로직
    pass
```

---

## 12. 결론

이 백엔드 설계서는 ADHD 도우미 애플리케이션의 서버 사이드 구현을 위한 포괄적인 가이드를 제공합니다.

### 주요 특징
1. **모던 Python 스택**: FastAPI + SQLModel로 빠르고 안전한 개발
2. **AI 통합**: HuggingFace와 OpenAI를 활용한 지능형 피드백
3. **확장성**: 마이크로서비스로의 전환 가능한 구조
4. **보안**: JWT 인증, 데이터 암호화, HTTPS 적용
5. **모니터링**: Sentry를 통한 에러 추적 및 성능 모니터링

### 다음 단계
1. 개발 환경 구축
2. 데이터베이스 마이그레이션 실행
3. API 엔드포인트 구현
4. 테스트 작성
5. CI/CD 파이프라인 구축
6. 운영 환경 배포

---

**문서 종료**
