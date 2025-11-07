import { useAuthStore } from '@/stores/auth.store';
import { EmotionRecorder } from '@/components/emotions/EmotionRecorder';
import { TodoList } from '@/components/todos/TodoList';
import { PomodoroTimer } from '@/components/focus/PomodoroTimer';

export function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">ADHD Helper</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            안녕하세요, {user?.name}님!
          </h2>
          
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* 감정 기록 */}
            <EmotionRecorder />

            {/* 포모도로 타이머 */}
            <PomodoroTimer />

            {/* 할 일 리스트 -전체 너비 */}
            <div className='lg:col-span-2'>
              <TodoList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}