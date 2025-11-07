import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { focusService } from "@/services/focus.service";
import { Play, Pause, Square } from "lucide-react";

const TIMER_TYPES = [
  { type: 'pomodoro' as const, label: '포모도로', duration: 25, color: 'bg-red-500' },
  { type: 'break' as const, label: '짧은 휴식', duration: 5, color: 'bg-green-500' },
  { type: 'deep_work' as const, label: 'Deep Work', duration: 45, color: 'bg-purple-500' },
];

export function PomodoroTimer() {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState(TIMER_TYPES[0]);
  const [timeLeft, setTimeLeft] = useState(selectedType.duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 현재 진행 중인 세션 확인
  const { data: currentSession } = useQuery({
    queryKey: ['currentFocusSession'],
    queryFn: focusService.getCurrentSession,
    refetchInterval: 5000,
  });

  // 세션 시작
  const startMutation = useMutation({
    mutationFn: focusService.startSession,
    onSuccess: (data) => {
      setSessionId(data.id);
      setIsRunning(true);
      queryClient.invalidateQueries({ queryKey: ['currentFocusSession'] });
    },
  });

  // 세션 종료
  const endMutation = useMutation({
    mutationFn: ({ id, rating, notes }: { id: string; rating?: number; notes?: string;}) =>
      focusService.endSession(id, { productivity_rating: rating, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentFocusSession'] });
      queryClient.invalidateQueries({ queryKey: ['focusSessions'] });
      setSessionId(null);
      alert('세션이 완료되었습니다!');
    },
  });

  // 타이머 업데이트
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // 타이머 완료 시 알림
            if (sessionId) {
              const rating = prompt('생산성을 평가해주세요 (1-5):');
              const notes = prompt('메모를 남기시겠습니까?');
              endMutation.mutate({
                id: sessionId,
                rating: rating ? parseInt(rating) : undefined,
                notes: notes || undefined,
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, sessionId]);

  // 타입 변경 시 시간 리셋
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(selectedType.duration * 60);
    }
  }, [selectedType, isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    startMutation.mutate({
      duration_minutes: selectedType.duration,
      session_type: selectedType.type,
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    if (sessionId) {
      endMutation.mutate({ id: sessionId });
    }
    setTimeLeft(selectedType.duration * 60);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsRunning(true);
  };

  const progress = ((selectedType.duration * 60 - timeLeft) / (selectedType.duration * 60)) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">포모도로 타이머</h2>

      {/* 타이머 타입 선택 */}
      <div className="flex gap-2 mb-6">
        {TIMER_TYPES.map((type) => (
          <button
            key={type.type}
            onClick={() => !isRunning && setSelectedType(type)}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedType.type === type.type
                ? `${type.color} text-white`
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* 타이머 디스플레이 */}
      <div className="relative mb-6">
        <div className="w-48 h-48 mx-auto relative">
          {/* 진행률 원 */}
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={553}
              strokeDashoffset={553 - (553 * progress) / 100}
              className={`text-${selectedType.color.replace('bg-', '')}`}
              style={{ transition: 'stroke-dashoffset 1s' }}
            />
          </svg>

          {/* 시간 표시 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      <div className="flex justify-center gap-3">
        {!isRunning && !sessionId && (
          <button
            onClick={handleStart}
            disabled={startMutation.isPending}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            시작
          </button>
        )}

        {isRunning && (
          <button
            onClick={handlePause}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2"
          >
            <Pause className="w-5 h-5" />
            일시정지
          </button>
        )}

        {!isRunning && sessionId && timeLeft > 0 && (
          <button
            onClick={handleResume}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            재개
          </button>
        )}

        {sessionId && (
          <button
            onClick={handleStop}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
          >
            <Square className="w-5 h-5" />
            종료
          </button>
        )}
      </div>

      {/* 현재 세션 정보 */}
      {currentSession && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            현재 진행 중: {currentSession.session_type} 세션
          </p>
          <p className="text-xs text-blue-700">
            시작 시간: {new Date(currentSession.start_time).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}