"""
Todo 항목 모델
"""
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from app.models.user import User


class TodoItemBase(SQLModel):
    """Todo 항목 기본 정보"""
    title: str = Field(max_length=255)
    description: Optional[str] = None
    completed: bool = Field(default=False)
    priority: int = Field(default=1, ge=1, le=5, description="우선순위 (1-5)")
    due_date: Optional[datetime] = None


class TodoItem(TodoItemBase, table=True):
    """Todo 항목 테이블 모델"""
    __tablename__ = "todo_items"
    
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    user_id: uuid.UUID = Field(
        foreign_key="users.id",
        index=True,
        nullable=False
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="todo_items")