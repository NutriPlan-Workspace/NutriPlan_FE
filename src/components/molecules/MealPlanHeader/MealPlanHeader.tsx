import React, { useState } from 'react';
import { HiOutlineArchiveBoxXMark, HiOutlineArrowPath } from 'react-icons/hi2';
import { Button, Modal } from 'antd';

import { TargetPercentageSelect } from '@/atoms/TargetPercentageSelect';
import { cn } from '@/helpers/helpers';
import { useMealPlanSetupStatus } from '@/hooks/useMealPlanSetupStatus';
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
  const { canGenerate, nextSetupPath } = useMealPlanSetupStatus();
  const [autoGenerateMealPlan, { isLoading: isGenerating }] =
    useAutoGenerateMealPlanMutation();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [targetPercentage, setTargetPercentage] = useState(
    mealPlanDay?.targetPercentage ?? 100,
  );

  const handleConfirmDelete = () => {
    onClearMealDay();
    setIsConfirmModalOpen(false);
  };

  const handleRegenerate = async () => {
    if (!canGenerate) {
      showToastError(
        'Please complete Body & Goal and Nutrition Target before generating meals.',
      );
      return;
    }

    try {
      const formattedDate = new Date(mealDate).toISOString();
      await autoGenerateMealPlan({
        date: formattedDate,
        targetPercentage,
      }).unwrap();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to regenerate meal plan';
      showToastError(message);
    }
  };

  return (
    <div data-tour='planner-day-header' className='flex'>
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
          targetPercentage={targetPercentage}
        />
      </div>
      <div
        className={cn(
          'ml-auto flex items-center justify-center gap-1 transition-all duration-200',
        )}
      >
        {!canGenerate && (
          <a
            data-tour='planner-setup-link'
            href={nextSetupPath}
            className='mr-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100'
          >
            Complete setup
          </a>
        )}
        <TargetPercentageSelect
          value={targetPercentage}
          onChange={setTargetPercentage}
          disabled={!canGenerate || isGenerating}
          size='small'
        />
        <Button
          data-tour='planner-regenerate-day'
          onClick={handleRegenerate}
          loading={isGenerating}
          disabled={!canGenerate}
          type='text'
          shape='circle'
          icon={<HiOutlineArrowPath className='text-xl' />}
        />
        <Button
          data-tour='planner-clear-day'
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
