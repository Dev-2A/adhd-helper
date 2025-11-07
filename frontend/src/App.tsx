import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";
import { useAuthStore } from "./stores/auth.store";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Statistics } from "./pages/Statistics";
import { BarChart3, Home } from "lucide-react";

function AppLayout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold">ADHD Helper</h1>
              <div className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <Home className="w-4 h-4 mr-1" />
                  대시보드
                </Link>
                <Link
                  to="/statistics"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  통계
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded hover:bg-gray-100"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<AppLayout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;