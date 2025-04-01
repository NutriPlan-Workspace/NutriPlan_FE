import type {
  MealItems,
  MealPlanDatabaseDTO,
  MealPlanDay,
  MealPlanFood,
} from '@/types/mealPlan';

const EMPTY_TEMPLATE: MealPlanDay = {
  _id: '',
  userId: '',
  mealDate: '',
  mealItems: { breakfast: [], lunch: [], dinner: [] },
};

export function getMealPlanDayAfterAddNewMeal(
  mealPlanMealItems: MealPlanFood[] | undefined,
  mealType: keyof MealItems,
  mealPlanDay: MealPlanDay | undefined,
) {
  if (!mealPlanMealItems || !mealType || !mealPlanDay) {
    return EMPTY_TEMPLATE;
  }
  return {
    _id: mealPlanDay._id || '',
    userId: mealPlanDay.userId || '',
    mealDate: mealPlanDay.mealDate || '',
    mealItems: {
      breakfast: mealPlanDay.mealItems.breakfast ?? [],
      lunch: mealPlanDay.mealItems.lunch ?? [],
      dinner: mealPlanDay.mealItems.dinner ?? [],
      [mealType as keyof MealItems]: mealPlanMealItems ?? [],
    },
  };
}

export function getMealPlanDayAfterMovingMealInSameDay(
  sourceMealPlanMealItems: MealPlanFood[] | undefined,
  destinationMealPlanMealItemsTo: MealPlanFood[] | undefined,
  sourceMealType: keyof MealItems,
  destinationMealType: keyof MealItems,
  mealPlanDay: MealPlanDay | undefined,
) {
  if (
    !sourceMealPlanMealItems ||
    !destinationMealPlanMealItemsTo ||
    !sourceMealType ||
    !destinationMealType ||
    !mealPlanDay
  ) {
    return EMPTY_TEMPLATE;
  }
  return {
    _id: mealPlanDay._id || '',
    userId: mealPlanDay.userId || '',
    mealDate: mealPlanDay.mealDate || '',
    mealItems: {
      breakfast: mealPlanDay.mealItems.breakfast ?? [],
      lunch: mealPlanDay.mealItems.lunch ?? [],
      dinner: mealPlanDay.mealItems.dinner ?? [],
      [sourceMealType as keyof MealItems]: sourceMealPlanMealItems,
      [destinationMealType as keyof MealItems]: destinationMealPlanMealItemsTo,
    },
  };
}

export function getMealPlanDayAfterRemoveMealItem(
  mealPlanDay: MealPlanDay | undefined,
  mealType: keyof MealItems,
  cardId: string | undefined,
) {
  if (!mealPlanDay || !mealType || !cardId) {
    return EMPTY_TEMPLATE;
  }
  return {
    _id: mealPlanDay._id || '',
    userId: mealPlanDay.userId || '',
    mealDate: mealPlanDay.mealDate || '',
    mealItems: {
      breakfast: mealPlanDay.mealItems.breakfast ?? [],
      lunch: mealPlanDay.mealItems.lunch ?? [],
      dinner: mealPlanDay.mealItems.dinner ?? [],
      [mealType as keyof MealItems]: mealPlanDay.mealItems[mealType].filter(
        (meal) => meal._id !== cardId,
      ),
    },
  };
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
    userId: mealPlanDay.userId,
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
