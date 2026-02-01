import React from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { DatePicker, Tooltip } from 'antd';
import dayjs from 'dayjs';

import { Button } from '@/atoms/Button';
import { PLAN_TYPES, WEEK_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';

const { RangePicker } = DatePicker;

interface DateSelectorProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ setSelectedOption }) => {
  const { setSelectedDate, rangeDate, setRangeDate, selectedPlan } = useDate();
  const isRange = selectedPlan === PLAN_TYPES.WEEKLY_VIEW;

  // Handle Range Selection (Antd RangePicker)
  const onRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
  ) => {
    if (dates && dates[0] && dates[1]) {
      setRangeDate({
        from: dates[0].toDate(),
        to: dates[1].toDate(),
      });
      setSelectedOption(WEEK_TYPES.CUSTOM_RANGE);
    }
  };

  // Handle Single Date Selection (Antd DatePicker)
  const onDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date.toDate());
    }
  };

  return (
    <div className='relative'>
      <Tooltip title='Open calendar' classNames={{ root: 'np-tooltip' }}>
        <div className='relative'>
          <Button className='flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-gray-50 hover:text-gray-900 active:bg-gray-50'>
            <FaRegCalendarAlt className='h-5 w-5' />
          </Button>

          {/* Invisible Overlay */}
          <div className='absolute inset-0 overflow-hidden rounded-2xl opacity-0'>
            {isRange ? (
              <RangePicker
                className='h-full w-full opacity-0'
                allowClear={false}
                value={
                  rangeDate.from
                    ? [
                        dayjs(rangeDate.from),
                        rangeDate.to
                          ? dayjs(rangeDate.to)
                          : dayjs(rangeDate.from),
                      ]
                    : null
                }
                onChange={onRangeChange}
                dropdownClassName='dock-date-picker-dropdown'
              />
            ) : (
              <DatePicker
                className='h-full w-full opacity-0'
                allowClear={false}
                onChange={onDateChange}
                dropdownClassName='dock-date-picker-dropdown'
              />
            )}
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

export default DateSelector;
