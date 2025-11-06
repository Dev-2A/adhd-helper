import uuid
from typing import Optional

from app.core.security import get_password_hash, verify_password
from app.models.user import User, UserCreate
from sqlmodel import Session, select


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> Optional[User]:
        """이메일로 사용자 조회"""
        statement = select(User).where(User.email == email)
        return self.db.exec(statement).first()

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """ID로 사용자 조회"""
        try:
            user_uuid = uuid.UUID(user_id)
            statement = select(User).where(User.id == user_uuid)
            return self.db.exec(statement).first()
        except ValueError:
            return None

    def create_user(self, user_create: UserCreate) -> User:
        """새 사용자 생성"""
        # 비밀번호 해싱
        hashed_password = get_password_hash(user_create.password)

        # User 객체 생성
        db_user = User(
            email=user_create.email,
            name=user_create.name,
            hashed_password=hashed_password,
            timezone=user_create.timezone,
            is_active=True,
        )

        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """사용자 인증"""
        user = self.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def update_user_password(self, user: User, new_password: str) -> User:
        """비밀번호 변경"""
        user.hashed_password = get_password_hash(new_password)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
