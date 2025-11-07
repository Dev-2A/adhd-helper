import {
  TrendingUp, TrendingDown, Activity, Brain,
  CheckCircle, Clock, Heart, Target
} from 'lucide-react';

interface StatsOverviewProps {
  emotionStats?: any;
  focusStats?: any;
  todoStats?: any;
}

export function StatsOverview({ emotionStats, focusStats, todoStats }: StatsOverviewProps) {
  const stats = [
    {
      title: '평균 감정 레벨',
      value: emotionStats?.average_level?.toFixed(1) || '0',
      icon: <Heart className='w-6 h-6' />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      suffix: '/ 5',
    },
    {
      title: '주요 감정',
      value: emotionStats?.most_common_emotion || '없음',
      icon: <Activity className='w-6 h-6' />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: '총 집중 시간',
      value: focusStats?.total_minutes || 0,
      icon: <Clock className='w-6 h-6' />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      suffix: '분',
    },
    {
      title: '평균 생산성',
      value: focusStats?.average_productivity?.toFixed(1) || '0',
      icon: <Brain className='w-6 h-6' />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      suffix: '/ 5',
    },
    {
      title: '할 일 완료율',
      value: todoStats?.completion_rate || 0,
      icon: <CheckCircle className='w-6 h-6' />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      suffix: '%',
    },
    {
      title: '미완료 할 일',
      value: todoStats?.pending || 0,
      icon: <Target className='w-6 h-6' />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      suffix: '개',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`${stat.bgColor} rounded-lg p-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
                {stat.suffix && (
                  <span className="text-sm font-normal text-gray-500">
                    {stat.suffix}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}