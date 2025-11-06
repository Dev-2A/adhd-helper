import apiClient, { tokenManager } from "@/lib/api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  timezone?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/v1/auth/login', data);
    const { access_token, refresh_token } = response.data;
    tokenManager.setTokens(access_token, refresh_token);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<User> {
    const response = await apiClient.post<User>('/v1/auth/register', data);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/v1/auth/me');
    return response.data;
  }

  logout() {
    tokenManager.clearTokens();
  }
}

export const authService = new AuthService();