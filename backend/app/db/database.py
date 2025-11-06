from app.core.config import get_settings
from sqlmodel import Session, SQLModel, create_engine

settings = get_settings()

# 개발/프로덕션에 따라 다른 설정
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}

engine = create_engine(
    settings.DATABASE_URL, echo=settings.DEBUG, connect_args=connect_args
)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
