"""
애플리케이션 설정 관리
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List

class Settings(BaseSettings):
    """애플리케이션 설정"""
    
    # Application
    APP_NAME: str = "ADHD Helper API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Database
    DATABASE_URL: str = "sqlite:///./adhd_helper.db"
    
    # API Services
    OPENAI_API_KEY: Optional[str] = None
    HUGGINGFACE_API_KEY: Optional[str] = None
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    # Redis
    REDIS_URL: Optional[str] = None
    
    # Sentry
    SENTRY_DSN: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """CORS 허용 오리진 리스트로 변환"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

# 전역 설정 인스턴스
settings = Settings()