import type { Food } from './food';

export interface CollectionDetail {
  _id: string;
  userId: string;
  title: string;
  img: string;
  description: string;
  foods: CollectionFood[];
  isFavorites: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionFood {
  food: Food;
  date: string;
  _id: string;
}

export interface BodyCollectionUpdate {
  _id: string;
  userId: string;
  title: string;
  img: string;
  description: string;
  foods: {
    food: string;
    date: string;
  }[];
  isFavorites: boolean;
  createdAt: string;
  updatedAt: string;
}
