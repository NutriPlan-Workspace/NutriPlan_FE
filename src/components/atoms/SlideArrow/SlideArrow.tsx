import React from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import { Button } from 'antd';

import { useDate } from '@/contexts/DateContext';
import { cn } from '@/helpers/helpers';
import { shiftDate } from '@/utils/dateUtils';

interface ArrowProps {
  direction: 'prev' | 'next';
}

const SlideArrow: React.FC<ArrowProps> = ({ direction }) => {
  const { selectedDate, setSelectedDate } = useDate();

  const handleArrowClick = () => {
    const newDate = shiftDate(selectedDate, direction === 'next' ? 1 : -1);
    setSelectedDate(newDate);
  };

  return (
    <Button
      className={cn(
        'absolute top-0 z-1 flex h-full w-[30px] items-start justify-center border-none bg-transparent p-0 pt-[20px] opacity-20 transition-all duration-300 hover:opacity-60',
        direction === 'prev'
          ? 'left-0 bg-gradient-to-l from-transparent to-black/60'
          : 'right-0 bg-gradient-to-r from-transparent to-black/60',
      )}
      onClick={handleArrowClick}
    >
      {direction === 'prev' ? (
        <HiOutlineChevronLeft size={24} className='text-black' />
      ) : (
        <HiOutlineChevronRight size={24} className='text-black' />
      )}
    </Button>
  );
};

export default SlideArrow;
