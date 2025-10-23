# ADHD 도우미 프론트엔드 상세 설계서

## 📋 문서 정보
- **프로젝트명**: ADHD Helper Frontend
- **버전**: 1.0.0
- **작성일**: 2025년 10월 21일
- **문서 타입**: 프론트엔드 설계서

---

## 1. 프론트엔드 개요

### 1.1 목적
React 18 + TypeScript + Vite 기반의 반응형 웹 애플리케이션으로, ADHD 사용자를 위한 직관적이고 접근하기 쉬운 인터페이스를 제공합니다.

### 1.2 핵심 목표
1. **사용자 친화성**: 3분 이내 완료 가능한 간단한 입력 과정
2. **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기 지원
3. **빠른 성능**: 2초 이내 페이지 로드
4. **오프라인 지원**: PWA를 통한 오프라인 사용 가능
5. **접근성**: WCAG 2.1 AA 레벨 준수

---

## 2. 기술 스택

### 2.1 Core Technologies

```yaml
Framework: React 18.2+
- Concurrent rendering
- Automatic batching
- Suspense 지원
- 향상된 성능

Language: TypeScript 5.0+
- 타입 안전성
- 인텔리센스 지원
- 리팩토링 용이성

Build Tool: Vite 5.0+
- 빠른 HMR (Hot Module Replacement)
- 최적화된 빌드
- ESM 기반
```

### 2.2 UI & Styling

```yaml
Styling: Tailwind CSS 3.4+
- 유틸리티 퍼스트 CSS
- 빠른 개발 속도
- 작은 번들 사이즈
- 커스터마이징 용이

Component Library: shadcn/ui
- Radix UI 기반
- 접근성 보장
- 커스터마이징 가능
- Headless 컴포넌트
```

### 2.3 State Management

```yaml
Global State: Zustand 4.5+
- 간단한 API
- 작은 번들 사이즈
- React 18 지원
- DevTools 지원

Server State: React Query (TanStack Query) 5.0+
- 자동 캐싱
- 백그라운드 업데이트
- 낙관적 업데이트
- 무한 스크롤 지원
```

### 2.4 Additional Libraries

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "typescript": "^5.3.0",
    
    "@tanstack/react-query": "^5.12.0",
    "zustand": "^4.5.0",
    "axios": "^1.6.2",
    
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0",
    
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-toast": "^1.1.5",
    
    "lucide-react": "^0.300.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    
    "date-fns": "^3.0.6",
    "react-day-picker": "^8.10.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "vite-plugin-pwa": "^0.17.4",
    
    "vitest": "^1.0.4",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    
    "eslint": "^8.56.0",
    "prettier": "^3.1.1"
  }
}
```

---

## 3. 프로젝트 구조

```
frontend/
├── public/
│   ├── icons/                 # PWA 아이콘 (다양한 크기)
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── apple-touch-icon.png
│   ├── manifest.json         # PWA 매니페스트
│   ├── robots.txt
│   └── favicon.ico
│
├── src/
│   ├── components/           # 재사용 가능한 컴포넌트
│   │   ├── ui/              # shadcn/ui 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/          # 레이아웃 컴포넌트
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── BottomNavigation.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   ├── forms/           # 폼 컴포넌트
│   │   │   ├── EmotionForm.tsx
│   │   │   ├── TodoForm.tsx
│   │   │   └── SettingsForm.tsx
│   │   │
│   │   ├── charts/          # 차트 컴포넌트
│   │   │   ├── EmotionChart.tsx
│   │   │   ├── FocusChart.tsx
│   │   │   └── TrendChart.tsx
│   │   │
│   │   └── common/          # 공통 컴포넌트
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── Dashboard/
│   │   │   ├── index.tsx
│   │   │   └── DashboardCard.tsx
│   │   │
│   │   ├── Emotions/
│   │   │   ├── index.tsx
│   │   │   ├── EmotionList.tsx
│   │   │   └── EmotionDetail.tsx
│   │   │
│   │   ├── Focus/
│   │   │   ├── index.tsx
│   │   │   ├── PomodoroTimer.tsx
│   │   │   └── SessionHistory.tsx
│   │   │
│   │   ├── Todos/
│   │   │   ├── index.tsx
│   │   │   ├── TodoList.tsx
│   │   │   └── TodoItem.tsx
│   │   │
│   │   ├── Analytics/
│   │   │   ├── index.tsx
│   │   │   ├── WeeklyView.tsx
│   │   │   └── MonthlyView.tsx
│   │   │
│   │   ├── Settings/
│   │   │   ├── index.tsx
│   │   │   ├── ProfileSettings.tsx
│   │   │   └── NotificationSettings.tsx
│   │   │
│   │   └── Auth/
│   │       ├── Login.tsx
│   │       ├── Register.tsx
│   │       └── ForgotPassword.tsx
│   │
│   ├── hooks/               # 커스텀 훅
│   │   ├── useAuth.ts
│   │   ├── useEmotions.ts
│   │   ├── useFocusSessions.ts
│   │   ├── useTodos.ts
│   │   ├── useAnalytics.ts
│   │   ├── useTimer.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── stores/              # Zustand 스토어
│   │   ├── authStore.ts
│   │   ├── timerStore.ts
│   │   └── uiStore.ts
│   │
│   ├── services/            # API 서비스
│   │   ├── api.ts           # Axios 인스턴스
│   │   ├── authService.ts
│   │   ├── emotionService.ts
│   │   ├── focusService.ts
│   │   ├── todoService.ts
│   │   └── analyticsService.ts
│   │
│   ├── utils/               # 유틸리티 함수
│   │   ├── dateUtils.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── cn.ts            # Tailwind class merger
│   │
│   ├── types/               # TypeScript 타입 정의
│   │   ├── user.ts
│   │   ├── emotion.ts
│   │   ├── focus.ts
│   │   ├── todo.ts
│   │   └── api.ts
│   │
│   ├── constants/           # 상수 정의
│   │   ├── emotions.ts
│   │   ├── routes.ts
│   │   └── config.ts
│   │
│   ├── styles/              # 글로벌 스타일
│   │   └── globals.css
│   │
│   ├── App.tsx             # 루트 컴포넌트
│   ├── main.tsx            # 엔트리 포인트
│   └── vite-env.d.ts       # Vite 타입 정의
│
├── tests/                   # 테스트 파일
│   ├── setup.ts
│   ├── components/
│   └── utils/
│
├── .env.example            # 환경 변수 예시
├── .eslintrc.json          # ESLint 설정
├── .prettierrc             # Prettier 설정
├── index.html              # HTML 템플릿
├── package.json
├── tailwind.config.js      # Tailwind 설정
├── tsconfig.json           # TypeScript 설정
├── vite.config.ts          # Vite 설정
└── vitest.config.ts        # Vitest 설정
```

---

## 4. 컴포넌트 아키텍처

### 4.1 Layout Components

```typescript
// components/layout/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { Sidebar } from './Sidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="flex">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl pb-20 md:pb-6">
          {children || <Outlet />}
        </main>
      </div>
      
      {isMobile && <BottomNavigation />}
    </div>
  );
};

// components/layout/Header.tsx
import { Brain, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-900">ADHD Helper</h1>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Avatar>
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                설정
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={logout}>
              <User className="mr-2 h-4 w-4" />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

// components/layout/BottomNavigation.tsx
import { Home, Heart, Clock, CheckSquare, BarChart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

const navItems = [
  { icon: Home, label: '홈', path: '/' },
  { icon: Heart, label: '감정', path: '/emotions' },
  { icon: Clock, label: '집중', path: '/focus' },
  { icon: CheckSquare, label: '할일', path: '/todos' },
  { icon: BarChart, label: '분석', path: '/analytics' },
];

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-500"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
```

### 4.2 Feature Components

```typescript
// components/forms/EmotionForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmotionType } from '@/types/emotion';

const emotionSchema = z.object({
  emotion_level: z.number().min(1).max(5),
  emotion_type: z.string(),
  note: z.string().optional(),
});

type EmotionFormData = z.infer<typeof emotionSchema>;

const emotions: { type: EmotionType; label: string; emoji: string }[] = [
  { type: 'happy', label: '행복', emoji: '😊' },
  { type: 'sad', label: '슬픔', emoji: '😢' },
  { type: 'anxious', label: '불안', emoji: '😰' },
  { type: 'calm', label: '평온', emoji: '😌' },
  { type: 'excited', label: '신남', emoji: '🤩' },
];

interface EmotionFormProps {
  onSubmit: (data: EmotionFormData) => void;
  isLoading?: boolean;
}

export const EmotionForm: React.FC<EmotionFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmotionFormData>({
    resolver: zodResolver(emotionSchema),
    defaultValues: {
      emotion_level: 3,
      emotion_type: 'calm',
    },
  });
  
  const selectedType = watch('emotion_type');
  const emotionLevel = watch('emotion_level');
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 감정 타입 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          오늘 기분은 어떠세요?
        </label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {emotions.map((emotion) => (
            <button
              key={emotion.type}
              type="button"
              onClick={() => setValue('emotion_type', emotion.type)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                selectedType === emotion.type
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300"
              )}
            >
              <span className="text-3xl mb-2">{emotion.emoji}</span>
              <span className="text-sm font-medium">{emotion.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 감정 강도 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          감정 강도 ({emotionLevel}/5)
        </label>
        <input
          type="range"
          min="1"
          max="5"
          {...register('emotion_level', { valueAsNumber: true })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>약함</span>
          <span>보통</span>
          <span>강함</span>
        </div>
      </div>
      
      {/* 메모 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          메모 (선택사항)
        </label>
        <Textarea
          {...register('note')}
          placeholder="오늘 어떤 일이 있었나요?"
          rows={4}
          className="resize-none"
        />
        {errors.note && (
          <p className="text-sm text-red-600 mt-1">{errors.note.message}</p>
        )}
      </div>
      
      {/* 제출 버튼 */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? '저장 중...' : '기록하기'}
      </Button>
    </form>
  );
};

// components/charts/EmotionChart.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EmotionChartProps {
  data: Array<{
    date: string;
    emotion_avg: number;
  }>;
}

export const EmotionChart: React.FC<EmotionChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => format(new Date(d.date), 'M/d (E)', { locale: ko })),
    datasets: [
      {
        label: '감정 점수',
        data: data.map((d) => d.emotion_avg),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `감정 점수: ${context.parsed.y.toFixed(1)}/5`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
  
  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

// components/common/PomodoroTimer.tsx
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTimerStore } from '@/stores/timerStore';

const POMODORO_DURATION = 25 * 60; // 25분
const SHORT_BREAK = 5 * 60; // 5분
const LONG_BREAK = 15 * 60; // 15분

export const PomodoroTimer: React.FC = () => {
  const {
    isRunning,
    timeLeft,
    sessionType,
    startTimer,
    pauseTimer,
    resetTimer,
    setSessionType,
  } = useTimerStore();
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        useTimerStore.setState((state) => ({
          timeLeft: state.timeLeft - 1,
        }));
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // 타이머 완료 시 알림
      if (Notification.permission === 'granted') {
        new Notification('포모도로 완료!', {
          body: '잠깐 휴식을 취하세요.',
          icon: '/icons/icon-192x192.png',
        });
      }
      pauseTimer();
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((POMODORO_DURATION - timeLeft) / POMODORO_DURATION) * 100;
  
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg">
      {/* 타이머 표시 */}
      <div className="relative w-64 h-64 mb-8">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="#6366f1"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 120}`}
            strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-gray-900">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-sm text-gray-600 mt-2 uppercase">
            {sessionType === 'pomodoro' ? '집중 시간' : '휴식 시간'}
          </span>
        </div>
      </div>
      
      {/* 컨트롤 버튼 */}
      <div className="flex items-center space-x-4">
        <Button
          size="lg"
          onClick={isRunning ? pauseTimer : startTimer}
          className="w-24"
        >
          {isRunning ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              일시정지
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              시작
            </>
          )}
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          onClick={resetTimer}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          리셋
        </Button>
      </div>
      
      {/* 세션 타입 선택 */}
      <div className="flex items-center space-x-2 mt-6">
        <Button
          size="sm"
          variant={sessionType === 'pomodoro' ? 'default' : 'ghost'}
          onClick={() => setSessionType('pomodoro', POMODORO_DURATION)}
        >
          포모도로
        </Button>
        <Button
          size="sm"
          variant={sessionType === 'short_break' ? 'default' : 'ghost'}
          onClick={() => setSessionType('short_break', SHORT_BREAK)}
        >
          짧은 휴식
        </Button>
        <Button
          size="sm"
          variant={sessionType === 'long_break' ? 'default' : 'ghost'}
          onClick={() => setSessionType('long_break', LONG_BREAK)}
        >
          긴 휴식
        </Button>
      </div>
    </div>
  );
};
```

---

## 5. 상태 관리

### 5.1 Zustand Stores

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// stores/timerStore.ts
import { create } from 'zustand';

type SessionType = 'pomodoro' | 'short_break' | 'long_break';

interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  sessionType: SessionType;
  sessionCount: number;
  
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setSessionType: (type: SessionType, duration: number) => void;
  incrementSessionCount: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  isRunning: false,
  timeLeft: 25 * 60,
  sessionType: 'pomodoro',
  sessionCount: 0,
  
  startTimer: () => set({ isRunning: true }),
  pauseTimer: () => set({ isRunning: false }),
  resetTimer: () => set({ isRunning: false, timeLeft: 25 * 60 }),
  setSessionType: (type, duration) =>
    set({ sessionType: type, timeLeft: duration, isRunning: false }),
  incrementSessionCount: () =>
    set((state) => ({ sessionCount: state.sessionCount + 1 })),
}));

// stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  sidebarOpen: false,
  
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
}));
```

### 5.2 React Query Hooks

```typescript
// hooks/useEmotions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emotionService } from '@/services/emotionService';
import { EmotionRecord, EmotionRecordCreate } from '@/types/emotion';
import { toast } from '@/components/ui/use-toast';

export const useEmotions = (startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: ['emotions', startDate, endDate],
    queryFn: () => emotionService.getEmotions({ startDate, endDate }),
  });
};

export const useCreateEmotion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: EmotionRecordCreate) => emotionService.createEmotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotions'] });
      toast({
        title: '기록 완료',
        description: '감정이 성공적으로 기록되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        title: '오류 발생',
        description: '감정 기록에 실패했습니다.',
        variant: 'destructive',
      });
    },
  });
};

export const useEmotionStats = (days: number = 7) => {
  return useQuery({
    queryKey: ['emotion-stats', days],
    queryFn: () => emotionService.getStats(days),
  });
};

// hooks/useAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: analyticsService.getDashboard,
    refetchInterval: 60000, // 1분마다 자동 새로고침
  });
};

export const useWeeklyAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'weekly'],
    queryFn: analyticsService.getWeeklyAnalytics,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });
};

export const useMonthlyAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'monthly'],
    queryFn: analyticsService.getMonthlyAnalytics,
    staleTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
  });
};
```

---

## 6. API 서비스 레이어

```typescript
// services/api.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청에 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// services/emotionService.ts
import { api } from './api';
import { EmotionRecord, EmotionRecordCreate } from '@/types/emotion';

export const emotionService = {
  async getEmotions(params?: {
    skip?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<EmotionRecord[]> {
    const { data } = await api.get('/emotions', { params });
    return data;
  },
  
  async createEmotion(emotion: EmotionRecordCreate): Promise<EmotionRecord> {
    const { data } = await api.post('/emotions', emotion);
    return data;
  },
  
  async updateEmotion(id: string, emotion: Partial<EmotionRecordCreate>): Promise<EmotionRecord> {
    const { data } = await api.put(`/emotions/${id}`, emotion);
    return data;
  },
  
  async deleteEmotion(id: string): Promise<void> {
    await api.delete(`/emotions/${id}`);
  },
  
  async getStats(days: number): Promise<any> {
    const { data } = await api.get(`/emotions/stats?days=${days}`);
    return data;
  },
};

// services/analyticsService.ts
import { api } from './api';

export const analyticsService = {
  async getDashboard() {
    const { data } = await api.get('/analytics/dashboard');
    return data;
  },
  
  async getWeeklyAnalytics() {
    const { data } = await api.get('/analytics/weekly');
    return data;
  },
  
  async getMonthlyAnalytics() {
    const { data } = await api.get('/analytics/monthly');
    return data;
  },
  
  async getTrends() {
    const { data } = await api.get('/analytics/trends');
    return data;
  },
};
```

---

## 7. 라우팅

```typescript
// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/stores/authStore';

// Pages
import Dashboard from '@/pages/Dashboard';
import Emotions from '@/pages/Emotions';
import Focus from '@/pages/Focus';
import Todos from '@/pages/Todos';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
    },
  },
});

// Protected Route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="emotions" element={<Emotions />} />
            <Route path="focus" element={<Focus />} />
            <Route path="todos" element={<Todos />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
```

---

## 8. PWA 설정

### 8.1 Vite PWA 플러그인

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'ADHD Helper',
        short_name: 'ADHD Helper',
        description: 'ADHD 사용자를 위한 일상 관리 도우미',
        theme_color: '#6366f1',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24시간
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## 9. 테스트

### 9.1 Component Tests

```typescript
// tests/components/EmotionForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmotionForm } from '@/components/forms/EmotionForm';
import { vi } from 'vitest';

describe('EmotionForm', () => {
  it('renders emotion type buttons', () => {
    const onSubmit = vi.fn();
    render(<EmotionForm onSubmit={onSubmit} />);
    
    expect(screen.getByText('행복')).toBeInTheDocument();
    expect(screen.getByText('슬픔')).toBeInTheDocument();
    expect(screen.getByText('불안')).toBeInTheDocument();
  });
  
  it('submits form with valid data', async () => {
    const onSubmit = vi.fn();
    render(<EmotionForm onSubmit={onSubmit} />);
    
    // 감정 타입 선택
    fireEvent.click(screen.getByText('행복'));
    
    // 감정 강도 설정
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '4' } });
    
    // 메모 입력
    const textarea = screen.getByPlaceholderText('오늘 어떤 일이 있었나요?');
    fireEvent.change(textarea, { target: { value: '좋은 하루였어요' } });
    
    // 제출
    fireEvent.click(screen.getByText('기록하기'));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        emotion_level: 4,
        emotion_type: 'happy',
        note: '좋은 하루였어요',
      });
    });
  });
});
```

---

## 10. 성능 최적화

### 10.1 Code Splitting

```typescript
// 라우트 레벨 코드 스플리팅
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Analytics = lazy(() => import('@/pages/Analytics'));

// 사용
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### 10.2 이미지 최적화

```typescript
// 반응형 이미지
<picture>
  <source srcSet="/images/hero-mobile.webp" media="(max-width: 768px)" />
  <source srcSet="/images/hero-desktop.webp" media="(min-width: 769px)" />
  <img src="/images/hero-fallback.jpg" alt="Hero" loading="lazy" />
</picture>
```

### 10.3 Memoization

```typescript
import { memo, useMemo, useCallback } from 'react';

// 컴포넌트 메모이제이션
export const EmotionList = memo(({ emotions }: { emotions: Emotion[] }) => {
  // ...
});

// 값 메모이제이션
const sortedEmotions = useMemo(() => {
  return emotions.sort((a, b) => b.recorded_at.getTime() - a.recorded_at.getTime());
}, [emotions]);

// 콜백 메모이제이션
const handleDelete = useCallback((id: string) => {
  deleteEmotion(id);
}, [deleteEmotion]);
```

---

## 11. 접근성 (Accessibility)

### 11.1 시맨틱 HTML

```tsx
// 좋은 예
<nav aria-label="Main navigation">
  <button aria-label="Close dialog">×</button>
</nav>

// 나쁜 예
<div onClick={handleClick}>Click me</div>
```

### 11.2 키보드 네비게이션

```tsx
// 모든 인터랙티브 요소에 키보드 이벤트 추가
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</div>
```

---

## 12. 결론

이 프론트엔드 설계서는 ADHD 도우미 애플리케이션의 클라이언트 사이드 구현을 위한 포괄적인 가이드입니다.

### 핵심 강점
1. **모던 React 스택**: 최신 기술을 활용한 빠르고 안정적인 개발
2. **타입 안전성**: TypeScript로 런타임 에러 최소화
3. **반응형 디자인**: 모든 기기에서 최적의 사용자 경험
4. **성능 최적화**: 코드 스플리팅, 레이지 로딩, 메모이제이션
5. **PWA 지원**: 오프라인 사용 가능, 앱처럼 설치 가능

### 다음 단계
1. 프로젝트 초기 설정
2. UI 컴포넌트 라이브러리 구축
3. 페이지 컴포넌트 구현
4. API 연동
5. PWA 기능 추가
6. 테스트 작성
7. 배포

---

**문서 종료**
