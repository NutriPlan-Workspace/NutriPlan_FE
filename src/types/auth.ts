import type { UserAuth } from './user';

export interface AuthResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    payload: UserAuth;
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  code: number;
  error?: string;
}
