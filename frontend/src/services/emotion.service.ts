import apiClient from "@/lib/api-client";

export type EmotionType = 'happy' | 'sad' | 'anxious' | 'calm' | 'excited' | 'angry' | 'neutral';

export interface EmotionRecord {
  id: string;
  user_id: string;
  emotion_level: number;
  emotion_type: EmotionType;
  note?: string;
  recorded_at: string;
  ai_analysis?: string;
  created_at: string;
}

export interface CreateEmotionRecord {
  emotion_level: number;
  emotion_type: EmotionType;
  note?: string;
  recorded_at?: string;
}

export interface EmotionStats {
  total_records: number;
  average_level: number;
  most_common_emotion: EmotionType | null;
  emotion_distribution: Record<string, number>;
  period_days: number;
}

class EmotionService {
  async createEmotion(data: CreateEmotionRecord): Promise<EmotionRecord> {
    const response = await apiClient.post<EmotionRecord>('/v1/emotions', data);
    return response.data;
  }

  async getEmotions(params?: {
    skip?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<EmotionRecord[]> {
    const response = await apiClient.get<EmotionRecord[]>('/v1/emotions', { params });
    return response.data;
  }

  async getEmotionStats(days: number = 7): Promise<EmotionStats> {
    const response = await apiClient.get<EmotionStats>('/v1/emotions/stats/summary', {
      params: { days }
    });
    return response.data;
  }

  async deleteEmotion(id: string): Promise<void> {
    await apiClient.delete(`/v1/emotions/${id}`);
  }
}

export const emotionService = new EmotionService();