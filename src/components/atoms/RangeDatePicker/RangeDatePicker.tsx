import React, { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { DayPicker } from 'react-day-picker';
import { startOfMonth } from 'date-fns';

interface RangeDatePickerProps {
  selectedRange?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
}

const MAX_RANGE_DAYS = 30;

const RangeDatePicker: React.FC<RangeDatePickerProps> = ({
  selectedRange,
  onSelect,
}) => {
  const [range, setRange] = useState<DateRange | undefined>(selectedRange);
  const [month, setMonth] = useState<Date>(
    startOfMonth(selectedRange?.from || new Date()),
  );

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
    if (selectedRange?.from) {
      setMonth(startOfMonth(selectedRange.from));
    }
    onSelect?.(selectedRange);
  };

  useEffect(() => {
    setRange(selectedRange);
    if (selectedRange?.from) {
      setMonth(startOfMonth(selectedRange.from));
    }
  }, [selectedRange]);

  return (
    <div className='absolute top-full left-full z-50 translate-x-[-15%] translate-y-[-85%] scale-[0.7] rounded-md border border-[#dedede] p-2 shadow-lg'>
      <DayPicker
        mode='range'
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
        max={MAX_RANGE_DAYS}
        month={month}
        onMonthChange={setMonth}
        modifiersClassNames={{
          hoverDay:
            'bg-primary-200 text-white rounded-md transition duration-300',
          range_start: 'bg-primary text-white font-bold rounded-l-md',
          range_end: 'bg-primary text-white font-bold rounded-r-md',
          range_middle: 'bg-primary-100 text-black',
        }}
        classNames={{
          months: 'flex flex-nowrap gap-2 justify-center',
          caption_label: 'font-display text-center',
          day: 'transition duration-300 hover:bg-primary-100 text-[14px]',
          selected: 'bg-primary text-white font-bold',
          today: 'text-primary',
          chevron: 'text-primary',
        }}
      />
    </div>
  );
};

export default RangeDatePicker;
