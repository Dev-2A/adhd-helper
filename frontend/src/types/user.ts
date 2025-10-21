/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  email: string;
  name: string;
  timezone: string;
  settings: Record<string, any>;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface UserCreate {
  email: string;
  name: string;
  password: string;
  timezone?: string;
}

export interface UserUpdate {
  name?: string;
  timezone?: string;
  settings?: Record<string, any>;
}