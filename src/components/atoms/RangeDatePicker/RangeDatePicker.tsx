import React, { useEffect, useState } from 'react';
import { HiArrowRight } from 'react-icons/hi2';
import { ConfigProvider, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

import { DateRange } from '@/types/date';

const { RangePicker } = DatePicker;

interface RangeDatePickerProps {
  selectedRange?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
}

const RangeDatePicker: React.FC<
  RangeDatePickerProps & { className?: string }
> = ({ selectedRange, onSelect, className }) => {
  // 'value' in Vue equivalent (controlled by parent prop sync in React)
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // 'dates' in Vue equivalent (tracked from onCalendarChange)
  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // 'hackValue' in Vue equivalent (used to override value during open/interaction?)
  // Vue snippet: :value="hackValue || value".
  // onOpenChange(open) -> hackValue = [], dates = [].
  // onOpenChange(close) -> hackValue = undefined.
  const [hackValue, setHackValue] = useState<
    [Dayjs | null, Dayjs | null] | null | undefined
  >(undefined);

  useEffect(() => {
    if (selectedRange?.from) {
      setValue([
        dayjs(selectedRange.from),
        selectedRange.to ? dayjs(selectedRange.to) : null,
      ]);
    } else {
      setValue(null);
    }
  }, [selectedRange]);

  // Track open state for display logic
  const [isOpen, setIsOpen] = useState(false);

  const disabledDate = (current: Dayjs) => {
    if (!dates) {
      return false;
    }
    const start = dates[0];
    const end = dates[1];

    // Check absolute difference > 7 days from any selected anchor
    if (start && Math.abs(current.diff(start, 'days')) > 7) {
      return true;
    }
    if (end && Math.abs(current.diff(end, 'days')) > 7) {
      return true;
    }
    return false;
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open); // Track open state
    if (open) {
      setDates([null, null]); // Vue: dates.value = []
      setHackValue([null, null]); // Vue: hackValue.value = []
    } else {
      setHackValue(undefined); // Vue: hackValue.value = undefined
    }
  };

  const onCalendarChange = (val: [Dayjs | null, Dayjs | null] | null) => {
    setDates(val);
  };

  const handleChange = (val: [Dayjs | null, Dayjs | null] | null) => {
    setValue(val);
    if (val && val[0]) {
      onSelect?.({
        from: val[0].toDate(),
        to: val[1] ? val[1].toDate() : undefined,
      });
    } else {
      onSelect?.(undefined);
    }
  };

  // Display Selection Logic
  // If Open: Use 'dates' (Intermediate). If 'dates' is [null, null], show placeholder.
  // If Closed: Use 'value' (Committed).
  const currentSelection = isOpen ? dates : value;
  const startDisplay = currentSelection?.[0];
  const endDisplay = currentSelection?.[1];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6fb478',
          borderRadius: 16,
          colorBorder: '#e5e7eb', // gray-200
          colorBgContainer: 'rgba(255, 255, 255, 0.9)',
          colorText: '#374151', // gray-700
        },
      }}
    >
      <div className={`relative ${className}`} style={{ width: 310 }}>
        {/* Custom Visual Display */}
        <div className='pointer-events-none absolute inset-0 flex items-center justify-start gap-4 rounded-2xl border border-gray-200 bg-white/90 pr-2 pl-4 shadow-sm backdrop-blur-sm'>
          <div className='flex items-center gap-1 text-sm font-semibold text-gray-700'>
            {startDisplay ? (
              <>
                <span>{startDisplay.format('YYYY-MM-DD')}</span>
                <span className='font-bold text-green-600'>
                  {startDisplay.format('ddd')}
                </span>
              </>
            ) : (
              <span className='font-normal text-gray-400'>Start Date</span>
            )}
          </div>

          <HiArrowRight
            className='h-4 w-4 stroke-2 text-gray-600'
            strokeWidth={2.5}
          />

          <div className='flex items-center gap-1 text-sm font-semibold text-gray-700'>
            {endDisplay ? (
              <>
                <span>{endDisplay.format('YYYY-MM-DD')}</span>
                <span className='font-bold text-green-600'>
                  {endDisplay.format('ddd')}
                </span>
              </>
            ) : (
              <span className='font-normal text-gray-400'>End Date</span>
            )}
          </div>
        </div>

        {/* Interactive Invisible Picker */}
        <RangePicker
          value={hackValue || value}
          onChange={handleChange}
          onCalendarChange={onCalendarChange}
          disabledDate={disabledDate}
          onOpenChange={onOpenChange}
          style={{ width: '100%', height: 40, opacity: 0 }}
          size='large'
          format='YYYY-MM-DD ddd'
          allowClear={false}
          inputReadOnly
        />
      </div>
    </ConfigProvider>
  );
};

export default RangeDatePicker;
