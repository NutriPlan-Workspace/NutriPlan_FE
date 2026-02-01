import React, { useState } from 'react';
import { HiOutlineArchiveBoxXMark } from 'react-icons/hi2';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { Modal, Typography } from 'antd';
import { Button } from 'antd';

import { DayBoxHeaderSkeleton } from '@/atoms/DayBoxHeaderSkeleton';
import { TargetPercentageSelect } from '@/atoms/TargetPercentageSelect';
import { cn } from '@/helpers/helpers';
import { getDateOfMonth, getDayOfWeek } from '@/utils/dateUtils';

interface DayBoxHeaderProps {
  mealDate: Date;
  isToday: boolean;
  isHovered: boolean;
  isLoading: boolean;
  onClearMealDay: () => void;
  onGenerateMealDay: (targetPercentage?: number) => void;
  isGenerating?: boolean;
  canGenerate?: boolean;
  onOpenSetup?: () => void;
  currentTargetPercentage?: number;
}

const DayBoxHeader: React.FC<DayBoxHeaderProps> = ({
  mealDate,
  isToday,
  isLoading,
  onClearMealDay,
  onGenerateMealDay,
  isGenerating = false,
  canGenerate = true,
  onOpenSetup,
  currentTargetPercentage,
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [targetPercentage, setTargetPercentage] = useState(
    currentTargetPercentage ?? 100,
  );

  const handleConfirmDelete = () => {
    onClearMealDay();
    setIsConfirmModalOpen(false);
  };

  if (isLoading) return <DayBoxHeaderSkeleton />;
  return (
    <div data-tour='planner-daybox-header' className='mb-[10px] px-[15px]'>
      <Typography
        className={cn('text-[12px] uppercase', { 'text-primary-400': isToday })}
      >
        {getDayOfWeek(mealDate)}
      </Typography>
      <div className='flex justify-between'>
        <Typography
          className={cn(
            'text-[3.2rem] leading-[3.8rem]',
            isToday ? 'text-primary' : '',
          )}
        >
          {getDateOfMonth(mealDate)}
        </Typography>
        <div
          className={cn(
            'flex items-center justify-center gap-1 transition-all duration-200',
          )}
        >
          {!canGenerate && onOpenSetup && (
            <button
              type='button'
              data-tour='planner-setup-link'
              onClick={onOpenSetup}
              className='mr-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-100'
            >
              Complete setup
            </button>
          )}
          <TargetPercentageSelect
            value={targetPercentage}
            onChange={setTargetPercentage}
            disabled={!canGenerate || isGenerating}
            size='small'
          />
          <Button
            data-tour='planner-generate-day'
            onClick={(e) => {
              e.preventDefault();
              onGenerateMealDay(targetPercentage);
            }}
            type='text'
            shape='circle'
            icon={<HiOutlineArrowPath className='text-xl' />}
            loading={isGenerating}
            disabled={!canGenerate}
          />
          <Button
            data-tour='planner-clear-day'
            onClick={() => {
              setIsConfirmModalOpen(true);
            }}
            type='text'
            shape='circle'
            icon={<HiOutlineArchiveBoxXMark className='text-xl' />}
          />
        </div>
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

export default DayBoxHeader;
