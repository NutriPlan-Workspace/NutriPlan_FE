import React from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import { Button } from 'antd';

import { cn } from '@/helpers/helpers';

interface ArrowProps {
  direction: 'prev' | 'next';
  onClick?: () => void;
}

const SlideArrow: React.FC<ArrowProps> = ({ direction, onClick }) => (
  <Button
    className={cn(
      'absolute top-0 z-1 flex h-full w-[30px] items-start justify-center border-none bg-transparent p-0 pt-[20px] opacity-20 transition-all duration-300 hover:opacity-60',
      direction === 'prev'
        ? 'left-0 bg-gradient-to-l from-transparent to-black/60'
        : 'right-0 bg-gradient-to-r from-transparent to-black/60',
    )}
    onClick={onClick}
  >
    {direction === 'prev' ? (
      <HiOutlineChevronLeft size={24} className='text-black' />
    ) : (
      <HiOutlineChevronRight size={24} className='text-black' />
    )}
  </Button>
);

export default SlideArrow;
