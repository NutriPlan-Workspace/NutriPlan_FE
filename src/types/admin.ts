export interface AdminListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUserBrief {
  _id: string;
  fullName: string;
  email: string;
}

export interface AdminMealPlanItem {
  foodId: string;
  amount: number;
  unit: number;
}

export interface AdminMealPlan {
  _id: string;
  userId: string | AdminUserBrief;
  mealDate: string;
  mealItems: {
    breakfast: AdminMealPlanItem[];
    lunch: AdminMealPlanItem[];
    dinner: AdminMealPlanItem[];
  };
  createdAt?: string;
  updatedAt?: string;
}
