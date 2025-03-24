import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';

import { useDate } from '@/contexts/DateContext';

interface SingleDatePickerProps {
  onSelect?: (date: Date | undefined) => void;
}

const SingleDatePicker: React.FC<SingleDatePickerProps> = ({ onSelect }) => {
  const { selectedDate } = useDate();

  const [selected, setSelected] = useState<Date | undefined>(selectedDate);
  const [month, setMonth] = useState<Date>(selectedDate ?? new Date());

  useEffect(() => {
    setSelected(selectedDate);
    if (selectedDate) {
      setMonth(selectedDate);
    }
  }, [selectedDate]);

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    onSelect?.(date);
  };

  return (
    <div className='absolute top-full left-full z-50 translate-x-[-15%] translate-y-[-15%] scale-[0.7] rounded-md border border-[#dedede] bg-white p-2 shadow-lg'>
      <DayPicker
        mode='single'
        selected={selected}
        onSelect={handleSelect}
        month={month}
        onMonthChange={setMonth}
        modifiers={{ datdateSelected: selectedDate }}
        modifiersClassNames={{
          hoverDay:
            'bg-primary-200 text-white rounded-md transition duration-300',
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

export default SingleDatePicker;
