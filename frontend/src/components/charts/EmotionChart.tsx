/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { emotionService } from "@/services/emotion.service";
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface EmotionChartProps {
  period: number;
}

export function EmotionChart({ period }: EmotionChartProps) {
  const { data: emotions = [] } = useQuery({
    queryKey: ['emotions', period],
    queryFn: () => emotionService.getEmotions({
      start_date: subDays(new Date(), period).toISOString(),
    }),
  });

  const { data: stats } = useQuery({
    queryKey: ['emotionStats', period],
    queryFn: () => emotionService.getEmotionStats(period),
  });

  // 날짜별 평균 감정 레벨 계산
  const dailyData = emotions.reduce((acc: any, emotion) => {
    const date = format(new Date(emotion.recorded_at), 'MM/dd');
    if (!acc[date]) {
      acc[date] = { total: 0, count: 0 };
    }
    acc[date].total += emotion.emotion_level;
    acc[date].count += 1;
    return acc;
  }, {});

  const dates = Object.keys(dailyData).sort();
  const averages = dates.map(date =>
  (dailyData[date].total / dailyData[date].count).toFixed(2)
  );

  // 라인 차트 데이터
  const lineData = {
    labels: dates,
    datasets: [
      {
        label: '일별 평균 감정 레벨',
        data: averages,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  // 도넛 차트 데이터 (감정 분포)
  const emotionColors: Record<string, string> = {
    happy: '#FDE047',
    sad: '#60A5FA',
    anxious: '#C084FC',
    calm: '#86EFAC',
    excited: '#FDBA74',
    angry: '#FCA5A5',
    neutral: '#D1D5DB',
  };

  const doughnutData = {
    labels: Object.keys(stats?.emotion_distribution || {}),
    datasets: [
      {
        data: Object.values(stats?.emotion_distribution || {}),
        backgroundColor: Object.keys(stats?.emotion_distribution || {}).map(
          emotion => emotionColors[emotion] || '#D1D5DB'
        ),
        borderWidth: 0,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '감정 레벨 추이',
      },
    },
    scales: {
      y: {
        min: 1,
        max: 5,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: '감정 분포',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <Line data={lineData} options={lineOptions} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="max-w-sm mx-auto">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
}