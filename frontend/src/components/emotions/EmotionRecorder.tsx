import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { emotionService, type EmotionType } from '@/services/emotion.service';
import { Heart, Frown, Brain, Smile, Zap, Angry, Meh } from 'lucide-react';
import { Emoji } from '@/components/common/Emoji';

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
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/50 hover:shadow-xl transition-shadow">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
        <Emoji size="1.4em">💝</Emoji> 감정 기록하기
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 감정 레벨 선택 */}
        <div>
          <label className="block text-sm font-semibold mb-4" style={{ color: '#5A5A5A' }}>
            감정 강도 (1-5)
          </label>
          <div className="flex items-center justify-center space-x-3">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setEmotionLevel(level)}
                className={`w-14 h-14 rounded-full font-bold transition-all transform hover:scale-105 ${
                  emotionLevel === level
                    ? 'scale-110 shadow-lg'
                    : 'shadow-md hover:shadow-lg'
                }`}
                style={{
                  background: emotionLevel === level
                    ? 'linear-gradient(135deg, #C5B9E8 0%, #E0BBE4 100%)'
                    : 'linear-gradient(135deg, #F0F0F0 0%, #E0E0E0 100%)',
                  color: emotionLevel === level ? '#FFFFFF' : '#8A8A8A'
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* 감정 타입 선택 */}
        <div>
          <label className="block text-sm font-semibold mb-4" style={{ color: '#5A5A5A' }}>
            감정 종류
          </label>
          <div className="grid grid-cols-4 gap-4">
            {emotionTypes.map((emotion) => (
              <button
                key={emotion.value}
                type="button"
                onClick={() => setEmotionType(emotion.value)}
                className={`p-4 rounded-2xl transition-all transform hover:scale-105 ${
                  emotionType === emotion.value
                    ? 'shadow-lg scale-105'
                    : 'shadow-md hover:shadow-lg'
                }`}
                style={{
                  background: emotionType === emotion.value
                    ? 'linear-gradient(135deg, rgba(197, 185, 232, 0.3) 0%, rgba(224, 187, 228, 0.3) 100%)'
                    : 'rgba(255, 255, 255, 0.5)',
                  border: emotionType === emotion.value ? '2px solid #C5B9E8' : '2px solid transparent'
                }}
              >
                <div className={`flex flex-col items-center ${emotion.color}`}>
                  {emotion.icon}
                  <span className="text-xs mt-2 font-medium" style={{ color: '#5A5A5A' }}>
                    {emotion.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 메모 입력 */}
        <div>
          <label htmlFor="note" className="block text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#5A5A5A' }}>
            <Emoji>💭</Emoji> 메모 (선택사항)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              color: '#5A5A5A',
              border: '2px solid rgba(255, 209, 220, 0.4)',
            }}
            placeholder="오늘의 기분이나 상황을 간단히 적어보세요..."
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full py-4 rounded-2xl font-bold transition-all transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #FFD1DC 0%, #FFB6B9 100%)',
            color: '#5A5A5A',
            boxShadow: '0 4px 15px rgba(255, 182, 185, 0.3)'
          }}
        >
          <Emoji>✨</Emoji> {createMutation.isPending ? '기록 중...' : '감정 기록하기'}
        </button>
      </form>
    </div>
  );
}