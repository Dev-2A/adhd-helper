import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EmotionRecorder } from './EmotionRecorder';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('EmotionRecorder', () => {
  it('renders emotion recorder form', () => {
    render(<EmotionRecorder />, { wrapper });
    
    // h2 태그로 특정하여 제목 확인
    expect(screen.getByRole('heading', { name: '감정 기록하기' })).toBeInTheDocument();
    expect(screen.getByText('감정 강도 (1-5)')).toBeInTheDocument();
    expect(screen.getByText('감정 종류')).toBeInTheDocument();
    
    // 버튼 텍스트는 별도로 확인
    expect(screen.getByRole('button', { name: '감정 기록하기' })).toBeInTheDocument();
  });

  it('allows selecting emotion level', () => {
    render(<EmotionRecorder />, { wrapper });
    
    const levelButton = screen.getByRole('button', { name: '4' });
    fireEvent.click(levelButton);
    
    expect(levelButton).toHaveClass('bg-blue-500');
  });

  it('allows selecting emotion type', () => {
    render(<EmotionRecorder />, { wrapper });
    
    const happyButton = screen.getByText('행복').closest('button');
    fireEvent.click(happyButton!);
    
    expect(happyButton).toHaveClass('border-blue-500');
  });

  it('allows entering a note', () => {
    render(<EmotionRecorder />, { wrapper });
    
    const noteInput = screen.getByPlaceholderText(/오늘의 기분/);
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    expect(noteInput).toHaveValue('Test note');
  });
});