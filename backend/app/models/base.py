import uuid as uuid_lib
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class BaseModel(SQLModel):
    """모든 모델의 기본 클래스"""

    id: uuid_lib.UUID = Field(
        default_factory=uuid_lib.uuid4, primary_key=True, index=True, nullable=False
    )
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default=None, nullable=True)
