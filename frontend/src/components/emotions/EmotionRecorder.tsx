import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { emotionService, type EmotionType } from '@/services/emotion.service';
import { Heart, Frown, Brain, Smile, Zap, Angry, Meh } from 'lucide-react';

const emotionTypes: { value: EmotionType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'happy', label: '행복', icon: <Smile className="w-6 h-6" />, color: 'text-yellow-500' },
  { value: 'sad', label: '슬픔', icon: <Frown className="w-6 h-6" />, color: 'text-blue-500' },
  { value: 'anxious', label: '불안', icon: <Brain className="w-6 h-6" />, color: 'text-purple-500' },
  { value: 'calm', label: '평온', icon: <Heart className="w-6 h-6" />, color: 'text-green-500' },
  { value: 'excited', label: '흥분', icon: <Zap className="w-6 h-6" />, color: 'text-orange-500' },
  { value: 'angry', label: '분노', icon: <Angry className="w-6 h-6" />, color: 'text-red-500' },
  { value: 'neutral', label: '중립', icon: <Meh className="w-6 h-6" />, color: 'text-gray-500' },
];

export function EmotionRecorder() {
  const queryClient = useQueryClient();
  const [emotionLevel, setEmotionLevel] = useState(3);
  const [emotionType, setEmotionType] = useState<EmotionType>('neutral');
  const [note, setNote] = useState('');

  const createMutation = useMutation({
    mutationFn: emotionService.createEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotions'] });
      // 폼 초기화
      setEmotionLevel(3);
      setEmotionType('neutral');
      setNote('');
      alert('감정이 기록되었습니다!');
    },
    onError: () => {
      alert('감정 기록에 실패했습니다.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      emotion_level: emotionLevel,
      emotion_type: emotionType,
      note: note.trim() || undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">감정 기록하기</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 감정 레벨 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            감정 강도 (1-5)
          </label>
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setEmotionLevel(level)}
                className={`w-12 h-12 rounded-full font-semibold transition-all ${
                  emotionLevel === level
                    ? 'bg-blue-500 text-white scale-110'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* 감정 타입 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            감정 종류
          </label>
          <div className="grid grid-cols-4 gap-3">
            {emotionTypes.map((emotion) => (
              <button
                key={emotion.value}
                type="button"
                onClick={() => setEmotionType(emotion.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  emotionType === emotion.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`flex flex-col items-center ${emotion.color}`}>
                  {emotion.icon}
                  <span className="text-xs mt-1 text-gray-700">{emotion.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 메모 입력 */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            메모 (선택사항)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="오늘의 기분이나 상황을 간단히 적어보세요..."
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {createMutation.isPending ? '기록 중...' : '감정 기록하기'}
        </button>
      </form>
    </div>
  );
}