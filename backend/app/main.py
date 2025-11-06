from contextlib import asynccontextmanager

from app.api.v1.api import api_router  # 추가
from app.core.config import get_settings
from app.db.database import create_db_and_tables
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

settings = get_settings()


# 라이프사이클 이벤트
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 시작 시
    print("Starting up ADHD Helper API...")
    create_db_and_tables()
    print("Database tables created")
    yield
    # 종료 시
    print("Shutting down ADHD Helper API...")


# FastAPI 앱 생성
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="ADHD 도우미 백엔드 API",
    lifespan=lifespan,
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 추가
app.include_router(api_router, prefix="/api/v1")  # 추가


# 루트 엔드포인트
@app.get("/")
def read_root():
    return {
        "message": "Welcome to ADHD Helper API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }


# 헬스 체크
@app.get("/health")
def health_check():
    return {"status": "healthy"}
