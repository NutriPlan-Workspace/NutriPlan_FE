import { Role } from '@/constants/role';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}

export interface NutritionTarget {
  proteinTarget: {
    from: number;
    to: number;
  };
  carbTarget: {
    from: number;
    to: number;
  };
  fatTarget: {
    from: number;
    to: number;
  };
  title: string;
  calories: number;
  minimumFiber: number;
  maxiumSodium: number;
  maxiumCholesterol: number;
}

export interface UserResponse {
  success: boolean;
  message: string;
  code: number;
  data: User;
  error?: string;
}
