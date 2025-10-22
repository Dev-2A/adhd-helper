# ADHD Helper - ADHD 도우미

ADHD 사용자를 위한 일상 관리 웹 애플리케이션

## 📋 프로젝트 개요

ADHD Helper는 ADHD를 가진 사용자들의 감정 기록, 집중력 추적, 할 일 관리를 돕는 웹 기반 도구입니다.

### 주요 기능
- 📊 감정 기록 및 분석
- ⏱ 포모도로 타이머
- ✅ 할 일 관리
- 🤖 AI 기반 피드백
- 📈 데이터 시각화 및 인사이트

## 🛠 기술 스택

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Zustand + React Query
- Chart.js

### Backend
- FastAPI (Python 3.11+)
- SQLModel + PostgreSQL
- HuggingFace Transformers
- OpenAI API

## 📦 프로젝트 구조
```

adhd-helper/
├── frontend/           # React 프론트엔드
├── backend/            # FastAPI 백엔드
├── docs/               # 프로젝트 문서
└── README.md
```


## 🚀 시작하기

### 사전 요구사항
- Node.js 18+
- Python 3.11+
- Git

### 설치 방법

#### 프론트엔드
```bash
cd frontend
npm install
npm run dev
```


프론트엔드는 `http://localhost:3000`에서 실행됩니다.


#### 백엔드
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```


백엔드는 `http://localhost:8000`에서 실행됩니다.
- API 문서: `http://localhost:8000/docs`


## 📝 개발 상태
- [x] 프로젝트 설계
- [x] 개발 환경 구축
- [x] 프론트엔드 프로젝트 초기 설정
- [x] 백엔드 프로젝트 초기 설정
  - [x] FastAPI 기본 구조
  - [x] 데이터베이스 연결
  - [x] 보안 설정
  - [x] CORS 설정
- [ ] 데이터 모델 구현
- [ ] 인증 시스템 구현
- [ ] 핵심 기능 개발
- [ ] AI 통합
- [ ] 테스트 및 배포

## 👥 기여자

- 개발자: Dev-2A

## 📄 라이선스

MIT License

---

**개발 시작일**: 2025년 10월 21일