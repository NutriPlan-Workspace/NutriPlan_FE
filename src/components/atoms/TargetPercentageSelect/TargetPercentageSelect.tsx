import React from 'react';
import { Select, Tooltip } from 'antd';

interface TargetPercentageSelectProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
}

const TARGET_PERCENTAGE_OPTIONS = [
  { value: 60, label: '60%' },
  { value: 80, label: '80%' },
  { value: 100, label: '100%' },
  { value: 110, label: '110%' },
  { value: 120, label: '120%' },
];

const TargetPercentageSelect: React.FC<TargetPercentageSelectProps> = ({
  value,
  onChange,
  disabled = false,
  size = 'small',
}) => (
  <Tooltip
    title="Percentage of your daily nutrition goals to apply for this day's meal plan."
    placement='bottom'
  >
    <div className='border-primary-200 bg-primary-50/60 hover:border-primary-300 hover:bg-primary-100/70 flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-0.5 transition-colors'>
      <span className='text-primary-700 text-xs font-semibold'>Goal:</span>
      <Select
        value={value}
        onChange={onChange}
        disabled={disabled}
        size={size}
        options={TARGET_PERCENTAGE_OPTIONS}
        variant='borderless'
        className='text-primary-600 min-w-[55px] font-bold'
        dropdownStyle={{ minWidth: 100 }}
        popupClassName='!min-w-[90px]'
      />
    </div>
  </Tooltip>
);

export default TargetPercentageSelect;
