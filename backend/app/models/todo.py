import uuid as uuid_lib
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from app.models.base import BaseModel
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.user import User


class TodoItemBase(SQLModel):
    """TodoItem 기본 스키마"""

    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: int = Field(default=1, ge=1, le=5)
    due_date: Optional[datetime] = Field(default=None)


class TodoItem(TodoItemBase, BaseModel, table=True):
    """TodoItem 데이터베이스 모델"""

    __tablename__ = "todo_items"

    user_id: uuid_lib.UUID = Field(foreign_key="users.id", index=True)
    completed_at: Optional[datetime] = Field(default=None)

    # Relationship
    user: Optional["User"] = Relationship(back_populates="todo_items")


class TodoItemCreate(TodoItemBase):
    """TodoItem 생성 스키마"""

    pass


class TodoItemRead(TodoItemBase):
    """TodoItem 읽기 스키마"""

    id: str
    user_id: str
    completed_at: Optional[datetime]
    created_at: datetime


class TodoItemUpdate(SQLModel):
    """TodoItem 업데이트 스키마"""

    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[int] = Field(default=None, ge=1, le=5)
    due_date: Optional[datetime] = None
