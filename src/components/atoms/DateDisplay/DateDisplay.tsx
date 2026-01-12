import React, { useEffect, useState } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';

import { PLAN_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { cn } from '@/helpers/helpers';
import { getDisplayMonthYear, getDisplayWeekRange } from '@/utils/dateUtils';

interface DateDisplayProps {
  isGroceries?: boolean;
  className?: string;
  showPrefix?: boolean;
  showGroceriesPrefix?: boolean;
  variant?: 'title' | 'compact';
}

const DateDisplay: React.FC<DateDisplayProps> = ({
  isGroceries = false,
  className,
  showPrefix = true,
  showGroceriesPrefix = true,
  variant = 'title',
}) => {
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
    <div
      className={cn(
        variant === 'compact'
          ? 'inline-flex min-w-0 items-center gap-x-2'
          : 'flex flex-wrap gap-x-3 pb-[10px] text-2xl tracking-[0.3px]',
        className,
      )}
    >
      {isGroceries ? (
        variant === 'compact' ? (
          <div className='flex min-w-0 items-center gap-3'>
            <span className='from-primary-100 to-primary-50 text-primary-700 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm'>
              <FaRegCalendarAlt className='h-4 w-4' />
            </span>

            <div className='min-w-0'>
              <div className='text-primary-700/80 text-[10px] font-semibold tracking-[0.18em] uppercase'>
                Week range
              </div>

              {(() => {
                const text = showGroceriesPrefix
                  ? `Groceries for ${dateText}`
                  : dateText;
                const [fromText, toText] = dateText.split(' - ');
                const hasRange = Boolean(fromText && toText);

                return (
                  <div className='min-w-0 truncate text-sm font-semibold text-gray-900'>
                    {hasRange ? (
                      <>
                        <span className='text-gray-900'>{fromText}</span>
                        <span className='text-primary-500 mx-2'>→</span>
                        <span className='text-primary-800'>{toText}</span>
                      </>
                    ) : (
                      <span className='text-gray-900'>{text}</span>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <p className='text-black'>
            {showGroceriesPrefix ? `Groceries for ${dateText}` : dateText}
          </p>
        )
      ) : (
        <>
          {showPrefix && <p className='text-secondary'>Meal Planner</p>}
          <p className='text-black'>{dateText}</p>
        </>
      )}
    </div>
  );
};

export default DateDisplay;
