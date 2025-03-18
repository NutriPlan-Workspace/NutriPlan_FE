import React from 'react';
import { Typography } from 'antd';

import { PairButton } from '@/atoms/PairButton';
import { cn } from '@/helpers/helpers';
import { getDateOfMonth, getDayOfWeek } from '@/utils/day';

interface DayBoxHeaderProps {
  mealDate: Date;
  isToday: boolean;
  isHovered: boolean;
}

const DayBoxHeader: React.FC<DayBoxHeaderProps> = ({
  mealDate,
  isToday,
  isHovered,
}) => (
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
      <PairButton isHovered={isHovered} />
    </div>
  </div>
);

export default DayBoxHeader;
