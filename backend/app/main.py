from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# 라이프사이클 이벤트
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 시작 시
    print("Starting up ADHD Helper API...")
    yield
    # 종료 시
    print("Shutting down ADHD Helper API...")

# FastAPI 앱 생성
app = FastAPI(
    title=os.getenv("APP_NAME", "ADHD Helper API"),
    version=os.getenv("APP_VERSION", "1.0.0"),
    description="ADHD 도우미 백엔드 API",
    lifespan=lifespan
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 루트 엔드포인트
@app.get("/")
def read_root():
    return {
        "message": "Welcome to ADHD Helper API",
        "version": os.getenv("APP_VERSION", "1.0.0"),
        "docs": "/docs"
    }

# 헬스 체크
@app.get("/health")
def health_check():
    return {"status": "healthy"}