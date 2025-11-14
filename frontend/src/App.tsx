import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth.store';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { BarChart3, Home, Brain } from 'lucide-react';
import { Emoji } from '@/components/common/Emoji';

// Lazy load pages for better performance
const Login = lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('@/pages/Register').then(module => ({ default: module.Register })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Statistics = lazy(() => import('@/pages/Statistics').then(module => ({ default: module.Statistics })));
const AISettings = lazy(() => import('@/pages/AISettings').then(module => ({ default: module.AISettings })));

// Loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

function AppLayout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF8F3 0%, #FFF5F0 100%)' }}>
      <nav className="backdrop-blur-sm bg-white/70 shadow-sm border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <Emoji size="1.3em">✨</Emoji> ADHD Helper
                </h1>
              </Link>
              <div className="flex space-x-2">
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all hover:shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #FFD1DC 0%, #FFB6B9 100%)',
                    color: '#5A5A5A'
                  }}
                >
                  <Home className="w-4 h-4 mr-2" />
                  대시보드
                </Link>
                <Link
                  to="/statistics"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all hover:shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #AEC6CF 0%, #C3E5FF 100%)',
                    color: '#5A5A5A'
                  }}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  통계
                </Link>
                <Link
                  to="/ai-settings"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all hover:shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #C5B9E8 0%, #E0BBE4 100%)',
                    color: '#5A5A5A'
                  }}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI 설정
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <Emoji>👋</Emoji> {user?.name}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-full font-medium transition-all hover:shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #FDFD96 0%, #FFD8B0 100%)',
                  color: '#5A5A5A'
                }}
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-8">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/ai-settings" element={<AISettings />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<AppLayout />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;