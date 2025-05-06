import React, { useState } from 'react';
import { HiOutlineArchiveBoxXMark } from 'react-icons/hi2';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { Modal, Typography } from 'antd';
import { Button } from 'antd';

import { DayBoxHeaderSkeleton } from '@/atoms/DayBoxHeaderSkeleton';
import { cn } from '@/helpers/helpers';
import { getDateOfMonth, getDayOfWeek } from '@/utils/dateUtils';

interface DayBoxHeaderProps {
  mealDate: Date;
  isToday: boolean;
  isHovered: boolean;
  isLoading: boolean;
  onClearMealDay: () => void;
}

const DayBoxHeader: React.FC<DayBoxHeaderProps> = ({
  mealDate,
  isToday,
  isLoading,
  onClearMealDay,
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const handleConfirmDelete = () => {
    onClearMealDay();
    setIsConfirmModalOpen(false);
  };

  if (isLoading) return <DayBoxHeaderSkeleton />;
  return (
    <div className='mb-[10px] px-[15px]'>
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
            'flex items-center justify-center transition-all duration-200',
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
