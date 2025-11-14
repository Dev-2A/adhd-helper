import pytest
from fastapi.testclient import TestClient


def test_create_todo(authenticated_client: TestClient):
    """할 일 생성 테스트"""
    todo_data = {"title": "Test Todo", "description": "Test Description", "priority": 3}

    response = authenticated_client.post("/api/v1/todos", json=todo_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == todo_data["title"]
    assert data["completed"] == False


def test_update_todo(authenticated_client: TestClient):
    """할 일 수정 테스트"""
    # Todo 생성
    response = authenticated_client.post(
        "/api/v1/todos", json={"title": "Original Todo"}
    )
    todo_id = response.json()["id"]

    # Todo 수정
    response = authenticated_client.put(
        f"/api/v1/todos/{todo_id}", json={"title": "Updated Todo", "completed": True}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Todo"
    assert data["completed"] == True


def test_delete_todo(authenticated_client: TestClient):
    """할 일 삭제 테스트"""
    # Todo 생성
    response = authenticated_client.post(
        "/api/v1/todos", json={"title": "Todo to Delete"}
    )
    todo_id = response.json()["id"]

    # Todo 삭제
    response = authenticated_client.delete(f"/api/v1/todos/{todo_id}")
    assert response.status_code == 200

    # 목록에서 확인
    response = authenticated_client.get("/api/v1/todos")
    todos = response.json()
    assert not any(t["id"] == todo_id for t in todos)
