import apiClient from "@/lib/api-client";

export type SessionType = 'pomodoro' | 'deep_work' | 'break' | 'custom';

export interface FocusSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  duration_minutes: number;
  session_type: SessionType;
  productivity_rating?: number;
  notes?: string;
  created_at: string;
}

export interface CreateFocusSession {
  duration_minutes?: number;
  session_type?: SessionType;
}

export interface EndFocusSession {
  productivity_rating?: number;
  notes?: string;
}

export interface FocusStats {
  total_sessions: number;
  total_minutes: number;
  average_duration: number;
  average_productivity: number;
  period_days: number;
}

class FocusService {
  async startSession(data?: CreateFocusSession): Promise<FocusSession> {
    const response = await apiClient.post<FocusSession>('/v1/focus', {
      duration_minutes: data?.duration_minutes || 25,
      session_type: data?.session_type || 'pomodoro',
      start_time: new Date().toISOString(),
    });
    return response.data;
  }

  async getCurrentSession(): Promise<FocusSession | null> {
    const response = await apiClient.get<FocusSession | null>('/v1/focus/current');
    return response.data;
  }

  async endSession(id: string, data: EndFocusSession): Promise<FocusSession> {
    const response = await apiClient.put<FocusSession>(`/v1/focus/${id}/end`, data);
    return response.data;
  }

  async getSessions(): Promise<FocusSession[]> {
    const response = await apiClient.get<FocusSession[]>('/v1/focus');
    return response.data;
  }

  async getFocusStats(days: number = 7): Promise<FocusStats> {
    const response = await apiClient.get<FocusStats>('/v1/focus/stats/summary', {
      params: { days }
    });
    return response.data;
  }
}

export const focusService = new FocusService();