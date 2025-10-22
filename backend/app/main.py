"""
FastAPI 메인 애플리케이션
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import create_db_and_tables

# FastAPI 앱 생성
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="ADHD 사용자를 위한 일상 관리 도우미 API",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    """애플리케이션 시작 시 실행"""
    create_db_and_tables()
    print(f"🚀 {settings.APP_NAME} v{settings.VERSION} started!")
    print(f"📝 Environment: {settings.ENVIRONMENT}")
    print("📚 API Docs: http://localhost:8000/docs")

@app.get("/")
def root():
    """루트 엔드포인트"""
    return {
        "message": "ADHD Helper API",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    """헬스 체크 엔드포인트"""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT
    }