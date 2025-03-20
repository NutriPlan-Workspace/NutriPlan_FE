import React, { useEffect, useRef, useState } from 'react';
import { ConfigProvider, InputNumber, Select } from 'antd';

const { Option } = Select;

interface AmountSelectorProps {
  defaultOptionValue: string;
  options: {
    value: string;
    amount: number;
    label: string;
  }[];
}

const AmountSelector: React.FC<AmountSelectorProps> = ({
  defaultOptionValue,
  options,
}) => {
  const [selectedOption, setSelectedOption] = useState(
    options.find(({ value }) => value === defaultOptionValue) || options[0],
  );
  const [value, setValue] = useState<number>(selectedOption.amount);
  const [inputWidth, setInputWidth] = useState(105);
  const [status, setStatus] = useState<'' | 'error' | 'warning'>('');
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      const newWidth =
        spanRef.current.getBoundingClientRect().width +
        55 +
        (isHovered || isFocused ? 22 : 0);

      setInputWidth(newWidth);
    }
  }, [value, selectedOption, isHovered, isFocused]);

  useEffect(() => {
    setStatus(value <= 0 ? 'warning' : '');
  }, [value]);

  // TODO: If value is Error, don't call API to update meal plan
  const handleValueChange = (val: number | null) => {
    const newVal = val || 0;
    if (newVal < 0) return;
    setValue(newVal);
  };

  const handleOptionChange = (newValue: string) => {
    const newOption = options.find(({ value }) => value === newValue);
    if (!newOption || !selectedOption) return;
    const newValueCalculated =
      (value / selectedOption.amount) * newOption.amount;
    setValue(newValueCalculated);
    setSelectedOption(newOption);
  };

  return (
    <div className='align-center relative flex flex-col justify-evenly'>
      {/* Real Input */}
      <div
        className='relative'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='absolute bottom-[-5px] left-0 h-[5px] w-full'></div>
        <ConfigProvider
          theme={{
            token: {
              colorText: isFocused ? 'black' : 'gray',
            },
            components: {
              InputNumber: {
                activeBorderColor: '#ffc84e',
              },
              Select: {
                optionSelectedBg: '#ffc84e3f',
              },
            },
          }}
        >
          <InputNumber
            size='small'
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              // TODO: call API to update meal plan
            }}
            controls={true}
            variant='filled'
            className='ease bg-white transition-all duration-100'
            style={{ width: inputWidth }}
            status={status}
            addonAfter={
              <Select
                value={selectedOption.value}
                onChange={handleOptionChange}
                defaultValue={defaultOptionValue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              >
                {options.map((option) => (
                  <Option
                    key={option.value}
                    value={option.value}
                    className='text-black'
                  >
                    {option.label}
                  </Option>
                ))}
              </Select>
            }
            value={value}
            onChange={handleValueChange}
          />
        </ConfigProvider>
      </div>
      {/* Span to get the size of the Input */}
      <span
        ref={spanRef}
        className='invisible absolute text-[14px] whitespace-pre'
      >
        {value} {selectedOption.label}
      </span>
    </div>
  );
};

export default AmountSelector;
