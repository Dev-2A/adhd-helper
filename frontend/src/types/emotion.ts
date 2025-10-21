export type EmotionType =
  | 'happy'
  | 'sad'
  | 'anxious'
  | 'calm'
  | 'excited'
  | 'frustrated'
  | 'content';

export interface EmotionRecord {
  id: string;
  user_id: string;
  emotion_level: number; // 1-5
  emotion_type: EmotionType;
  note?: string;
  ai_analysis: {
    sentiment?: string;
    confidence?: number;
    keywords?: string[];
  };
  recorded_at: string;
}

export interface EmotionRecordCreate {
  emotion_level: number;
  emotion_type: EmotionType;
  note?: string;
}

export interface EmotionRecordUpdate {
  emotion_level?: number;
  emotion_type?: EmotionType;
  note?: string;
}

export interface EmotionStats {
  average_level: number;
  total_records: number;
  emotion_distribution: Record<EmotionType, number>;
  trend: 'improving' | 'declining' | 'stable';
}