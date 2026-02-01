import React, { useMemo } from 'react';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import { DropIndicator } from '@/atoms/DropIndicator';
import { useToast } from '@/contexts/ToastContext';
import { useAutoPantryDeductSetting } from '@/hooks/useAutoPantryDeductSetting';
import useMealBoxDrop from '@/hooks/useMealBoxDrop';
import { MealCard } from '@/organisms/MealCard';
import { useUpdateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import { useConsumePantryItemsMutation } from '@/redux/query/apis/pantry/pantryApi';
import {
  mealPlanSelector,
  updateViewingMealPlanByDate,
} from '@/redux/slices/mealPlan';
import { makeSelectMealPlanByDate } from '@/redux/slices/mealPlan/selectors';
import { MealItems, MealPlanFood } from '@/types/mealPlan';
// import { isSameDay } from '@/utils/dateUtils';
import {
  getMealPlanDayAfterAddNewMealItem,
  getMealPlanDayAfterChangeAmount,
  getMealPlanDayAfterRemoveMealItem,
  getMealPlanDayDatabaseDTOByMealPlanDay,
} from '@/utils/mealPlan';

interface MealBoxContentProps {
  mealDate: string;
  mealType: keyof MealItems;
  mealItems: MealPlanFood[];
}

const MealBoxContent: React.FC<MealBoxContentProps> = ({
  mealDate,
  mealType,
  mealItems,
}) => {
  const dispatch = useDispatch();
  const { showToastError } = useToast();
  const { draggingCardHeight } = useSelector(mealPlanSelector);
  const [updateMealPlan] = useUpdateMealPlanMutation();
  const [consumePantryItems] = useConsumePantryItemsMutation();
  const { enabled: autoDeductEnabled } = useAutoPantryDeductSetting();
  const selectMealPlanByDate = useMemo(makeSelectMealPlanByDate, []);
  const currentMealPlan = useSelector(
    (state: import('@/redux/store').RootState) =>
      selectMealPlanByDate(state, mealDate),
  );
  const { mealBoxRef, isDragEnter, isOnlyItemDraggingOver } = useMealBoxDrop({
    mealDate,
    mealType,
  });

  const handleAmountChange = async (
    amount: number,
    unit: number,
    cardId: string,
  ) => {
    const currentMealPlanDay = currentMealPlan;

    if (!currentMealPlanDay || !currentMealPlanDay.mealPlanDay) {
      return;
    }

    const updatedMealPlanDay = getMealPlanDayAfterChangeAmount(
      currentMealPlanDay.mealPlanDay,
      mealType,
      cardId,
      amount,
      unit,
    );

    dispatch(
      updateViewingMealPlanByDate({
        mealPlanWithDate: {
          mealPlanDay: updatedMealPlanDay,
          mealDate: mealDate,
        },
      }),
    );

    const updatedMealPlanDatabaseDTO =
      getMealPlanDayDatabaseDTOByMealPlanDay(updatedMealPlanDay);

    await updateMealPlan({
      mealPlan: updatedMealPlanDatabaseDTO,
    });
  };

  const handleRemoveFood = async (index: number) => {
    const currentMealPlanDay = currentMealPlan;

    if (!currentMealPlanDay) {
      return;
    }

    const updatedMealPlanDay = getMealPlanDayAfterRemoveMealItem(
      currentMealPlanDay.mealPlanDay,
      mealType,
      index,
    );

    const updatedMealPlanDatabaseDTO =
      getMealPlanDayDatabaseDTOByMealPlanDay(updatedMealPlanDay);

    dispatch(
      updateViewingMealPlanByDate({
        mealPlanWithDate: {
          mealPlanDay: updatedMealPlanDay,
          mealDate: mealDate,
        },
      }),
    );

    await updateMealPlan({
      mealPlan: updatedMealPlanDatabaseDTO,
    });
  };

  const handleDuplicateFood = async (index: number) => {
    const currentMealPlanDay = currentMealPlan;

    if (!currentMealPlanDay?.mealPlanDay?.mealItems?.[mealType]) {
      return;
    }

    const duplicateItem = {
      ...JSON.parse(JSON.stringify(mealItems[index])),
      _id: uuidv4(),
    };

    const updatedMealPlanDay = getMealPlanDayAfterAddNewMealItem(
      currentMealPlanDay.mealPlanDay,
      mealType,
      duplicateItem,
      index + 1,
    );

    dispatch(
      updateViewingMealPlanByDate({
        mealPlanWithDate: {
          mealPlanDay: updatedMealPlanDay,
          mealDate: mealDate,
        },
      }),
    );

    const updatedMealPlanDatabaseDTO =
      getMealPlanDayDatabaseDTOByMealPlanDay(updatedMealPlanDay);

    await updateMealPlan({ mealPlan: updatedMealPlanDatabaseDTO }).unwrap();
  };

  const handleToggleEaten = async (cardId: string, isEaten: boolean) => {
    const currentMealPlanDay = currentMealPlan;

    if (!currentMealPlanDay?.mealPlanDay) {
      return;
    }

    const updatedMealPlanDay = {
      ...currentMealPlanDay.mealPlanDay,
      mealItems: {
        ...currentMealPlanDay.mealPlanDay.mealItems,
        [mealType]: currentMealPlanDay.mealPlanDay.mealItems[mealType].map(
          (meal) => (meal._id === cardId ? { ...meal, isEaten } : { ...meal }),
        ),
      },
    };

    dispatch(
      updateViewingMealPlanByDate({
        mealPlanWithDate: {
          mealPlanDay: updatedMealPlanDay,
          mealDate: mealDate,
        },
      }),
    );

    const updatedMealPlanDatabaseDTO =
      getMealPlanDayDatabaseDTOByMealPlanDay(updatedMealPlanDay);

    await updateMealPlan({ mealPlan: updatedMealPlanDatabaseDTO }).unwrap();

    if (isEaten && autoDeductEnabled) {
      const mealItem = updatedMealPlanDay.mealItems[mealType].find(
        (meal) => meal._id === cardId,
      );
      const food = mealItem?.foodId;

      if (mealItem && food?.ingredients?.length && food.units?.length) {
        const items = food.ingredients
          .map((ing) => {
            const ingredient = ing.ingredientFoodId;
            if (!ingredient) return null;
            const unitIndex = ing.unit;
            const ingredientUnit = ingredient.units?.[unitIndex];
            const baseUnitIndex = food.defaultUnit ?? mealItem.unit;
            const baseUnit = food.units?.[baseUnitIndex];
            const servingUnit = food.units?.[mealItem.unit];

            if (!baseUnit || !servingUnit) return null;

            const ingredientAmount =
              mealItem.unit === baseUnitIndex
                ? (mealItem.amount * ing.amount) / baseUnit.amount
                : (mealItem.amount * ing.amount) / servingUnit.amount;

            return {
              ingredientFoodId: ingredient._id,
              name: ingredient.name,
              quantity: ingredientAmount,
              unit: ingredientUnit?.description ?? 'serving',
            };
          })
          .filter(
            (
              item,
            ): item is {
              ingredientFoodId?: string;
              name: string;
              quantity: number;
              unit?: string;
            } => Boolean(item),
          );

        if (items.length > 0) {
          try {
            await consumePantryItems({ items }).unwrap();
          } catch (error) {
            showToastError(
              `Auto-deduct pantry failed. You can still adjust pantry manually. ${error}`,
            );
          }
        }
      }
    }
  };

  return (
    <div ref={mealBoxRef} className='min-h-[60px]'>
      {mealItems.length === 0 ? (
        <div className='pt-2'>
          {!isDragEnter ? (
            <Typography className='text-gray-500'>
              Hit{' '}
              <span className='inline-flex'>
                <HiOutlineArrowPath className='mx-1' />
              </span>{' '}
              to generate, or search for foods to add and drag them in.
            </Typography>
          ) : (
            <DropIndicator edge='bottom' mealCardHeight={draggingCardHeight} />
          )}
        </div>
      ) : (
        mealItems.map((mealItem, index) => (
          <MealCard
            key={mealItem._id}
            index={index}
            mealDate={mealDate}
            mealType={mealType}
            mealItem={mealItem}
            onAmountChange={handleAmountChange}
            onRemoveFood={handleRemoveFood}
            onDuplicateFood={handleDuplicateFood}
            onToggleEaten={handleToggleEaten}
          />
        ))
      )}
      {mealItems.length === 1 && isOnlyItemDraggingOver && isDragEnter && (
        <DropIndicator edge='bottom' mealCardHeight={draggingCardHeight} />
      )}
    </div>
  );
};
export default MealBoxContent;
