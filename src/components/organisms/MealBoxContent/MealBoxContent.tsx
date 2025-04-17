import React from 'react';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from 'antd';

import { DropIndicator } from '@/atoms/DropIndicator';
import { MealCard } from '@/organisms/MealCard';
import { useUpdateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import {
  mealPlanSelector,
  updateViewingMealPlanByDate,
} from '@/redux/slices/mealPlan';
import { MealItems, MealPlanFood } from '@/types/mealPlan';
import { isSameDay } from '@/utils/dateUtils';
import {
  getMealPlanDayAfterAddNewMeal,
  getMealPlanDayAfterChangeAmount,
  getMealPlanDayAfterRemoveMealItem,
  getMealPlanDayDatabaseDTOByMealPlanDay,
} from '@/utils/mealPlan';

interface MealBoxContentProps {
  mealDate: string;
  mealType: keyof MealItems;
  mealItems: MealPlanFood[];
  isDragEnter: boolean;
}

const MealBoxContent: React.FC<MealBoxContentProps> = ({
  mealDate,
  mealType,
  mealItems,
  isDragEnter,
}) => {
  const dispatch = useDispatch();
  const draggingCardHeight = useSelector(mealPlanSelector).draggingCardHeight;
  const [updateMealPlan] = useUpdateMealPlanMutation();
  const viewingMealPlan = useSelector(mealPlanSelector).viewingMealPlans;

  const handleAmountChange = async (
    amount: number,
    unit: number,
    cardId: string,
  ) => {
    // Create copy of MealDay that have the updated mealItem
    const currentMealPlanDay = viewingMealPlan.find((viewingMealPlanDay) =>
      isSameDay(new Date(viewingMealPlanDay.mealDate), new Date(mealDate)),
    );

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

  const handleRemoveFood = async (cardId: string) => {
    // Create copy of MealDay that have the updated mealItem
    const currentMealPlanDay = viewingMealPlan.find((viewingMealPlanDay) =>
      isSameDay(new Date(viewingMealPlanDay.mealDate), new Date(mealDate)),
    );

    if (!currentMealPlanDay) {
      return;
    }

    const updatedMealPlanDay = getMealPlanDayAfterRemoveMealItem(
      currentMealPlanDay.mealPlanDay,
      mealType,
      cardId,
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

  const handleDuplicateFood = async (cardId: string) => {
    // Create copy of MealDay that have the updated mealItem
    const currentMealPlanDay = viewingMealPlan.find((viewingMealPlanDay) =>
      isSameDay(new Date(viewingMealPlanDay.mealDate), new Date(mealDate)),
    );

    if (!currentMealPlanDay?.mealPlanDay?.mealItems?.[mealType]) {
      return;
    }

    const mealItems = [...currentMealPlanDay.mealPlanDay.mealItems[mealType]];

    const index = mealItems.findIndex((meal) => meal._id === cardId);
    if (index !== -1 && mealItems[index].foodId) {
      const duplicateItem = {
        ...JSON.parse(JSON.stringify(mealItems[index])),
        _id: `${cardId}-${Date.now()}`,
      };

      mealItems.splice(index + 1, 0, duplicateItem);
    }

    const updatedMealPlanDay = getMealPlanDayAfterAddNewMeal(
      mealItems,
      mealType,
      currentMealPlanDay.mealPlanDay,
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

    await updateMealPlan({ mealPlan: updatedMealPlanDatabaseDTO });
  };

  return (
    <>
      {mealItems.length === 0 ? (
        <>
          <Typography className='mt-2 text-gray-500'>
            Hit{' '}
            <span className='inline-flex'>
              <HiOutlineArrowPath className='mx-1' />
            </span>{' '}
            to generate, or search for foods to add and drag them in.
          </Typography>
          {isDragEnter && (
            <DropIndicator edge='bottom' mealCardHeight={draggingCardHeight} />
          )}
        </>
      ) : (
        mealItems.map((mealItem) => (
          <MealCard
            key={mealItem._id}
            mealDate={mealDate}
            mealType={mealType}
            mealItem={mealItem}
            onAmountChange={handleAmountChange}
            onRemoveFood={handleRemoveFood}
            onDuplicateFood={handleDuplicateFood}
          />
        ))
      )}
    </>
  );
};
export default MealBoxContent;
