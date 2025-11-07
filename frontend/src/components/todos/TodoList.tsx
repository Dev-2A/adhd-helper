/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService, type TodoItem } from "@/services/todo.service";
import { Plus, Trash2, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function TodoList() {
  const queryClient = useQueryClient();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);

  // 할 일 목록 조회
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => todoService.getTodos(),
  });

  // 할 일 생성
  const createMutation = useMutation({
    mutationFn: todoService.createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodoTitle('');
    },
  });

  // 할 일 완료 토글
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      todoService.updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // 할 일 삭제
  const deleteMutation = useMutation({
    mutationFn: todoService.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      createMutation.mutate({ title: newTodoTitle.trim() });
    }
  };

  const handleToggleComplete = (todo: TodoItem) => {
    updateMutation.mutate({
      id: todo.id,
      data: { completed: !todo.completed }
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('이 할 일을 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 5: return 'text-red-500';
      case 4: return 'text-orange-500';
      case 3: return 'text-yellow-500';
      case 2: return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const filteredTodos = showCompleted
    ? todos
    : todos.filter(todo => !todo.completed);
  
  if (isLoading) {
    return <div className="text-center py-4">로딩 중...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">할 일 목록</h2>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {showCompleted ? '완료된 항목 숨기기' : '완료된 항목 보기'}
        </button>
      </div>

      {/* 할 일 추가 폼 */}
      <form onSubmit={handleAddTodo} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="새로운 할 일을 입력하세요..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={createMutation.isPending || !newTodoTitle.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* 할 일 목록 */}
      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            할 일이 없습니다. 새로운 할 일을 추가해보세요!
          </p>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                todo.completed
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-gray-300'
              }`}
            >
              <button
                onClick={() => handleToggleComplete(todo)}
                className="flex-shrink-0"
              >
                {todo.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <div className="flex-1">
                <p className={`font-medium ${
                  todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  {todo.title}
                </p>
                {todo.description && (
                  <p className="text-sm text-gray-600">{todo.description}</p>
                )}
                {todo.due_date && (
                  <p className="text-xs text-gray-500 mt-1">
                    마감: {format(new Date(todo.due_date), 'MM월 dd일', { locale: ko })}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* 우선순위 표시 */}
                <span className={`flex items-center ${getPriorityColor(todo.priority)}`}>
                  {[...Array(todo.priority)].map((_, i) => (
                    <AlertCircle key={i} className="w-3 h-3" />
                  ))}
                </span>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}