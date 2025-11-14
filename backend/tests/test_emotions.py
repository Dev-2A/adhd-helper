from datetime import datetime

import pytest
from fastapi.testclient import TestClient


def test_create_emotion(authenticated_client: TestClient):
    """감정 기록 생성 테스트"""
    emotion_data = {"emotion_level": 4, "emotion_type": "happy", "note": "Good day!"}

    response = authenticated_client.post("/api/v1/emotions", json=emotion_data)
    assert response.status_code == 200
    data = response.json()
    assert data["emotion_level"] == emotion_data["emotion_level"]
    assert data["emotion_type"] == emotion_data["emotion_type"]
    assert data["note"] == emotion_data["note"]


def test_get_emotions(authenticated_client: TestClient):
    """감정 기록 목록 조회 테스트"""
    # 감정 기록 생성
    for i in range(3):
        response = authenticated_client.post(
            "/api/v1/emotions",
            json={
                "emotion_level": i + 1,
                "emotion_type": "neutral",
                "note": f"Test emotion {i}",
            },
        )
        assert response.status_code == 200  # 생성 확인

    # 목록 조회
    response = authenticated_client.get("/api/v1/emotions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3


def test_emotion_stats(authenticated_client: TestClient):
    """감정 통계 조회 테스트"""
    # 감정 기록 생성
    emotions = [
        {"emotion_level": 5, "emotion_type": "happy"},
        {"emotion_level": 3, "emotion_type": "neutral"},
        {"emotion_level": 4, "emotion_type": "happy"},
    ]

    for emotion in emotions:
        response = authenticated_client.post("/api/v1/emotions", json=emotion)
        assert response.status_code == 200

    # 통계 조회 - days 파라미터를 명시적으로 전달
    response = authenticated_client.get(
        "/api/v1/emotions/stats/summary", params={"days": 7}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_records"] == 3
    assert data["average_level"] == 4.0
    assert data["most_common_emotion"] == "happy"
    assert data["period_days"] == 7  # 7일 기간 확인
