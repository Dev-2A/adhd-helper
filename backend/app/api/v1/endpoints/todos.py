from datetime import datetime
from typing import List, Optional

from app.api.deps import get_current_active_user, get_db
from app.models.todo import TodoItem, TodoItemCreate, TodoItemRead, TodoItemUpdate
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

router = APIRouter()


@router.post("/", response_model=TodoItemRead)
async def create_todo(
    todo: TodoItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """할 일 생성"""
    db_todo = TodoItem(**todo.dict(), user_id=current_user.id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)

    return TodoItemRead(
        id=str(db_todo.id),
        user_id=str(db_todo.user_id),
        title=db_todo.title,
        description=db_todo.description,
        completed=db_todo.completed,
        priority=db_todo.priority,
        due_date=db_todo.due_date,
        completed_at=db_todo.completed_at,
        created_at=db_todo.created_at,
    )


@router.get("/", response_model=List[TodoItemRead])
async def get_todos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    completed: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """할 일 목록 조회"""
    query = select(TodoItem).where(TodoItem.user_id == current_user.id)

    if completed is not None:
        query = query.where(TodoItem.completed == completed)

    query = (
        query.offset(skip)
        .limit(limit)
        .order_by(
            TodoItem.completed, TodoItem.priority.desc(), TodoItem.created_at.desc()
        )
    )
    todos = db.exec(query).all()

    return [
        TodoItemRead(
            id=str(t.id),
            user_id=str(t.user_id),
            title=t.title,
            description=t.description,
            completed=t.completed,
            priority=t.priority,
            due_date=t.due_date,
            completed_at=t.completed_at,
            created_at=t.created_at,
        )
        for t in todos
    ]


@router.put("/{todo_id}", response_model=TodoItemRead)
async def update_todo(
    todo_id: str,
    todo_update: TodoItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """할 일 수정"""
    todo = db.exec(
        select(TodoItem).where(
            TodoItem.id == todo_id, TodoItem.user_id == current_user.id
        )
    ).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    update_data = todo_update.dict(exclude_unset=True)

    # 완료 상태 변경 처리
    if "completed" in update_data:
        if update_data["completed"] and not todo.completed:
            todo.completed_at = datetime.utcnow()
        elif not update_data["completed"] and todo.completed:
            todo.completed_at = None

    for key, value in update_data.items():
        setattr(todo, key, value)

    todo.updated_at = datetime.utcnow()
    db.add(todo)
    db.commit()
    db.refresh(todo)

    return TodoItemRead(
        id=str(todo.id),
        user_id=str(todo.user_id),
        title=todo.title,
        description=todo.description,
        completed=todo.completed,
        priority=todo.priority,
        due_date=todo.due_date,
        completed_at=todo.completed_at,
        created_at=todo.created_at,
    )


@router.delete("/{todo_id}")
async def delete_todo(
    todo_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """할 일 삭제"""
    todo = db.exec(
        select(TodoItem).where(
            TodoItem.id == todo_id, TodoItem.user_id == current_user.id
        )
    ).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(todo)
    db.commit()

    return {"message": "Todo deleted successfully"}


@router.get("/stats/summary")
async def get_todo_stats(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
):
    """할 일 통계 조회"""
    todos = db.exec(select(TodoItem).where(TodoItem.user_id == current_user.id)).all()

    total = len(todos)
    completed = len([t for t in todos if t.completed])
    pending = total - completed
    overdue = len(
        [
            t
            for t in todos
            if not t.completed and t.due_date and t.due_date < datetime.utcnow()
        ]
    )

    return {
        "total": total,
        "completed": completed,
        "pending": pending,
        "overdue": overdue,
        "completion_rate": round(completed / total * 100, 1) if total > 0 else 0,
    }
