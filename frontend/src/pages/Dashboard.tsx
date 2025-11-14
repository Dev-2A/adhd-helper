import { useAuthStore } from '@/stores/auth.store';
import { EmotionRecorder } from '@/components/emotions/EmotionRecorder';
import { TodoList } from '@/components/todos/TodoList';
import { PomodoroTimer } from '@/components/focus/PomodoroTimer';
import { Emoji } from '@/components/common/Emoji';

export function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
            안녕하세요, {user?.name}님! <Emoji size="1.5em">👋</Emoji>
          </h2>
          <div className="text-lg flex items-center justify-center gap-2" style={{ color: '#8A8A8A' }}>
            오늘도 함께 건강한 하루를 만들어가요 <Emoji size="1.3em">✨</Emoji>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* 감정 기록 */}
          <EmotionRecorder />

          {/* 포모도로 타이머 */}
          <PomodoroTimer />

          {/* 할 일 리스트 - 전체 너비 */}
          <div className='lg:col-span-2'>
            <TodoList />
          </div>
        </div>
      </main>
    </div>
  );
}