import React, { useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { FaRegCalendarAlt } from 'react-icons/fa';

import { Button } from '@/atoms/Button';
import { RangeDatePicker } from '@/atoms/RangeDatePicker';
import { SingleDatePicker } from '@/atoms/SingleDatePicker';
import { RANGE_PICKER_TIMEOUT } from '@/constants/dayPicker';
import { PLAN_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { WeekSelector } from '@/molecules/WeekSelector';

interface DateSelectorProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedOption,
  setSelectedOption,
}) => {
  const { setSelectedDate, rangeDate, setRangeDate, selectedPlan } = useDate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRangePicker, setShowRangePicker] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const isRange = selectedPlan === PLAN_TYPES.WEEKLY_VIEW;

  const handleRangeSelect = (newRange?: DateRange) => {
    if (newRange?.from && newRange?.to) {
      setRangeDate(newRange);
      setTimeout(() => {
        setShowRangePicker(false);
      }, RANGE_PICKER_TIMEOUT);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current?.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
        setShowRangePicker(false);
      }
    }

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  return (
    <div className='relative' ref={calendarRef}>
      <Button
        className='box-border flex h-[40px] cursor-pointer items-center justify-center rounded-sm border border-black/10 bg-transparent py-1 font-[18px] tracking-[0.25px] text-black hover:bg-[#6c757d] hover:text-white'
        onClick={() => setShowDatePicker(!showDatePicker)}
      >
        <FaRegCalendarAlt className='h-5 w-5' />
      </Button>

      {showDatePicker && (
        <div className='absolute my-2 rounded-md'>
          {isRange ? (
            <>
              <WeekSelector
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                setShowRangePicker={setShowRangePicker}
              />
              {showRangePicker && (
                <RangeDatePicker
                  selectedRange={rangeDate}
                  onSelect={handleRangeSelect}
                />
              )}
            </>
          ) : (
            <SingleDatePicker
              onSelect={(date) => {
                if (date) setSelectedDate(date);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DateSelector;
