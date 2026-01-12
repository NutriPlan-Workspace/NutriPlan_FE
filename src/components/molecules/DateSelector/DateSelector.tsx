import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { createPortal } from 'react-dom';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { Tooltip } from 'antd';

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
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const isRange = selectedPlan === PLAN_TYPES.WEEKLY_VIEW;

  const popupPosition = useMemo(() => {
    if (!showDatePicker) return null;
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return null;

    // Default below the button, aligned to left.
    const gap = 10;
    let top = rect.bottom + gap;
    let left = rect.left;

    // Keep inside viewport horizontally (best-effort).
    const maxLeft = Math.max(8, window.innerWidth - 360);
    left = Math.min(left, maxLeft);
    left = Math.max(8, left);

    // If too low, flip above.
    const estimatedHeight = isRange ? 420 : 360;
    if (top + estimatedHeight > window.innerHeight - 8) {
      top = Math.max(8, rect.top - gap - estimatedHeight);
    }

    return { top, left };
  }, [isRange, showDatePicker]);

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
      const target = event.target as Node;
      const inAnchor = calendarRef.current?.contains(target);
      const inPopup = popupRef.current?.contains(target);
      if (!inAnchor && !inPopup) {
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
      <Tooltip title='Open calendar' overlayClassName='np-tooltip'>
        <Button
          ref={buttonRef}
          className='flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-gray-50 hover:text-gray-900 active:bg-gray-50'
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          <FaRegCalendarAlt className='h-5 w-5' />
        </Button>
      </Tooltip>

      {showDatePicker &&
        popupPosition &&
        createPortal(
          <div
            ref={popupRef}
            className='fixed z-[2147483647] rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_18px_36px_-24px_rgba(16,24,40,0.32)]'
            style={{ top: popupPosition.top, left: popupPosition.left }}
          >
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
          </div>,
          document.body,
        )}
    </div>
  );
};

export default DateSelector;
