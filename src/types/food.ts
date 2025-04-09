export interface Food {
  _id: string;
  name: string;
  description: string;
  isRecipe: boolean;
  defaultUnit: number;
  categoryId: string;
  secondaryCategoryId: string;
  imgUrls: string[];
  nutrition: NutritionFields;
  property: PropertyFields;
  directions: string[];
  units: {
    _id: string;
    amount: number;
    description: string;
  }[];
  ingredients: {
    _id: string;
    ingredientFoodId: {
      _id: string;
      name: string;
    };
    amount: number;
    unit: number;
    preparation: string;
  }[];
  isCustom: boolean;
  userId: string;
  videoUrl: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DetailedFoodResponse {
  data: {
    mainFood: Food;
    ingredientList: Food[];
  };
}

export interface NutritionFields {
  carbs: number;
  fats: number;
  proteins: number;
  calories: number;
  netCarbs: number;
  caffeine: number;
  theobromine: number;
  fiber: number;
  calcium: number;
  iron: number;
  magnesium: number;
  phosphorus: number;
  potassium: number;
  sodium: number;
  zinc: number;
  copper: number;
  fluoride: number;
  manganese: number;
  selenium: number;
  vitAIu: number;
  vitA: number;
  vitB6: number;
  vitB12: number;
  vitC: number;
  vitDIu: number;
  vitD: number;
  vitD2: number;
  vitD3: number;
  vitE: number;
  vitK: number;
  retinol: number;
  lycopene: number;
  thiamine: number;
  riboflavin: number;
  niacin: number;
  folate: number;
  choline: number;
  betaCarotene: number;
  alphaCarotene: number;
  cholesterol: number;
  betaine: number;
  sugar: number;
  sucrose: number;
  glucose: number;
  fructose: number;
  lactose: number;
  maltose: number;
  galactose: number;
  starch: number;
  alcohol: number;
  water: number;
  tryptophan: number;
  threonine: number;
  isoleucine: number;
  leucine: number;
  lysine: number;
  methionine: number;
  cystine: number;
  phenylalanine: number;
  tyrosine: number;
  valine: number;
  arginine: number;
  histidine: number;
  alanine: number;
  asparticAcid: number;
  glutamicAcid: number;
  pantothenicAcid: number;
  glycine: number;
  proline: number;
  serine: number;
  hydroxyproline: number;
  transFats: number;
  saturatedFats: number;
  monounsaturatedFats: number;
  polyunsaturatedFats: number;
  alaFattyAcid: number;
  dhaFattyAcid: number;
  epaFattyAcid: number;
  dpaFattyAcid: number;
  totalOmega3: number;
  totalOmega6: number;
}

export interface PropertyFields {
  veggieServings: number;
  fruitServings: number;
  numberOfIngredients: number;
  singleServing: boolean;
  canBeBulk: boolean;
  keepsWell: boolean;
  allowPublic: boolean;
  needsBlender: boolean;
  needsOven: boolean;
  needsStove: boolean;
  needsSlowCooker: boolean;
  needsToaster: boolean;
  needsFoodProcessor: boolean;
  needsMicrowave: boolean;
  needsGrill: boolean;
  blatantlyUnhealthy: boolean;
  prepDayBefore: boolean;
  complexity: number;
  mainDish: boolean;
  sideDish: boolean;
  perishable: boolean;
  expirationTime: number;
  isBasicFood: boolean;
  cookTime: number;
  prepTime: number;
  waitTime: number;
  totalTime: number;
  isBreakfast: boolean;
  isLunch: boolean;
  isDinner: boolean;
  isSnack: boolean;
  isDessert: boolean;
  majorIngredients: string;
}

export interface FoodCategory {
  [category: string]: {
    foods: Food[];
    total: number;
  };
}
