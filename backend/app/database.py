"""
데이터베이스 연결 및 세션 관리
"""
from sqlmodel import SQLModel, create_engine, Session
from app.config import settings

# 데이터베이스 엔진 생성
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,    # SQL 쿼리 로깅
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

def create_db_and_tables():
    """데이터베이스 및 테이블 생성"""
    SQLModel.metadata.create_all(engine)

def get_session():
    """데이터베이스 세션 제공 (의존성 주입용)"""
    with Session(engine) as session:
        yield session