import type { Food } from './food';

export interface CollectionDetail {
  _id: string;
  userId: string | { _id: string; fullName: string; email: string };
  title: string;
  img: string;
  description: string;
  foods: CollectionFood[];
  isFavorites: boolean;
  isExclusions: boolean;
  isCurated?: boolean;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly';
  recurringStartDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionFood {
  food: Food;
  date: string;
  _id: string;
}

export interface CollectionFoodBrief {
  food: string;
  date: string;
}

export interface Collection {
  _id: string;
  userId: string | { _id: string; fullName: string; email: string };
  title: string;
  img: string;
  description: string;
  foods: {
    food: string;
    date: string;
  }[];
  isFavorites: boolean;
  isExclusions: boolean;
  isCurated?: boolean;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly';
  recurringStartDate?: string;
  createdAt: string;
  updatedAt: string;
}
