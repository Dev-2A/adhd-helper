from datetime import timedelta

from app.api.deps import get_current_user, get_db
from app.core.config import get_settings
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.models.user import User, UserCreate, UserRead
from app.schemas.auth import LoginRequest, RefreshTokenRequest, RegisterRequest, Token
from app.services.user_service import UserService
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

settings = get_settings()
router = APIRouter()


@router.post("/register", response_model=UserRead)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """회원가입"""
    user_service = UserService(db)

    # 이메일 중복 확인
    existing_user = user_service.get_user_by_email(request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # 사용자 생성
    user_create = UserCreate(
        email=request.email,
        password=request.password,
        name=request.name,
        timezone=request.timezone,
    )

    new_user = user_service.create_user(user_create)

    return UserRead(
        id=str(new_user.id),
        email=new_user.email,
        name=new_user.name,
        timezone=new_user.timezone,
        is_active=new_user.is_active,
        created_at=new_user.created_at,
    )


@router.post("/login", response_model=Token)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """로그인"""
    user_service = UserService(db)

    # 사용자 인증
    user = user_service.authenticate_user(request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 토큰 생성
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user.id), expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(subject=str(user.id))

    return Token(
        access_token=access_token, refresh_token=refresh_token, token_type="bearer"
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """토큰 갱신"""
    # 리프레시 토큰 검증
    user_id = decode_token(request.refresh_token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )

    user_service = UserService(db)
    user = user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )

    # 새 토큰 생성
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user.id), expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserRead)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """현재 사용자 정보 조회"""
    return UserRead(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        timezone=current_user.timezone,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
    )
