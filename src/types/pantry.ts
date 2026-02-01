export type PantryStatus = 'in_pantry' | 'need_buy';

export interface PantryItem {
  _id: string;
  userId: string;
  ingredientFoodId?: string;
  name: string;
  quantity: number;
  unit: string;
  status: PantryStatus;
  note?: string;
  imgUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PantrySuggestion {
  _id: string;
  name: string;
  imgUrls?: string[];
  categories?: number[];
  matchCount?: number;
}

export interface UpsertPantryItemPayload {
  name: string;
  quantity: number;
  unit: string;
  status: 'in_pantry' | 'need_buy';
  imgUrl?: string;
  ingredientFoodId?: string;
}

export interface SearchResponse {
  data?: {
    basicFood?: {
      foods?: unknown[];
    };
  };
}
