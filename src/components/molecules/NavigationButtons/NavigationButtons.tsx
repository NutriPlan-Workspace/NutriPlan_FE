import React, { useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import { Button } from '@/atoms/Button';
import { PLAN_TYPES, WEEK_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { DateSelector } from '@/molecules/DateSelector';
import {
  getWeekRange,
  isSameDateRange,
  shiftDate,
  shiftRange,
} from '@/utils/dateUtils';

const buttonClass =
  'flex items-center justify-center h-[40px] cursor-pointer py-1 font-[18px] tracking-[0.25px] rounded-sm bg-transparent box-border border border-black/10 text-black hover:text-white hover:bg-[#6c757d]';

const NavigationButtons: React.FC = () => {
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
      // TODO: handle other component external relative with
      return;
    }
    setSelectedDate(newDate);
  };

  return (
    <div className='relative flex items-center justify-center gap-1'>
      <Button
        htmlType='button'
        className={buttonClass}
        onClick={handlePrevButton}
      >
        <FaAngleLeft className='h-5 w-5' />
      </Button>

      <Button
        htmlType='button'
        className={buttonClass}
        onClick={() => handleGetToday()}
      >
        Jump To Today
      </Button>

      <DateSelector
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />

      <Button className={buttonClass} onClick={handleNextButton}>
        <FaAngleRight className='h-5 w-5' />
      </Button>
    </div>
  );
};

export default NavigationButtons;
