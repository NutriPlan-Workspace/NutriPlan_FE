import React, { useState } from 'react';
import { HiOutlineArchiveBoxXMark, HiOutlineArrowPath } from 'react-icons/hi2';
import { Button, Modal } from 'antd';

import { cn } from '@/helpers/helpers';
import { DayBoxSummary } from '@/molecules/DayBoxSummary';
import { useAutoGenerateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import { useGetNutritionTargetQuery } from '@/redux/query/apis/user/userApi';
import { MealPlanDay } from '@/types/mealPlan';
import { formatDate, getDayOfWeek } from '@/utils/dateUtils';
import { showToastError } from '@/utils/toastUtils';

interface MealPlanHeaderProps {
  mealDate: string;
  mealPlanDay: MealPlanDay | undefined;
  onClearMealDay: () => void;
}

const MealPlanHeader: React.FC<MealPlanHeaderProps> = ({
  mealDate,
  mealPlanDay,
  onClearMealDay,
}) => {
  const mealItems = mealPlanDay?.mealItems || undefined;
  const allDayMealItems = mealItems
    ? [...mealItems.breakfast, ...mealItems.lunch, ...mealItems.dinner]
    : undefined;
  const { data } = useGetNutritionTargetQuery();
  const [autoGenerateMealPlan, { isLoading: isGenerating }] =
    useAutoGenerateMealPlanMutation();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const handleConfirmDelete = () => {
    onClearMealDay();
    setIsConfirmModalOpen(false);
  };

  const handleRegenerate = async () => {
    try {
      const formattedDate = new Date(mealDate).toISOString();
      await autoGenerateMealPlan({ date: formattedDate }).unwrap();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to regenerate meal plan';
      showToastError(message);
    }
  };

  return (
    <div className='flex'>
      <div>
        <p className='text-[14.4px] text-[#61676B]'>{formatDate(mealDate)}</p>
        <h1 className='text-[23.04px] text-[#00538F]'>
          {getDayOfWeek(new Date(mealDate))}
        </h1>
      </div>
      <div className='ml-8'>
        <DayBoxSummary
          isWeekly={true}
          targetNutrition={data?.data}
          allDayMealItems={allDayMealItems}
        />
      </div>
      <div
        className={cn(
          'ml-auto flex items-center justify-center transition-all duration-200',
        )}
      >
        <Button
          onClick={handleRegenerate}
          loading={isGenerating}
          type='text'
          shape='circle'
          icon={<HiOutlineArrowPath className='text-xl' />}
        />
        <Button
          onClick={() => {
            setIsConfirmModalOpen(true);
          }}
          disabled={isGenerating}
          type='text'
          shape='circle'
          icon={<HiOutlineArchiveBoxXMark className='text-xl' />}
        />
      </div>
      <Modal
        open={isConfirmModalOpen}
        onOk={handleConfirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        okText='Yes'
        cancelText='Cancel'
        okButtonProps={{ danger: true }}
        cancelButtonProps={{
          className:
            'bg-gray-400 text-white hover:bg-gray-500 border-none focus:outline-none',
        }}
      >
        <p>Are you sure you want to delete this diet?</p>
      </Modal>
    </div>
  );
};

export default MealPlanHeader;
