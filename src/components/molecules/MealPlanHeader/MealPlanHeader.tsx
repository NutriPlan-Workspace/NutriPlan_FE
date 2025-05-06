import React, { useState } from 'react';
import { HiOutlineArchiveBoxXMark, HiOutlineArrowPath } from 'react-icons/hi2';
import { Button, Modal } from 'antd';

import { cn } from '@/helpers/helpers';
import { DayBoxSummary } from '@/molecules/DayBoxSummary';
import { useGetNutritionTargetQuery } from '@/redux/query/apis/user/userApi';
import { MealPlanDay } from '@/types/mealPlan';
import { formatDate, getDayOfWeek } from '@/utils/dateUtils';

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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const handleConfirmDelete = () => {
    onClearMealDay();
    setIsConfirmModalOpen(false);
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
          // TODO: IMPLEMENT AUTO GENERATE MEAL PLAN
          onClick={(e) => e.preventDefault()}
          type='text'
          shape='circle'
          icon={<HiOutlineArrowPath className='text-xl' />}
        />
        <Button
          onClick={() => {
            setIsConfirmModalOpen(true);
          }}
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
