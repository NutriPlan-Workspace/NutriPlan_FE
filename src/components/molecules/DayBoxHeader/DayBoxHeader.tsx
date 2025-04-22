import React, { useState } from 'react';
import {
  HiOutlineArchiveBoxXMark,
  HiOutlineArrowLeftEndOnRectangle,
  HiOutlineArrowRightStartOnRectangle,
  HiOutlineDocument,
  HiOutlineDocumentDuplicate,
} from 'react-icons/hi2';
import { MenuProps, Modal, Typography } from 'antd';

import { DayBoxHeaderSkeleton } from '@/atoms/DayBoxHeaderSkeleton';
import { PairButton } from '@/atoms/PairButton';
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
  isHovered,
  isLoading,
  onClearMealDay,
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const handleConfirmDelete = () => {
    onClearMealDay();
    setIsConfirmModalOpen(false);
  };

  const menuItems: MenuProps['items'] = [
    {
      label: 'Insert Blank Day',
      icon: <HiOutlineDocument />,
      key: '0',
    },
    {
      label: 'Clear Day',
      icon: <HiOutlineArchiveBoxXMark />,
      key: '1',
      onClick: () => {
        setIsConfirmModalOpen(true);
      },
    },
    {
      type: 'divider',
    },
    {
      label: 'Copy to another Meal Plan',
      icon: <HiOutlineDocumentDuplicate />,
      key: '2',
    },
    {
      label: 'Save Meal Plan',
      icon: <HiOutlineArrowRightStartOnRectangle />,
      key: '3',
    },
    {
      label: 'Load Meal Plan',
      icon: <HiOutlineArrowLeftEndOnRectangle />,
      key: '4',
    },
  ];
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
        <PairButton isHovered={isHovered} menuItems={menuItems} />
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
