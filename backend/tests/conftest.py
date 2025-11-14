import os
import sys
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

# 프로젝트 루트를 Python 경로에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import get_session
from app.main import app

# 모든 모델을 명시적으로 import (순서 중요)
from app.models.base import BaseModel
from app.models.emotion import EmotionRecord
from app.models.feedback import AIFeedback
from app.models.focus import FocusSession
from app.models.todo import TodoItem
from app.models.user import User


@pytest.fixture(scope="function")  # 각 테스트마다 새로운 DB
def engine():
    """테스트용 엔진 - 각 테스트마다 새로 생성"""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    yield engine
    # 테스트 후 엔진 정리
    engine.dispose()


@pytest.fixture(scope="function")
def session(engine) -> Generator[Session, None, None]:
    """테스트용 데이터베이스 세션 - 각 테스트마다 새로 생성"""
    with Session(engine) as session:
        yield session


@pytest.fixture(scope="function")
def client(session: Session) -> Generator[TestClient, None, None]:
    """테스트 클라이언트 - 각 테스트마다 새로 생성"""

    def get_session_override():
        return session

    # 의존성 오버라이드
    app.dependency_overrides[get_session] = get_session_override

    with TestClient(app) as test_client:
        yield test_client

    # 테스트 후 오버라이드 제거
    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data():
    """테스트 사용자 데이터"""
    import uuid

    # 각 테스트마다 고유한 이메일 생성
    unique_id = str(uuid.uuid4())[:8]
    return {
        "email": f"test_{unique_id}@example.com",
        "password": "testpassword123",
        "name": "Test User",
    }


@pytest.fixture
def authenticated_client(client: TestClient, test_user_data) -> TestClient:
    """인증된 테스트 클라이언트 - 각 테스트마다 새로운 사용자"""
    # 사용자 등록
    response = client.post("/api/v1/auth/register", json=test_user_data)
    assert response.status_code == 200, f"Registration failed: {response.json()}"

    # 로그인
    response = client.post(
        "/api/v1/auth/login",
        json={"email": test_user_data["email"], "password": test_user_data["password"]},
    )
    assert response.status_code == 200, f"Login failed: {response.json()}"

    token = response.json()["access_token"]
    # 헤더에 토큰 추가
    client.headers.update({"Authorization": f"Bearer {token}"})

    return client


@pytest.fixture(autouse=True)
def reset_database():
    """각 테스트 전후로 데이터베이스 상태 리셋"""
    yield
    # 테스트 후 정리 작업이 필요한 경우 여기에 추가
