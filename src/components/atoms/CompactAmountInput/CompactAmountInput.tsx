import React, { useEffect, useRef, useState } from 'react';
import { ConfigProvider, InputNumber, Select } from 'antd';

interface CompactAmountInputProps {
  amount: number;
  unit: string;
  onAmountChange?: (val: number | null) => void;
  onUnitChange?: (val: string) => void;
  unitOptions: { value: string; label: string }[];
  readOnly?: boolean;
  inputReadOnly?: boolean;
  unitDisabled?: boolean;
  min?: number;
}

const CompactAmountInput: React.FC<CompactAmountInputProps> = ({
  amount,
  unit,
  onAmountChange,
  onUnitChange,
  unitOptions,
  readOnly = false,
  inputReadOnly,
  unitDisabled,
  min = 0,
}) => {
  const isInputReadOnly = inputReadOnly ?? readOnly;
  const isUnitDisabled = unitDisabled ?? readOnly;

  const [width, setWidth] = useState(100);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Measure text width to adjust input size
  useEffect(() => {
    if (spanRef.current) {
      // Base width + padding/icon buffer.
      // 55px is a heuristic from useAmountSelector (30 padding + 25 arrow/border)
      const textWidth = spanRef.current.getBoundingClientRect().width;
      setWidth(textWidth + 55);
    }
  }, [amount, unit]);

  return (
    <div className='relative flex flex-col items-start justify-center'>
      {/* Hidden span for measurement */}
      <span
        ref={spanRef}
        className='invisible absolute text-[14px] whitespace-pre'
        aria-hidden='true'
      >
        {/* Add a bit of buffer chars if needed, but 'amount unit' is usually enough */}
        {amount} {unit}
      </span>

      <ConfigProvider
        theme={{
          token: {
            colorText: isFocused ? 'black' : 'gray',
          },
          components: {
            InputNumber: {
              activeBorderColor: 'var(--color-primary-400)',
            },
            Select: {
              optionSelectedBg:
                'color-mix(in srgb, var(--color-primary-200) 60%, white)',
            },
          },
        }}
      >
        <InputNumber
          size='small'
          min={min}
          value={amount}
          onChange={onAmountChange}
          readOnly={isInputReadOnly}
          controls={false}
          variant='filled'
          className='bg-white transition-all duration-100 ease-in-out'
          style={{ width: Math.min(width, 150) }} // Cap width at 150px
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          addonAfter={
            <Select
              value={unit}
              onChange={onUnitChange}
              size='small'
              variant='borderless'
              popupMatchSelectWidth={false}
              disabled={isUnitDisabled}
              className='max-w-[80px] [&_.ant-select-selection-item]:truncate'
              dropdownStyle={{ minWidth: 100 }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            >
              {unitOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          }
        />
      </ConfigProvider>
    </div>
  );
};

export default CompactAmountInput;
