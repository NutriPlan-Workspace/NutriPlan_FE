import React, { useEffect, useState } from 'react';

import { PLAN_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { getDisplayMonthYear, getDisplayWeekRange } from '@/utils/dateUtils';

interface DateDisplayProps {
  isGroceries?: boolean;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ isGroceries = false }) => {
  const { rangeDate, selectedPlan, selectedDate } = useDate();
  const [dateText, setDateText] = useState<string>('');

  useEffect(() => {
    if (selectedPlan === PLAN_TYPES.WEEKLY_VIEW) {
      setDateText(getDisplayWeekRange(rangeDate.from, rangeDate.to));
    } else {
      setDateText(getDisplayMonthYear(selectedDate));
    }
  }, [selectedPlan, rangeDate, selectedDate]);

  return (
    <div className='flex flex-wrap gap-x-3 pb-[10px] text-2xl tracking-[0.3px]'>
      {isGroceries ? (
        <p className='text-black'>Groceries for {dateText}</p>
      ) : (
        <>
          <p className='text-primary'>Meal Planner</p>
          <p className='text-black'>{dateText}</p>
        </>
      )}
    </div>
  );
};

export default DateDisplay;
