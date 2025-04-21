import React from 'react';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import { DropIndicator } from '@/atoms/DropIndicator';
import useMealBoxDrop from '@/hooks/useMealBoxDrop';
import { MealCard } from '@/organisms/MealCard';
import { useUpdateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import {
  mealPlanSelector,
  updateViewingMealPlanByDate,
} from '@/redux/slices/mealPlan';
import { MealItems, MealPlanFood } from '@/types/mealPlan';
import { isSameDay } from '@/utils/dateUtils';
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
  const { draggingCardHeight } = useSelector(mealPlanSelector);
  const [updateMealPlan] = useUpdateMealPlanMutation();
  const viewingMealPlan = useSelector(mealPlanSelector).viewingMealPlans;
  const { mealBoxRef, isDragEnter, isOnlyItemDraggingOver } = useMealBoxDrop({
    mealDate,
    mealType,
  });

  const handleAmountChange = async (
    amount: number,
    unit: number,
    cardId: string,
  ) => {
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

  const handleRemoveFood = async (index: number) => {
    const currentMealPlanDay = viewingMealPlan.find((viewingMealPlanDay) =>
      isSameDay(new Date(viewingMealPlanDay.mealDate), new Date(mealDate)),
    );

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
    const currentMealPlanDay = viewingMealPlan.find((viewingMealPlanDay) =>
      isSameDay(new Date(viewingMealPlanDay.mealDate), new Date(mealDate)),
    );

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

    await updateMealPlan({ mealPlan: updatedMealPlanDatabaseDTO });
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
            key={index}
            index={index}
            mealDate={mealDate}
            mealType={mealType}
            mealItem={mealItem}
            onAmountChange={handleAmountChange}
            onRemoveFood={handleRemoveFood}
            onDuplicateFood={handleDuplicateFood}
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
