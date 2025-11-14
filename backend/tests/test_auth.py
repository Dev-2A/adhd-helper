import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session


def test_register(client: TestClient):
    """회원가입 테스트"""
    import uuid

    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"

    user_data = {
        "email": unique_email,
        "password": "testpassword123",
        "name": "Test User",
    }

    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["name"] == user_data["name"]
    assert "id" in data


def test_register_duplicate_email(client: TestClient):
    """중복 이메일 회원가입 테스트"""
    import uuid

    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"

    user_data = {
        "email": unique_email,
        "password": "testpassword123",
        "name": "Test User",
    }

    # 첫 번째 등록
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 200

    # 두 번째 등록 시도 (같은 이메일)
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


def test_login_success(client: TestClient):
    """로그인 성공 테스트"""
    import uuid

    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"

    user_data = {
        "email": unique_email,
        "password": "testpassword123",
        "name": "Test User",
    }

    # 사용자 등록
    register_response = client.post("/api/v1/auth/register", json=user_data)
    assert register_response.status_code == 200

    # 로그인
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": user_data["email"], "password": user_data["password"]},
    )

    assert login_response.status_code == 200
    data = login_response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client: TestClient):
    """잘못된 비밀번호 로그인 테스트"""
    import uuid

    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"

    user_data = {
        "email": unique_email,
        "password": "testpassword123",
        "name": "Test User",
    }

    # 사용자 등록
    client.post("/api/v1/auth/register", json=user_data)

    # 잘못된 비밀번호로 로그인
    response = client.post(
        "/api/v1/auth/login",
        json={"email": user_data["email"], "password": "wrongpassword"},
    )

    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_get_current_user(authenticated_client: TestClient):
    """현재 사용자 정보 조회 테스트"""
    response = authenticated_client.get("/api/v1/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert "email" in data
    assert "name" in data
    assert data["name"] == "Test User"


def test_unauthorized_access(client: TestClient):
    """인증되지 않은 접근 테스트"""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
