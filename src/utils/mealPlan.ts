import { v4 as uuidv4 } from 'uuid';

import type { Food } from '@/types/food';
import type {
  MealItems,
  MealPlanDatabaseDTO,
  MealPlanDay,
  MealPlanFood,
} from '@/types/mealPlan';

const EMPTY_TEMPLATE: MealPlanDay = {
  _id: '',
  mealDate: '',
  mealItems: { breakfast: [], lunch: [], dinner: [] },
};

export function convertFoodCardToMealPlanFood(food: Food): MealPlanFood {
  return {
    _id: uuidv4(),
    foodId: {
      _id: food._id,
      name: food.name,
      imgUrls: food.imgUrls,
      property: {
        prepTime: food.property.prepTime,
        cookTime: food.property.cookTime,
      },
      nutrition: {
        carbs: food.nutrition.carbs,
        fats: food.nutrition.fats,
        proteins: food.nutrition.proteins,
        calories: food.nutrition.calories,
        fiber: food.nutrition.fiber,
        sodium: food.nutrition.sodium,
        cholesterol: food.nutrition.cholesterol,
      },
      units: food.units.map(
        (unit: { _id: string; amount: number; description: string }) => ({
          _id: unit._id,
          amount: unit.amount,
          description: unit.description,
        }),
      ),
    },
    amount: 1,
    unit: food.defaultUnit,
  };
}

export function getMealPlanDayAfterAddNewMealItem(
  mealPlanDay: MealPlanDay | undefined,
  mealType: keyof MealItems,
  mealCard: MealPlanFood | undefined,
  destinationIndex: number | undefined,
) {
  if (
    !mealPlanDay ||
    !mealType ||
    !mealCard ||
    destinationIndex === undefined
  ) {
    return EMPTY_TEMPLATE;
  }

  let updatedMealItems = [...mealPlanDay.mealItems[mealType]];

  if (destinationIndex === -1) {
    updatedMealItems.push(mealCard);
  } else {
    updatedMealItems.splice(destinationIndex, 0, mealCard);
  }

  return {
    _id: mealPlanDay._id || '',
    mealDate: mealPlanDay.mealDate || '',
    mealItems: {
      ...mealPlanDay.mealItems,
      [mealType]: updatedMealItems,
    },
  };
}

export function getMealPlanDayAfterRemoveMealItem(
  mealPlanDay: MealPlanDay | undefined,
  mealType: keyof MealItems,
  sourceIndex: number | undefined,
) {
  if (!mealPlanDay || !mealType || sourceIndex === undefined) {
    return EMPTY_TEMPLATE;
  }
  return {
    _id: mealPlanDay._id || '',
    mealDate: mealPlanDay.mealDate || '',
    mealItems: {
      breakfast: mealPlanDay.mealItems.breakfast ?? [],
      lunch: mealPlanDay.mealItems.lunch ?? [],
      dinner: mealPlanDay.mealItems.dinner ?? [],
      [mealType]: [
        ...mealPlanDay.mealItems[mealType].slice(0, sourceIndex),
        ...mealPlanDay.mealItems[mealType].slice(sourceIndex + 1),
      ],
    },
  };
}

export function getMealPlanDayAfterAddAndRemoveMealItem(
  mealPlanDay: MealPlanDay | undefined,
  sourceMealType: keyof MealItems,
  sourceIndex: number,
  destinationMealType: keyof MealItems,
  destinationIndex: number,
) {
  if (
    !mealPlanDay ||
    !sourceMealType ||
    sourceIndex === undefined ||
    !destinationMealType ||
    destinationIndex === undefined
  ) {
    return EMPTY_TEMPLATE;
  }

  const mealItem = JSON.parse(
    JSON.stringify(mealPlanDay.mealItems[sourceMealType][sourceIndex]),
  );

  const afterRemove = getMealPlanDayAfterRemoveMealItem(
    mealPlanDay,
    sourceMealType,
    sourceIndex,
  );

  return getMealPlanDayAfterAddNewMealItem(
    afterRemove,
    destinationMealType,
    mealItem,
    destinationIndex,
  );
}

export function getMealPlanDayAfterChangeAmount(
  mealPlanDay: MealPlanDay,
  mealType: keyof MealItems,
  cardId: string,
  amount: number,
  unit: number,
) {
  return {
    ...mealPlanDay,
    mealItems: {
      ...mealPlanDay.mealItems,
      [mealType]: mealPlanDay.mealItems[mealType].map((meal) => ({
        ...meal,
        amount: meal._id === cardId ? amount : meal.amount,
        unit: meal._id === cardId ? unit : meal.unit,
      })),
    },
  };
}

export function getMealPlanDayDatabaseDTOByMealPlanDay(
  mealPlanDay: MealPlanDay,
): MealPlanDatabaseDTO {
  return {
    _id: mealPlanDay._id,
    mealDate: mealPlanDay.mealDate,
    mealItems: {
      breakfast: mealPlanDay.mealItems.breakfast.map((meal) => ({
        foodId: meal.foodId._id,
        amount: meal.amount,
        unit: meal.unit,
      })),
      lunch: mealPlanDay.mealItems.lunch.map((meal) => ({
        foodId: meal.foodId._id,
        amount: meal.amount,
        unit: meal.unit,
      })),
      dinner: mealPlanDay.mealItems.dinner.map((meal) => ({
        foodId: meal.foodId._id,
        amount: meal.amount,
        unit: meal.unit,
      })),
    },
  };
}

export function generateEmptyMealPlan(mealDate: string) {
  return {
    mealDate: mealDate,
    mealItems: {
      breakfast: [],
      lunch: [],
      dinner: [],
    },
  };
}
