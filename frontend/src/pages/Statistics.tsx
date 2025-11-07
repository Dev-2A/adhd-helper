import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EmotionChart } from "@/components/charts/EmotionChart";
import { FocusChart } from "@/components/charts/FocusChart";
import { TodoChart } from "@/components/charts/TodoChart";
import { StatsOverview } from "@/components/stats/StatsOverview";
import { emotionService } from "@/services/emotion.service";
import { focusService } from "@/services/focus.service";
import { todoService } from "@/services/todo.service";

export function Statistics() {
  const [period, setPeriod] = useState(7); // 기본 7일

  // 통계 데이터 조회
  const { data: emotionStats } = useQuery({
    queryKey: ['emotionStats', period],
    queryFn: () => emotionService.getEmotionStats(period),
  });

  const { data: focusStats } = useQuery({
    queryKey: ['focusStats', period],
    queryFn: () => focusService.getFocusStats(period),
  });

  const { data: todoStats } = useQuery({
    queryKey: ['todoStats'],
    queryFn: () => todoService.getTodoStats(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">통계 및 분석</h1>
            
            {/* 기간 선택 */}
            <div className="flex gap-2">
              {[7, 14, 30, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => setPeriod(days)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    period === days
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {days}일
                </button>
              ))}
            </div>
          </div>

          {/* 통계 요약 카드 */}
          <StatsOverview
            emotionStats={emotionStats}
            focusStats={focusStats}
            todoStats={todoStats}
          />

          {/* 차트 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <EmotionChart period={period} />
            <FocusChart period={period} />
            <div className="lg:col-span-2">
              <TodoChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}