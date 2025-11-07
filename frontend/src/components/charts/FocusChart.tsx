/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { Bar } from 'react-chartjs-2';
import { focusService } from "@/services/focus.service";
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface FocusChartProps {
  period: number;
}

export function FocusChart({ period }: FocusChartProps) {
  const { data: sessions = [] } = useQuery({
    queryKey: ['focusSessions', period],
    queryFn: () => focusService.getSessions(),
  });

  // 날짜별 집중 시간 합계
  const dailyFocus = sessions
    .filter(session =>
      new Date(session.start_time) >= subDays(new Date(), period)
    )
    .reduce((acc: any, session) => {
      const date = format(new Date(session.start_time), 'MM/dd');
      if (!acc[date]) {
        acc[date] = { pomodoro: 0, deep_work: 0, break: 0 };
      }
      acc[date][session.session_type] += session.duration_minutes;
      return acc;
    }, {});
  
  const dates = Object.keys(dailyFocus).sort();

  const data = {
    labels: dates,
    datasets: [
      {
        label: '포모도로',
        data: dates.map(date => dailyFocus[date]?.pomodoro || 0),
        backgroundColor: '#EF4444',
      },
      {
        label: 'Deep Work',
        data: dates.map(date => dailyFocus[date]?.deep_work || 0),
        backgroundColor: '#8B5CF6',
      },
      {
        label: '휴식',
        data: dates.map(date => dailyFocus[date]?.break || 0),
        backgroundColor: '#10B981',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '일별 집중 시간 (분)',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  // 생산성 점수 차트
  const productivityData = sessions
    .filter(session => session.productivity_rating)
    .reduce((acc: any, session) => {
      const date = format(new Date(session.start_time), 'MM/dd');
      if (!acc[date]) {
        acc[date] = { total: 0, count: 0 };
      }
      acc[date].total += session.productivity_rating;
      acc[date].count += 1;
      return acc;
    }, {});
  
  const productivityDates = Object.keys(productivityData).sort();
  const productivityAverages = productivityDates.map(date =>
    (productivityData[date].total / productivityData[date].count).toFixed(2)
  );

  const productivityChartData = {
    labels: productivityDates,
    datasets: [
      {
        label: '평균 생산성',
        data: productivityAverages,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const productivityOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '일별 평균 생산성',
      },
    },
    scales: {
      y: {
        min: 1,
        max: 5,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <Bar data={data} options={options} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <Bar data={productivityChartData} options={productivityOptions} />
      </div>
    </div>
  );
}