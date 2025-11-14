import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService, type TodoItem } from "@/services/todo.service";
import { Plus, Trash2, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Emoji } from '@/components/common/Emoji';

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
    mutationFn: ({ id, data }: { id: string; data: Partial<TodoItem> }) =>
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
    console.log('할 일 추가 시도:', newTodoTitle);
    if (newTodoTitle.trim()) {
      console.log('할 일 추가 중...');
      createMutation.mutate({ title: newTodoTitle.trim() });
    } else {
      console.log('제목이 비어있습니다');
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
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/50 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent flex items-center gap-2">
          <Emoji size="1.4em">✅</Emoji> 할 일 목록
        </h2>
        <button
          type="button"
          onClick={() => setShowCompleted(!showCompleted)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-md"
          style={{
            background: 'linear-gradient(135deg, #AEC6CF 0%, #C3E5FF 100%)',
            color: '#5A5A5A'
          }}
        >
          {showCompleted ? '완료 항목 숨기기' : '완료 항목 보기'}
        </button>
      </div>

      {/* 할 일 추가 폼 */}
      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="새로운 할 일을 입력하세요..."
            className="flex-1 px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              color: '#5A5A5A',
              border: '2px solid rgba(174, 198, 207, 0.4)',
            }}
          />
          <button
            type="submit"
            disabled={createMutation.isPending || !newTodoTitle.trim()}
            onClick={(e) => {
              console.log('버튼 클릭됨!', { newTodoTitle, disabled: createMutation.isPending || !newTodoTitle.trim() });
            }}
            className="px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center relative z-10"
            style={{
              background: 'linear-gradient(135deg, #B4E7CE 0%, #C1F0C8 100%)',
              color: '#5A5A5A',
              minWidth: '60px',
              pointerEvents: 'auto'
            }}
            aria-label="할 일 추가"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* 할 일 목록 */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
            <p className="text-lg font-medium flex items-center justify-center gap-2" style={{ color: '#8A8A8A' }}>
              할 일이 없습니다. 새로운 할 일을 추가해보세요! <Emoji>🌟</Emoji>
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:shadow-md"
              style={{
                background: todo.completed
                  ? 'rgba(197, 185, 232, 0.1)'
                  : 'rgba(255, 255, 255, 0.5)',
                borderColor: todo.completed ? 'rgba(197, 185, 232, 0.3)' : 'transparent'
              }}
            >
              <button
                type="button"
                onClick={() => handleToggleComplete(todo)}
                className="flex-shrink-0 transition-transform hover:scale-110"
              >
                {todo.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${
                  todo.completed ? 'line-through opacity-60' : ''
                }`} style={{ color: '#5A5A5A' }}>
                  {todo.title}
                </p>
                {todo.description && (
                  <p className="text-sm mt-1" style={{ color: '#8A8A8A' }}>{todo.description}</p>
                )}
                {todo.due_date && (
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#B0B0B0' }}>
                    <Emoji>📅</Emoji> 마감: {format(new Date(todo.due_date), 'MM월 dd일', { locale: ko })}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* 우선순위 표시 */}
                <div className={`flex items-center ${getPriorityColor(todo.priority)}`}>
                  {[...Array(todo.priority)].map((_, i) => (
                    <AlertCircle key={i} className="w-4 h-4" />
                  ))}
                </div>

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => handleDelete(todo.id)}
                  className="p-2 rounded-full transition-all hover:bg-red-100"
                  style={{ color: '#FFB6B9' }}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}