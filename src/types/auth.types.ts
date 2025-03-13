import type { User } from './user.types';

export interface AuthResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    payload: User;
    accessToken: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}
