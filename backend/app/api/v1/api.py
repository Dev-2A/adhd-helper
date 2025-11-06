from app.api.v1.endpoints import auth, emotions, focus, todos
from fastapi import APIRouter

api_router = APIRouter()

# 라우터 등록
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(emotions.router, prefix="/emotions", tags=["emotions"])
api_router.include_router(focus.router, prefix="/focus", tags=["focus"])
api_router.include_router(todos.router, prefix="/todos", tags=["todos"])
