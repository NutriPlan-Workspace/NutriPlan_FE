import {
  DishType,
  PreferredFoodType,
  ValidFilter,
} from '@/constants/foodFilter';

export interface FoodFilterQuery {
  page?: number;
  limit?: number;

  q?: string;

  filters?: ValidFilter[];

  preferredFoodTypes?: PreferredFoodType[];

  applyExclusions?: boolean;
  searchCollections?: boolean;

  dishType?: DishType;

  collectionIds?: string[];

  minPer100CaloriesProteins?: number;
  maxPer100CaloriesCarbs?: number;
  maxPer100CaloriesFats?: number;
  minPer100CaloriesFiber?: number;
  maxPer100CaloriesSodium?: number;

  minCalories?: number;
  maxCalories?: number;
  minCarbs?: number;
  maxCarbs?: number;
  minCholesterol?: number;
  maxCholesterol?: number;
  minFats?: number;
  maxFats?: number;
  minFiber?: number;
  maxFiber?: number;
  minProteins?: number;
  maxProteins?: number;
  minSodium?: number;
  maxSodium?: number;
  minSugar?: number;
  maxSugar?: number;
}
