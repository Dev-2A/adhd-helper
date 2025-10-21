import { EmotionType } from "@/types/emotion";

export const EMOTION_OPTIONS: Array<{
  type: EmotionType;
  label: string;
  emoji: string;
  color: string;
}> = [
  { type: 'happy', label: '행복', emoji: '😊', color: '#22c55e' },
  { type: 'sad', label: '슬픔', emoji: '😥', color: '#3b82f6' },
  { type: 'anxious', label: '불안', emoji: '😰', color: '#f59e0b' },
  { type: 'calm', label: '평온', emoji: '😌', color: '#8b5cf6' },
  { type: 'excited', label: '신남', emoji: '🤩', color: '#ec4899' },
  { type: 'frustrated', label: '답답함', emoji: '😤', color: '#ef4444' },
  { type: 'content', label: '만족', emoji: '😊', color: '#10b981' },
];