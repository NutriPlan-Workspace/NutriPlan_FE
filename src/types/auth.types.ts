import { User } from './user.types';

export interface AuthResponse {
  // TODO: Refine this
  success: boolean;
  total: number;
  data: User;
  message: string;
  additionalData: object;
}
