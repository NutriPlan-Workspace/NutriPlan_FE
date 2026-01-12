import React, { useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import { Button } from '@/atoms/Button';
import { PLAN_TYPES, WEEK_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { cn } from '@/helpers/helpers';
import { DateSelector } from '@/molecules/DateSelector';
import {
  getWeekRange,
  isSameDateRange,
  shiftDate,
  shiftRange,
} from '@/utils/dateUtils';

const buttonClass =
  'flex h-10 items-center justify-center rounded-2xl border border-gray-200 bg-white/90 px-3 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-gray-900 active:bg-gray-50';

const iconButtonClass = cn(
  buttonClass,
  'w-10 px-0 text-gray-700 hover:bg-gray-50',
);

type NavigationButtonsProps = {
  variant?: 'default' | 'compact';
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  variant = 'default',
}) => {
  const {
    selectedDate,
    setSelectedDate,
    selectedPlan,
    setRangeDate,
    rangeDate,
  } = useDate();
  const [selectedOption, setSelectedOption] = useState<string>(
    WEEK_TYPES.CURRENT_WEEK,
  );
  const newDate = new Date();

  const { from: startLastWeek, to: endLastWeek } = getWeekRange(newDate, -1);
  const { from: startNextWeek, to: endNextWeek } = getWeekRange(newDate, 1);

  const getUpdatedOption = (
    weekType: string,
    dateBegin?: Date,
    dateEnd?: Date,
  ): string => {
    const { start, end } =
      weekType === WEEK_TYPES.LAST_WEEK
        ? { start: startLastWeek, end: endLastWeek }
        : { start: startNextWeek, end: endNextWeek };

    return isSameDateRange(dateBegin!, dateEnd!, start!, end!)
      ? weekType
      : WEEK_TYPES.CUSTOM_RANGE;
  };

  const handleNextButton = (): void => {
    if (selectedPlan !== PLAN_TYPES.WEEKLY_VIEW) {
      setSelectedDate(shiftDate(selectedDate, 1));
      return;
    }
    const { from: dateBegin, to: dateEnd } = shiftRange(rangeDate, +1);
    setRangeDate({ from: dateBegin, to: dateEnd });
    if (selectedOption === WEEK_TYPES.CUSTOM_RANGE) {
      setSelectedOption(
        getUpdatedOption(WEEK_TYPES.LAST_WEEK, dateBegin, dateEnd),
      );
      return;
    }
    setSelectedOption(String(parseInt(selectedOption) + 1));
  };

  const handlePrevButton = (): void => {
    if (selectedPlan !== PLAN_TYPES.WEEKLY_VIEW) {
      setSelectedDate(shiftDate(selectedDate, -1));
      return;
    }
    const { from: dateBegin, to: dateEnd } = shiftRange(rangeDate, -1);
    setRangeDate({ from: dateBegin, to: dateEnd });
    if (selectedOption === WEEK_TYPES.LAST_WEEK) {
      setSelectedOption(WEEK_TYPES.CUSTOM_RANGE);
      return;
    }
    if (selectedOption === WEEK_TYPES.CUSTOM_RANGE) {
      setSelectedOption(
        getUpdatedOption(WEEK_TYPES.NEXT_WEEK, dateBegin, dateEnd),
      );
      return;
    }
    setSelectedOption(String(parseInt(selectedOption) - 1));
  };

  const handleGetToday = (): void => {
    if (selectedPlan === PLAN_TYPES.WEEKLY_VIEW) {
      setRangeDate(getWeekRange(newDate, 0));
      setTimeout(() => {
        setSelectedDate(newDate);
      }, 1000);
      return;
    }
    setSelectedDate(newDate);
  };

  const isCompact = variant === 'compact';
  const rootClass = isCompact
    ? 'relative flex items-center gap-1'
    : 'relative flex items-center justify-center gap-1';

  const compactButtonClass =
    'flex h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 active:bg-gray-50';
  const compactIconButtonClass = cn(compactButtonClass, 'w-10 px-0');

  return (
    <div className={rootClass}>
      <Button
        htmlType='button'
        className={isCompact ? compactIconButtonClass : iconButtonClass}
        onClick={handlePrevButton}
      >
        <FaAngleLeft className='h-5 w-5' />
      </Button>

      <Button
        htmlType='button'
        className={
          isCompact ? cn(compactButtonClass, 'px-3') : cn(buttonClass, 'px-4')
        }
        onClick={() => handleGetToday()}
      >
        {isCompact ? 'Current Week' : 'Jump To Today'}
      </Button>

      <DateSelector
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />

      <Button
        className={isCompact ? compactIconButtonClass : iconButtonClass}
        onClick={handleNextButton}
      >
        <FaAngleRight className='h-5 w-5' />
      </Button>
    </div>
  );
};

export default NavigationButtons;
