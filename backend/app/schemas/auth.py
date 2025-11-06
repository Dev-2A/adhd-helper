from typing import Optional

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    """토큰 응답 스키마"""

    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """토큰 페이로드 스키마"""

    sub: Optional[str] = None


class LoginRequest(BaseModel):
    """로그인 요청 스키마"""

    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """회원가입 요청 스키마"""

    email: EmailStr
    password: str
    name: str
    timezone: str = "Asia/Seoul"


class RefreshTokenRequest(BaseModel):
    """토큰 갱신 요청 스키마"""

    refresh_token: str
