# ADHD 도우미 프로젝트 종합 설계서

## 📋 문서 정보
- **프로젝트명**: ADHD Helper (ADHD 도우미)
- **버전**: 1.0.0
- **작성일**: 2025년 10월 21일
- **문서 타입**: 프로젝트 설계서 (Master Document)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 목적
ADHD(주의력 결핍 과잉행동 장애)를 가진 사용자들의 일상 관리를 돕기 위한 웹 기반 도우미 애플리케이션입니다. 감정 기록, 집중력 추적, AI 기반 피드백을 통해 사용자의 자기 관리 능력을 향상시키는 것을 목표로 합니다.

### 1.2 핵심 기능
1. **감정 기록 시스템**
   - 5단계 감정 레벨 선택 (1-5)
   - 감정 타입 분류 (happy, sad, anxious, calm, excited)
   - 텍스트 메모 작성
   - AI 기반 감정 분석

2. **집중력 추적**
   - 포모도로 타이머 (25분 집중 + 5분 휴식)
   - Deep Work 세션 지원
   - 생산성 평가 (1-5)
   - 자동 시간 기록

3. **할 일 관리**
   - Todo 생성/수정/삭제
   - 우선순위 설정 (1-5)
   - 완료율 추적
   - 마감일 알림

4. **AI 피드백 시스템**
   - HuggingFace 감정 분석
   - OpenAI GPT 기반 개인화 코멘트
   - 일일/주간 리포트 생성
   - 패턴 분석 및 개선 제안

5. **데이터 분석 및 시각화**
   - 주간/월간 트렌드 차트
   - 감정-집중력 상관관계 분석
   - 성과 지표 대시보드
   - 인사이트 제공

### 1.3 타겟 사용자
- **주요 사용자**: ADHD 진단을 받은 성인 및 청소년
- **부차적 사용자**: ADHD 증상이 있으나 미진단된 사용자
- **보조 사용자**: 멘탈 헬스 관리에 관심 있는 일반 사용자

---

## 2. 시스템 아키텍처

### 2.1 전체 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React 18 + TypeScript + Vite                            │   │
│  │  - UI Components (shadcn/ui + Tailwind CSS)             │   │
│  │  - State Management (Zustand + React Query)             │   │
│  │  - Charts (Chart.js)                                     │   │
│  │  - PWA Support                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTPS/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  FastAPI (Python 3.11+)                                  │   │
│  │  - RESTful API Endpoints                                 │   │
│  │  - JWT Authentication                                    │   │
│  │  - Request Validation (Pydantic)                        │   │
│  │  - Auto-generated Documentation (Swagger)               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  User Service    │  │ Analytics Service│  │  AI Service  │ │
│  │  - Auth          │  │ - Data Aggregation│  │ - Sentiment  │ │
│  │  - Profile Mgmt  │  │ - Trend Analysis │  │   Analysis   │ │
│  └──────────────────┘  └──────────────────┘  │ - Feedback   │ │
│                                                │   Generation │ │
│  ┌──────────────────┐  ┌──────────────────┐  └──────────────┘ │
│  │ Emotion Service  │  │  Focus Service   │                    │
│  │ - CRUD           │  │ - Timer Logic    │                    │
│  │ - Stats          │  │ - Session Mgmt   │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Data Access Layer                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  SQLModel (SQLAlchemy 2.0 based ORM)                    │   │
│  │  - Models & Schemas                                      │   │
│  │  - Database Sessions                                     │   │
│  │  - Query Optimization                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Database Layer                             │
│  ┌──────────────────────┐        ┌──────────────────────┐      │
│  │  PostgreSQL          │        │  Redis (Cache)       │      │
│  │  - User Data         │        │  - Session Cache     │      │
│  │  - Emotion Records   │        │  - API Cache         │      │
│  │  - Focus Sessions    │        └──────────────────────┘      │
│  │  - Todo Items        │                                        │
│  │  - AI Feedbacks      │                                        │
│  └──────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  OpenAI GPT  │  │ HuggingFace  │  │   Sentry     │          │
│  │  - Feedback  │  │ - Sentiment  │  │ - Monitoring │          │
│  │  Generation  │  │   Analysis   │  │ - Error Log  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 기술 스택 상세

#### Frontend Stack
| 카테고리 | 기술 | 버전 | 용도 |
|---------|-----|------|-----|
| Framework | React | 18+ | UI 라이브러리 |
| Language | TypeScript | 5.0+ | 타입 안전성 |
| Build Tool | Vite | 5.0+ | 빌드 및 개발 서버 |
| Styling | Tailwind CSS | 3.4+ | 유틸리티 CSS |
| UI Library | shadcn/ui | Latest | 컴포넌트 라이브러리 |
| State Mgmt | Zustand | 4.5+ | 전역 상태 관리 |
| Data Fetching | React Query | 5.0+ | 서버 상태 관리 |
| Routing | React Router | 6+ | 클라이언트 라우팅 |
| Forms | React Hook Form | 7+ | 폼 관리 |
| Validation | Zod | 3+ | 스키마 검증 |
| Charts | Chart.js | 4+ | 데이터 시각화 |
| HTTP Client | Axios | 1.6+ | API 통신 |
| Testing | Vitest | Latest | 단위 테스트 |
| PWA | Vite PWA | Latest | 오프라인 지원 |

#### Backend Stack
| 카테고리 | 기술 | 버전 | 용도 |
|---------|-----|------|-----|
| Framework | FastAPI | 0.104+ | REST API 서버 |
| Language | Python | 3.11+ | 백엔드 로직 |
| ORM | SQLModel | 0.0.14+ | 데이터베이스 ORM |
| Validation | Pydantic | 2.0+ | 데이터 검증 |
| Auth | JWT + OAuth2 | - | 인증/인가 |
| Database | PostgreSQL | 15+ | 관계형 DB |
| Cache | Redis | 7+ | 캐싱 |
| Migration | Alembic | 1.13+ | DB 마이그레이션 |
| Testing | pytest | 8+ | 단위/통합 테스트 |
| AI - NLP | HuggingFace | Latest | 감정 분석 |
| AI - GPT | OpenAI API | 1.0+ | 피드백 생성 |

#### DevOps & Deployment
| 카테고리 | 기술 | 용도 |
|---------|-----|-----|
| Frontend Host | Vercel | 프론트엔드 배포 |
| Backend Host | Render | 백엔드 배포 |
| Database | Render PostgreSQL | 데이터베이스 호스팅 |
| Cache | Upstash Redis | Redis 호스팅 |
| CI/CD | GitHub Actions | 자동화 배포 |
| Monitoring | Sentry | 에러 추적 |
| Analytics | Vercel Analytics | 사용자 분석 |
| Container | Docker | 컨테이너화 |

---

## 3. 데이터베이스 설계

### 3.1 ER 다이어그램

```
┌─────────────────────────────────────────┐
│              users                       │
├─────────────────────────────────────────┤
│ PK  id: UUID                             │
│ UQ  email: VARCHAR(255)                  │
│     name: VARCHAR(100)                   │
│     hashed_password: VARCHAR(255)        │
│     timezone: VARCHAR(50)                │
│     settings: JSONB                      │
│     is_active: BOOLEAN                   │
│     created_at: TIMESTAMP                │
│     updated_at: TIMESTAMP                │
└─────────────────────────────────────────┘
                   │
                   │ 1:N
      ┌────────────┼────────────────┬──────────────┐
      │            │                │              │
      ▼            ▼                ▼              ▼
┌──────────┐ ┌──────────┐  ┌──────────────┐ ┌──────────┐
│ emotion_ │ │  focus_  │  │  todo_items  │ │   ai_    │
│ records  │ │ sessions │  │              │ │feedbacks │
└──────────┘ └──────────┘  └──────────────┘ └──────────┘
```

### 3.2 테이블 상세 명세

#### users 테이블
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### emotion_records 테이블
```sql
CREATE TABLE emotion_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emotion_level INTEGER NOT NULL CHECK (emotion_level >= 1 AND emotion_level <= 5),
    emotion_type VARCHAR(50) NOT NULL,
    note TEXT,
    ai_analysis JSONB DEFAULT '{}',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emotion_user_date ON emotion_records(user_id, recorded_at);
CREATE INDEX idx_emotion_level ON emotion_records(emotion_level);
CREATE INDEX idx_emotion_type ON emotion_records(emotion_type);
```

#### focus_sessions 테이블
```sql
CREATE TABLE focus_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 0),
    session_type VARCHAR(20) DEFAULT 'pomodoro',
    productivity_rating INTEGER CHECK (productivity_rating >= 1 AND productivity_rating <= 5),
    notes TEXT
);

CREATE INDEX idx_focus_user_start ON focus_sessions(user_id, start_time);
CREATE INDEX idx_focus_type ON focus_sessions(session_type);
```

#### todo_items 테이블
```sql
CREATE TABLE todo_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_todo_user_created ON todo_items(user_id, created_at);
CREATE INDEX idx_todo_completed ON todo_items(completed);
CREATE INDEX idx_todo_due_date ON todo_items(due_date);
```

#### ai_feedbacks 테이블
```sql
CREATE TABLE ai_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    feedback_text TEXT NOT NULL,
    feedback_type VARCHAR(50) DEFAULT 'daily_summary',
    data_sources JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_user_generated ON ai_feedbacks(user_id, generated_at);
CREATE INDEX idx_feedback_type ON ai_feedbacks(feedback_type);
```

---

## 4. API 설계

### 4.1 API 엔드포인트 명세

#### Authentication API
```
POST   /api/auth/register           사용자 등록
POST   /api/auth/login              로그인 (JWT 발급)
POST   /api/auth/refresh            토큰 갱신
POST   /api/auth/logout             로그아웃
GET    /api/auth/me                 현재 사용자 정보
```

#### Users API
```
GET    /api/users/me                프로필 조회
PUT    /api/users/me                프로필 수정
DELETE /api/users/me                계정 삭제
PUT    /api/users/me/settings       설정 업데이트
```

#### Emotions API
```
POST   /api/emotions                감정 기록 생성
GET    /api/emotions                감정 기록 목록 조회
GET    /api/emotions/{id}           특정 감정 기록 조회
PUT    /api/emotions/{id}           감정 기록 수정
DELETE /api/emotions/{id}           감정 기록 삭제
GET    /api/emotions/stats          감정 통계
```

#### Focus Sessions API
```
POST   /api/focus-sessions          세션 시작
PUT    /api/focus-sessions/{id}/end 세션 종료
GET    /api/focus-sessions          세션 목록 조회
GET    /api/focus-sessions/{id}     특정 세션 조회
DELETE /api/focus-sessions/{id}     세션 삭제
GET    /api/focus-sessions/stats    집중 통계
GET    /api/focus-sessions/active   활성 세션 조회
```

#### Todos API
```
POST   /api/todos                   Todo 생성
GET    /api/todos                   Todo 목록 조회
GET    /api/todos/{id}              특정 Todo 조회
PUT    /api/todos/{id}              Todo 수정
DELETE /api/todos/{id}              Todo 삭제
PUT    /api/todos/{id}/complete     Todo 완료 처리
GET    /api/todos/stats             Todo 통계
```

#### Analytics API
```
GET    /api/analytics/dashboard     대시보드 데이터
GET    /api/analytics/weekly        주간 분석
GET    /api/analytics/monthly       월간 분석
GET    /api/analytics/trends        트렌드 분석
GET    /api/analytics/insights      AI 인사이트
```

#### AI API
```
POST   /api/ai/analyze-emotion      감정 분석
POST   /api/ai/generate-feedback    피드백 생성
GET    /api/ai/feedbacks            피드백 히스토리
```

### 4.2 API 요청/응답 예시

#### 감정 기록 생성
```json
// POST /api/emotions
// Request
{
  "emotion_level": 4,
  "emotion_type": "happy",
  "note": "프로젝트 완료해서 기분이 좋아요!",
  "recorded_at": "2025-10-21T14:30:00Z"
}

// Response (201 Created)
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "emotion_level": 4,
  "emotion_type": "happy",
  "note": "프로젝트 완료해서 기분이 좋아요!",
  "ai_analysis": {
    "sentiment": "positive",
    "confidence": 0.92,
    "keywords": ["프로젝트", "완료", "기분", "좋다"]
  },
  "recorded_at": "2025-10-21T14:30:00Z"
}
```

#### 주간 분석 조회
```json
// GET /api/analytics/weekly
// Response (200 OK)
{
  "period": {
    "start": "2025-10-14T00:00:00Z",
    "end": "2025-10-21T23:59:59Z"
  },
  "emotion_average": 3.7,
  "total_focus_minutes": 840,
  "todo_completion_rate": 0.75,
  "daily_breakdown": [
    {
      "date": "2025-10-14",
      "emotion_avg": 3.5,
      "focus_minutes": 120,
      "session_count": 5
    }
    // ... 나머지 요일
  ],
  "insights": [
    "이번 주는 지난 주보다 집중 시간이 20% 증가했습니다.",
    "화요일에 가장 생산적이었습니다.",
    "저녁 시간대 집중력이 높은 경향이 있습니다."
  ]
}
```

---

## 5. 사용자 플로우

### 5.1 핵심 사용자 여정

#### 신규 사용자 온보딩
```
1. 랜딩 페이지 접속
   ↓
2. 회원가입 (이메일/비밀번호)
   ↓
3. 초기 설정 (타임존, 알림 설정)
   ↓
4. 튜토리얼 (기능 소개)
   ↓
5. 첫 감정 기록 작성
   ↓
6. AI 피드백 확인
   ↓
7. 대시보드 탐색
```

#### 일일 사용 패턴
```
1. 앱 접속 (모닝 루틴)
   ↓
2. 오늘의 감정 기록
   - 감정 선택 (이모지 5단계)
   - 간단한 메모 작성
   - AI 분석 결과 확인
   ↓
3. 하루 일정 확인
   - Todo 리스트 검토
   - 우선순위 조정
   ↓
4. 집중 세션 시작
   - 포모도로 타이머 설정
   - 25분 집중 작업
   - 5분 휴식
   - 생산성 평가
   ↓
5. Todo 완료 체크
   ↓
6. 저녁 감정 기록
   ↓
7. 일일 요약 확인
   - AI 피드백 읽기
   - 오늘의 성과 확인
```

#### 주간 리뷰 패턴
```
1. 분석 탭 접근
   ↓
2. 주간 트렌드 확인
   - 감정 변화 차트
   - 집중 시간 그래프
   - Todo 완료율
   ↓
3. 패턴 분석
   - 가장 생산적인 요일/시간
   - 감정-집중력 상관관계
   ↓
4. AI 인사이트 확인
   - 개선 제안
   - 칭찬 포인트
   ↓
5. 다음 주 목표 설정
```

### 5.2 화면 플로우 다이어그램

```
[로그인] ──────────────────► [대시보드]
    │                           │
    │                           ├─► [감정 기록]
    │                           │    └─► [AI 피드백]
    │                           │
    │                           ├─► [집중 타이머]
    │                           │    ├─► [포모도로]
    │                           │    └─► [세션 기록]
    │                           │
    │                           ├─► [할 일]
    │                           │    ├─► [생성/수정]
    │                           │    └─► [완료 처리]
    │                           │
    │                           ├─► [분석]
    │                           │    ├─► [주간 리포트]
    │                           │    ├─► [월간 리포트]
    │                           │    └─► [인사이트]
    │                           │
    │                           └─► [설정]
    │                                ├─► [프로필]
    │                                ├─► [알림]
    │                                └─► [테마]
    │
    └─[회원가입] ───► [온보딩] ───► [대시보드]
```

---

## 6. 개발 로드맵

### 6.1 Phase 1: MVP 개발 (주 1-2)

#### Week 1: 기본 인프라 구축
- [x] 프로젝트 초기 설정
- [x] 개발 환경 구성
- [ ] 데이터베이스 스키마 설계 및 생성
- [ ] 기본 API 구조 구축
- [ ] 프론트엔드 프로젝트 세팅

#### Week 2: 핵심 기능 구현
- [ ] 사용자 인증 시스템
- [ ] 감정 기록 CRUD
- [ ] 기본 대시보드
- [ ] 간단한 데이터 시각화

### 6.2 Phase 2: 기능 확장 (주 3-4)

#### Week 3: AI 통합
- [ ] HuggingFace 감정 분석 통합
- [ ] OpenAI GPT 피드백 생성
- [ ] AI 서비스 최적화

#### Week 4: 고급 기능
- [ ] 포모도로 타이머
- [ ] Todo 관리 시스템
- [ ] 주간/월간 분석 리포트

### 6.3 Phase 3: UX 개선 및 테스트 (주 5-6)

#### Week 5: UI/UX 개선
- [ ] 반응형 디자인 최적화
- [ ] PWA 기능 구현
- [ ] 접근성 개선
- [ ] 다크 모드 지원

#### Week 6: 테스트 및 최적화
- [ ] 단위 테스트 작성
- [ ] 통합 테스트
- [ ] 성능 최적화
- [ ] 버그 수정

### 6.4 Phase 4: 배포 및 운영 (주 7)

#### Week 7: 배포
- [ ] CI/CD 파이프라인 구축
- [ ] 스테이징 환경 배포
- [ ] 운영 환경 배포
- [ ] 모니터링 시스템 구축

---

## 7. 보안 고려사항

### 7.1 데이터 보안
1. **암호화**
   - 비밀번호: bcrypt 해싱 (최소 10 라운드)
   - 전송 데이터: HTTPS/TLS 1.3
   - 저장 데이터: 데이터베이스 암호화

2. **인증/인가**
   - JWT 토큰 기반 인증
   - Access Token: 30분 유효
   - Refresh Token: 7일 유효
   - CORS 정책 적용

3. **개인정보 보호**
   - GDPR 준수
   - 개인정보 처리방침 명시
   - 데이터 삭제 권한 제공
   - 익명화된 분석 데이터만 수집

### 7.2 보안 헤더
```python
# 필수 보안 헤더
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

---

## 8. 성능 최적화

### 8.1 프론트엔드 최적화
1. **코드 스플리팅**
   - 라우트 기반 코드 스플리팅
   - 컴포넌트 Lazy Loading
   - 벤더 청크 분리

2. **이미지 최적화**
   - WebP 포맷 사용
   - Lazy Loading
   - 반응형 이미지

3. **캐싱 전략**
   - Service Worker 활용
   - API 응답 캐싱 (React Query)
   - 브라우저 캐싱

### 8.2 백엔드 최적화
1. **데이터베이스 최적화**
   - 인덱스 최적화
   - 쿼리 최적화
   - Connection Pooling

2. **API 최적화**
   - Redis 캐싱
   - 응답 압축 (gzip)
   - API Rate Limiting

3. **AI API 최적화**
   - 응답 캐싱
   - 배치 처리
   - 비동기 처리

---

## 9. 테스트 전략

### 9.1 테스트 레벨
1. **단위 테스트 (Unit Test)**
   - 커버리지 목표: 80% 이상
   - 도구: pytest (Backend), Vitest (Frontend)

2. **통합 테스트 (Integration Test)**
   - API 엔드포인트 테스트
   - 데이터베이스 연동 테스트

3. **E2E 테스트**
   - 주요 사용자 플로우 테스트
   - 도구: Playwright

### 9.2 테스트 시나리오
```typescript
// 예시: 감정 기록 테스트
describe('Emotion Recording', () => {
  it('should create emotion record', async () => {
    // Given: 로그인된 사용자
    // When: 감정 기록 생성
    // Then: 성공 응답 및 DB 저장 확인
  });

  it('should validate emotion level', async () => {
    // Given: 잘못된 감정 레벨 (0 또는 6)
    // When: 감정 기록 생성 시도
    // Then: 유효성 검증 에러 발생
  });
});
```

---

## 10. 운영 및 유지보수

### 10.1 모니터링
1. **에러 추적**: Sentry
2. **성능 모니터링**: Vercel Analytics
3. **로그 관리**: CloudWatch / Render Logs
4. **헬스 체크**: `/health` 엔드포인트

### 10.2 백업 전략
1. **데이터베이스 백업**
   - 일일 자동 백업
   - 7일치 백업 보관
   - S3 원격 저장

2. **재해 복구**
   - RTO (Recovery Time Objective): 1시간
   - RPO (Recovery Point Objective): 24시간

### 10.3 유지보수 계획
1. **정기 업데이트**
   - 보안 패치: 즉시
   - 의존성 업데이트: 월 1회
   - 기능 업데이트: 월 2회

2. **성능 리뷰**
   - 주간 성능 지표 확인
   - 월간 최적화 작업

---

## 11. 향후 확장 계획

### 11.1 단기 확장 (3-6개월)
- [ ] 모바일 앱 (React Native)
- [ ] 소셜 로그인 (Google, Apple)
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 커뮤니티 기능

### 11.2 중기 확장 (6-12개월)
- [ ] 웨어러블 기기 연동 (Apple Watch, Fitbit)
- [ ] 음성 기록 기능
- [ ] 전문가 상담 연결
- [ ] 프리미엄 기능 (AI 심화 분석)

### 11.3 장기 확장 (12개월+)
- [ ] 의료진 협업 플랫폼
- [ ] B2B 서비스 (기업 멘탈 헬스)
- [ ] 연구 데이터 제공 (익명화)
- [ ] 맞춤형 치료 프로그램

---

## 12. 리스크 관리

### 12.1 기술적 리스크
| 리스크 | 영향도 | 완화 전략 |
|-------|--------|----------|
| AI API 비용 증가 | 높음 | 캐싱, 사용량 제한, 로컬 모델 대체 |
| 데이터베이스 성능 저하 | 중간 | 쿼리 최적화, 인덱싱, 읽기 복제본 |
| 서드파티 API 장애 | 중간 | Fallback 메커니즘, 재시도 로직 |
| 보안 취약점 | 높음 | 정기 보안 감사, 의존성 업데이트 |

### 12.2 비즈니스 리스크
| 리스크 | 영향도 | 완화 전략 |
|-------|--------|----------|
| 사용자 확보 어려움 | 높음 | MVP 빠른 출시, 사용자 피드백 반영 |
| 경쟁 서비스 등장 | 중간 | 차별화된 AI 기능, 빠른 기능 추가 |
| 의료 규제 문제 | 중간 | 법률 자문, 명확한 면책 조항 |
| 수익화 실패 | 높음 | 다양한 수익 모델 테스트 |

---

## 13. 성공 지표 (KPI)

### 13.1 사용자 지표
- **DAU (Daily Active Users)**: 일일 활성 사용자
- **MAU (Monthly Active Users)**: 월간 활성 사용자
- **Retention Rate**: 7일/30일 재방문율
- **Churn Rate**: 이탈률

### 13.2 참여도 지표
- **감정 기록 빈도**: 사용자당 주간 평균 기록 수
- **세션 길이**: 평균 사용 시간
- **기능 사용률**: 각 기능별 사용 비율
- **AI 피드백 읽기율**: 생성된 피드백 조회율

### 13.3 기술 지표
- **API 응답 시간**: P95 < 500ms
- **에러율**: < 0.1%
- **가동률**: > 99.9%
- **페이지 로드 시간**: < 2초

---

## 14. 팀 구성 및 역할

### 14.1 개발 팀
- **풀스택 개발자 (1명)**: 전체 개발 담당
- **또는 분리된 역할**:
  - Frontend Developer (1명)
  - Backend Developer (1명)

### 14.2 협력 역할 (외부)
- **UI/UX 디자이너**: 디자인 시스템, 사용자 경험
- **AI/ML 전문가**: 모델 최적화, 정확도 개선
- **의료/심리 자문**: 전문성 검증, 기능 자문

---

## 15. 결론

ADHD 도우미 프로젝트는 사용자 중심의 설계와 최신 기술 스택을 활용하여 ADHD 사용자들의 일상 관리를 효과적으로 지원하는 플랫폼입니다.

### 15.1 핵심 강점
1. **간단하고 직관적인 UI**: 3분 이내 완료 가능한 기록 과정
2. **AI 기반 개인화**: 사용자별 맞춤 피드백 및 분석
3. **확장 가능한 아키텍처**: 마이크로서비스로의 전환 가능
4. **모바일 최적화**: PWA를 통한 앱과 같은 경험

### 15.2 차별화 요소
1. **ADHD 특화**: 일반 생산성 앱과 달리 ADHD 증상을 고려한 설계
2. **AI 피드백**: 단순 데이터 수집이 아닌 의미 있는 인사이트 제공
3. **과학적 접근**: 포모도로 기법 등 검증된 방법론 적용
4. **프라이버시 중시**: 개인 데이터 보호 및 투명한 정책

### 15.3 향후 비전
ADHD 도우미는 단순한 개인 생산성 도구를 넘어, ADHD 커뮤니티를 위한 종합 플랫폼으로 성장할 것입니다. 의료진과의 협업, 연구 데이터 제공, 웨어러블 기기 연동 등을 통해 ADHD 관리의 새로운 표준을 제시하고자 합니다.

---

## 부록

### A. 참고 문서
- FastAPI 공식 문서: https://fastapi.tiangolo.com/
- React 공식 문서: https://react.dev/
- SQLModel 문서: https://sqlmodel.tiangolo.com/
- Tailwind CSS 문서: https://tailwindcss.com/

### B. 용어 정의
- **ADHD**: Attention Deficit Hyperactivity Disorder (주의력 결핍 과잉행동 장애)
- **포모도로**: 25분 집중 + 5분 휴식 기법
- **PWA**: Progressive Web App (프로그레시브 웹 앱)
- **JWT**: JSON Web Token
- **ORM**: Object-Relational Mapping

### C. 변경 이력
| 버전 | 날짜 | 변경 내용 | 작성자 |
|-----|------|----------|--------|
| 1.0.0 | 2025-10-21 | 초기 문서 작성 | - |

---

**문서 종료**
