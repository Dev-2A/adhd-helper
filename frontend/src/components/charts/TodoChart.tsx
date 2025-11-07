/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { Pie, Bar } from 'react-chartjs-2';
import { todoService } from "@/services/todo.service";

export function TodoChart() {
  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: () => todoService.getTodos(),
  });

  const { data: stats } = useQuery({
    queryKey: ['todoStats'],
    queryFn: () => todoService.getTodoStats(),
  });

  // 우선순위별 분포
  const priorityDistribution = todos.reduce((acc: any, todo) => {
    const priority = `우선순위 ${todo.priority}`;
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: ['완료', '미완료', '기한 초과'],
    datasets: [
      {
        data: [
          stats?.completed || 0,
          (stats?.pending || 0) - (stats?.overdue || 0),
          stats?.overdue || 0,
        ],
        backgroundColor: ['#10B981', '#FCD34D', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: Object.keys(priorityDistribution),
    datasets: [
      {
        label: '할 일 개수',
        data: Object.values(priorityDistribution),
        backgroundColor: [
          '#D1D5DB',
          '#93C5FD',
          '#FDE047',
          '#FDBA74',
          '#FCA5A5',
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: '할 일 완료 현황',
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '우선순위별 할 일 분포',
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Pie data={pieData} options={pieOptions} />
        </div>
        <div>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900">{stats?.total || 0}</p>
          <p className="text-sm text-gray-600">전체 할 일</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600">{stats?.completed || 0}</p>
          <p className="text-sm text-gray-600">완료</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats?.pending || 0}</p>
          <p className="text-sm text-gray-600">진행 중</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-red-600">{stats?.overdue || 0}</p>
          <p className="text-sm text-gray-600">기한 초과</p>
        </div>
      </div>
    </div>
  );
}