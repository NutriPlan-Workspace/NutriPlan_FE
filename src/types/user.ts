import { Role } from '@/constants/role';
import { PrimaryDietType } from '@/constants/user';

interface Range {
  from: number;
  to: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  physicalStat: {
    gender: Gender;
    heightRecords: { date: Date; height: number }[];
    weightRecords: { date: Date; weight: number }[];
    dateOfBirth: Date;
    bodyFat: BodyFat;
    activityLevel: ActivityLevel;
  };
  nutritionGoals: {
    calories: number;
    proteinTarget: Range;
    carbTarget: Range;
    fatTarget: Range;
    minimumFiber: number;
    maxiumSodium: number;
    maxiumCholesterol: number;
    goalType: NutritionGoals;
  };
  primaryDiet: PrimaryDietType;
}

export interface PhysicalStatsValues {
  height: number | null;
  weight: number | null;
  dateOfBirth: string;
  gender: string;
  bodyFat: string;
  activityLevel: string;
}

export interface WeightGoalValues {
  weight: number | null;
  goalType: string;
}

export interface PhysicalStatResponse {
  success: boolean;
  total: number;
  data: User['physicalStat'];
  message: string;
  additionalData: object;
}

export interface NutritionGoalResponse {
  success: boolean;
  total: number;
  data: User['nutritionGoals'];
  message: string;
  additionalData: object;
}

export interface PrimaryDietResponse {
  success: boolean;
  total: number;
  data: User['primaryDiet'];
  message: string;
  additionalData: object;
}

export interface NutritionGoal {
  userId?: string;
  calories: number;
  proteinTarget: Range;
  carbTarget: Range;
  fatTarget: Range;
  goalType: string | undefined;
}

export interface PrimaryDietArgs {
  primaryDiet: PrimaryDietType;
}

export interface PhysicalStat {
  userId: string;
  gender: string;
  heightRecords: { height: number }[];
  weightRecords: { weight: number }[];
  dateOfBirth: string;
  bodyFat: string;
  activityLevel: string;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum BodyFat {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum ActivityLevel {
  SEDENTARY = 'sedentary',
  LIGHT = 'light',
  MODERATE = 'moderate',
  ACTIVE = 'active',
  VERY_ACTIVE = 'very_active',
}

export enum NutritionGoals {
  LOSE_FAT = 'lose fat',
  MAINTAIN_WEIGHT = 'maintain weight',
  BUILD_MUSCLE = 'build muscle',
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
