import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from "@/stores/auth.store";
import { Emoji } from "@/components/common/Emoji";

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch {
      // 에러는 store에서 처리
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Emoji size="1.5em">✨</Emoji> 로그인
          </h2>
          <p className="mt-2 text-lg" style={{ color: '#8A8A8A' }}>
            ADHD Helper에 오신 것을 환영합니다
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(255, 182, 185, 0.2)', border: '2px solid #FFB6B9' }}>
              <p className="text-sm font-medium flex items-center gap-2" style={{ color: '#5A5A5A' }}>
                <Emoji>⚠️</Emoji> {error}
              </p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#5A5A5A' }}>
                <Emoji>📧</Emoji> 이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  color: '#5A5A5A',
                  border: '2px solid rgba(197, 185, 232, 0.4)',
                }}
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#5A5A5A' }}>
                <Emoji>🔒</Emoji> 비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  color: '#5A5A5A',
                  border: '2px solid rgba(197, 185, 232, 0.4)',
                }}
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl font-bold transition-all transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #C5B9E8 0%, #E0BBE4 100%)',
                color: '#FFFFFF',
                boxShadow: '0 4px 15px rgba(197, 185, 232, 0.3)'
              }}
            >
              <Emoji>✨</Emoji> {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>

          <div className="text-center text-sm">
            <span style={{ color: '#8A8A8A' }}>계정이 없으신가요? </span>
            <Link to="/register" className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-500 hover:to-pink-500">
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}