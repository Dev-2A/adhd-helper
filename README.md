# ADHD Helper - ADHD 도우미

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://www.python.org/)

ADHD(주의력 결핌 과잉행동 장애)를 가진 사용자들의 일상 관리를 돕는 웹 기반 애플리케이션입니다.

## 📌 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [API 문서](#-api-문서)
- [개발 현황](#-개발-현황)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

## ✨ 주요 기능

### 📊 감정 기록 및 분석
- 5단계 감정 레벨 선택 (1-5)
- 7가지 감정 타입 분류 (happy, sad, anxious, calm, excited, angry, neutral)
- 메모 작성 기능
- 일간/주간/월간 감정 통계
- AI 기반 감정 분석 (예정)

### ⏱ 포모도로 타이머 & 집중력 관리
- 25분 집중 + 5분 휴식 사이클
- Deep Work 세션 지원
- 생산성 평가 (1-5 스케일)
- 집중 시간 자동 추적
- 세션별 메모 기능

### ✅ 스마트 할 일 관리
- 우선순위 설정 (1-5 레벨)
- 마감일 설정 및 알림
- 완료일 추적
- 카테고리별 정리

### 🤖 AI 피드백 시스템 (개발 예정)
- HuggingFace 감정 분석
- OpenAI GPT 기반 개인화 피드백
- 일일/주간 리포트 생성
- 패턴 분석 및 개선 제안

### 📈 데이터 시각화 & 인사이트
- 감정 변화 트렌드 차트
- 집중력 패턴 분석
- 할 일 완료율 통계
- 주간/월간 종합 리포트

## 🛠 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Date**: date-fns

### Backend
- **Framework**: FastAPI 0.104
- **Language**: Python 3.11+
- **ORM**: SQLModel (SQLAlchemy 2.0 기반)
- **Database**:
  - Development: SQLite
  - Production: PostgreSQL 15+
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt
- **Validation**: Pydantic 2.0
- **CORS**: FastAPI Middleware

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Code Quality**:
  - Frontend: ESLint + Prettier
  - Backend: Black + isort + pylint
- **Testing**:
  - Frontend: Vitest
  - Backend: pytest
- **API Documentation**: Swagger/OpenAPI (자동 생성)

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+
- Python 3.11+
- Git

### 설치 및 실행

#### 1. 저장소 클론
```bash
git clone https://github.com/Dev-2A/adhd-helper.git
cd adhd-helper
```

#### 2. Backend 설정
```bash
# Backend 디렉토리로 이동
cd backend

# 가상환경 생성 및 활성화 (Windows)
python -m venv venv
venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
copy .env.example .env

# 개발 서버 실행
uvicorn app.main:app --reload --port 8000
```

Backend는 `http://localhost:8000`에서 실행됩니다.
- API 문서: `http://localhost:8000/docs`
- 대체 문서: `http://localhost:8000/redoc`

#### 3. Frontend 설정
```bash
# 새 터미널에서 Frontend 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 환경 변수 설정
copy .env.example .env.local

# 개발 서버 실행
npm run dev
```

Frontend는 `http://localhost:3000`에서 실행됩니다.

## 📁 프로젝트 구조
```
adhd-helper/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # 재사용 가능한 컴포넌트
│   │   │   ├── ui/         # UI 컴포넌트
│   │   │   └── layout/     # 레이아웃 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── hooks/          # 커스텀 훅
│   │   ├── lib/            # 유틸리티 함수
│   │   ├── services/       # API 서비스
│   │   ├── stores/         # Zustand 스토어
│   │   ├── types/          # TypeScript 타입 정의
│   │   └── styles/         # 글로벌 스타일
│   ├── public/
│   └── package.json
│
├── backend/                  # FastAPI 백엔드
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   └── endpoints/  # API 엔드포인트
│   │   │   └── deps.py         # 의존성 주입
│   │   ├── core/               # 핵심 설정
│   │   ├── models/             # SQLModel 모델
│   │   ├── schemas/            # Pydantic 스키마
│   │   ├── services/           # 비즈니스 로직
│   │   ├── db/                 # 데이터베이스 설정
│   │   └── main.py             # 앱 진입점
│   ├── tests/                  # 테스트 코드
│   ├── alembic/                # 데이터베이스 마이그레이션
│   └── requirements.txt
│
├── docs/                     # 프로젝트 문서
│   ├── ADHD_도우미_프로젝트_설계서.md
│   ├── ADHD_도우미_프론트엔드_설계서.md
│   └── ADHD_도우미_백엔드_설계서.md
│
└── README.md
```

## 📚 API 문서

### 인증 (Authentication)
- `POST /api/v1/auth/register` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/refresh` - 토큰 갱신
- `GET /api/v1/auth/me/` - 현재 사용자 정보

### 감정 기록 (Emotions)
- `POST /api/v1/emotions` - 감정 기록 생성
- `GET /api/v1/emotions` - 감정 기록 목록
- `GET /api/v1/emotions/{id}` - 특정 감정 기록 조회
- `PUT /api/v1/emotions/{id}` - 감정 기록 수정
- `DELETE /api/v1/emotions/{id}` - 감정 기록 삭제
- `GET /api/v1/emotions/stats/summary` - 감정 통계

### 집중 세션 (Focus Session)
- `POST /api/v1/focus` - 세션 시작
- `GET /api/v1/focus` - 세션 목록
- `GET /api/v1/focus/current` - 현재 진행중인 세션
- `PUT /api/v1/focus/{id}/end` - 세션 종료
- `GET /api/v1/focus/stats/summary` - 집중 통계

### 할 일 관리 (Todos)
- `POST /api/v1/todos` - 할 일 생성
- `GET /api/v1/todos` - 할 일 목록
- `PUT /api/v1/todos/{id}` - 할 일 수정
- `DELETE /api/v1/todos/{id}` - 할 일 삭제
- `GET /api/v1/todos/stats/summary` - 할 일 통계

자세한 API 명세는 서버 실행 후 `http://localhost:8000/docs`에서 확인할 수 있습니다.

## 📊 개발 현황

### ✅ 완료된 작업

- [x] **Phase 1: 프로젝트 설정**
  - [x] 프로젝트 설계 및 문서화
  - [x] 개발 환경 구축
  - [x] Git 저장소 초기화

- [x] **Phase 2: Backend 개발**
  - [x] FastAPI 프로젝트 구조 설정
  - [x] 데이터베이스 모델 구현 (SQLModel)
  - [x] JWT 기반 인증 시스템
  - [x] CORS 설정
  - [x] API 엔드포인트 구현
    - [x] 인증 API (회원가입/로그인/토큰)
    - [x] 감정 기록 CRUD + 통계
    - [x] 집중 세션 관리 + 통계
    - [x] 할 일 관리 CRUD + 통계

- [x] **Phase 3: Frontend 개발**
  - [x] React + TypeScript + Vite 설정
  - [x] Tailwind CSS 3.x 설정 (Windows 11 호환)
  - [x] 프로젝트 구조 설정
  - [x] ESLint + Prettier 설정
  - [x] API 클라이언트 구현 (Axios)
  - [x] 상태 관리 설정 (Zustand)
  - [x] 라우팅 설정 (React Router)
  - [x] 인증 플로우 구현
    - [x] 로그인 페이지
    - [x] 회원가입 페이지
    - [x] Protected Routes
  - [x] 대시보드 기본 구조

### 🚧 진행 중인 작업

- [ ] **Phase 4: 핵심 기능 UI**
  - [x] 감정 기록 컴포넌트
  - [x] 포모도로 타이머 컴포넌트
  - [x] Todo 리스트 컴포넌트
  - [x] 데이터 시각화 (차트)

### 📋 예정된 작업

- [ ] **Phase 5: AI 통합**
  - [ ] HuggingFace 감정 분석 통합
  - [ ] OpenAI GPT 피드백 생성
  - [ ] AI 서비스 최적화

- [ ] **Phase 6: 테스트 & 최적화**
  - [ ] 단위 테스트 작성
  - [ ] 통합 테스트
  - [ ] 성능 최적화
  - [ ] 접근성 개선

- [ ] **Phase 7: 배포**
  - [ ] Docker 컨테이너화
  - [ ] CI/CD 파이프라인 구축
  - [ ] 클라우드 배포 (Render/Vercel)
  - [ ] 모니터링 설정

## 🤝 기여하기

프로젝트 기여를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch(`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 코딩 컨벤션

- **Frontend**: ESLint + Prettier 규칙 준수
- **Backend**: Black + isort 포맷팅 적용
- **커밋 메세지**: [Conventional Commits](https://www.conventionalcommits.org/) 규칙 준수

## 👥 팀

- **개발자**: Dev-2A
- **시작일**: 2025년 10월 21일

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

---

**ADHD Helper** - 더 나은 일상 관리를 위한 도우미 💙