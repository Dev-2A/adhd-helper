import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { focusService } from "@/services/focus.service";
import { Play, Pause, Square } from "lucide-react";
import { Emoji } from "@/components/common/Emoji";

const TIMER_TYPES = [
  {
    type: 'pomodoro' as const,
    label: '포모도로',
    emoji: '🍅',
    duration: 25,
    gradient: 'linear-gradient(135deg, #FFB6B9 0%, #FFD1DC 100%)',
    ringColor: '#FFB6B9'
  },
  {
    type: 'break' as const,
    label: '짧은 휴식',
    emoji: '☕',
    duration: 5,
    gradient: 'linear-gradient(135deg, #B4E7CE 0%, #C1F0C8 100%)',
    ringColor: '#B4E7CE'
  },
  {
    type: 'deep_work' as const,
    label: 'Deep Work',
    emoji: '🎯',
    duration: 45,
    gradient: 'linear-gradient(135deg, #C5B9E8 0%, #E0BBE4 100%)',
    ringColor: '#C5B9E8'
  },
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
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/50 hover:shadow-xl transition-shadow">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-center flex items-center justify-center gap-2">
        <Emoji size="1.4em">⏰</Emoji> 포모도로 타이머
      </h2>

      {/* 타이머 타입 선택 */}
      <div className="flex gap-3 mb-8 justify-center">
        {TIMER_TYPES.map((type) => (
          <button
            key={type.type}
            type="button"
            onClick={() => !isRunning && setSelectedType(type)}
            disabled={isRunning}
            className={`px-5 py-3 rounded-2xl font-semibold transition-all transform flex items-center gap-2 ${
              selectedType.type === type.type
                ? 'scale-105 shadow-lg'
                : 'shadow-md hover:shadow-lg hover:scale-105'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              background: selectedType.type === type.type ? type.gradient : 'rgba(255, 255, 255, 0.5)',
              color: '#5A5A5A'
            }}
          >
            <Emoji>{type.emoji}</Emoji> {type.label}
          </button>
        ))}
      </div>

      {/* 타이머 디스플레이 */}
      <div className="relative mb-8">
        <div className="w-64 h-64 mx-auto relative">
          {/* 진행률 원 */}
          <svg className="transform -rotate-90 w-64 h-64">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="#F0F0F0"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke={selectedType.ringColor}
              strokeWidth="12"
              fill="none"
              strokeDasharray={754}
              strokeDashoffset={754 - (754 * progress) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>

          {/* 시간 표시 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold" style={{ color: '#5A5A5A' }}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm mt-2 flex items-center gap-1" style={{ color: '#8A8A8A' }}>
              <Emoji>{selectedType.emoji}</Emoji> {selectedType.label}
            </span>
          </div>
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      <div className="flex justify-center gap-4">
        {!isRunning && !sessionId && (
          <button
            type="button"
            onClick={handleStart}
            disabled={startMutation.isPending}
            className="px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #B4E7CE 0%, #C1F0C8 100%)',
              color: '#5A5A5A'
            }}
          >
            <Play className="w-5 h-5" />
            시작
          </button>
        )}

        {isRunning && (
          <button
            type="button"
            onClick={handlePause}
            className="px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #FDFD96 0%, #FFD8B0 100%)',
              color: '#5A5A5A'
            }}
          >
            <Pause className="w-5 h-5" />
            일시정지
          </button>
        )}

        {!isRunning && sessionId && timeLeft > 0 && (
          <button
            type="button"
            onClick={handleResume}
            className="px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #AEC6CF 0%, #C3E5FF 100%)',
              color: '#5A5A5A'
            }}
          >
            <Play className="w-5 h-5" />
            재개
          </button>
        )}

        {sessionId && (
          <button
            type="button"
            onClick={handleStop}
            className="px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #FFB6B9 0%, #FFD1DC 100%)',
              color: '#5A5A5A'
            }}
          >
            <Square className="w-5 h-5" />
            종료
          </button>
        )}
      </div>

      {/* 현재 세션 정보 */}
      {currentSession && (
        <div className="mt-6 p-4 rounded-2xl" style={{ background: 'rgba(197, 185, 232, 0.2)' }}>
          <p className="text-sm font-semibold flex items-center gap-2" style={{ color: '#5A5A5A' }}>
            <Emoji>🎯</Emoji> 현재 진행 중: {currentSession.session_type} 세션
          </p>
          <p className="text-xs mt-1" style={{ color: '#8A8A8A' }}>
            시작 시간: {new Date(currentSession.start_time).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}