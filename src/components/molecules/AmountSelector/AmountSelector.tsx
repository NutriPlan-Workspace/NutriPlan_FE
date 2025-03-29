import React, { useEffect, useRef, useState } from 'react';
import { ConfigProvider, InputNumber, Select } from 'antd';

const { Option } = Select;

interface AmountSelectorProps {
  currentUnit: number;
  currentAmount: number;
  options: {
    amount: number;
    description: string;
  }[];
  onAmountChange: (newAmount: number, newUnit: number) => void;
}

const AmountSelector: React.FC<AmountSelectorProps> = ({
  onAmountChange,
  currentUnit,
  currentAmount,
  options,
}) => {
  const [selectedOption, setSelectedOption] = useState(
    options[currentUnit] || options[0],
  );
  const [value, setValue] = useState<number>(currentAmount);
  const [initialValue, setInitialValue] = useState(currentAmount);
  const [initialUnit, setInitialUnit] = useState(selectedOption.description);
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

  const handleValueChange = (val: number | null) => {
    const newVal = val || 0;
    if (newVal < 0) return;
    setValue(newVal);
  };

  const handleOptionChange = (newValue: string) => {
    const newOption = options.find(
      ({ description }) => description === newValue,
    );
    if (!newOption || !selectedOption) return;

    const newValueCalculated =
      (value / selectedOption.amount) * newOption.amount;
    setValue(newValueCalculated);
    setSelectedOption(newOption);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value !== initialValue || selectedOption.description !== initialUnit) {
      onAmountChange(value, 1);
      setInitialValue(value);
      setInitialUnit(selectedOption.description);
    }
  };

  return (
    <div className='align-center relative flex flex-col justify-evenly'>
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
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            controls={true}
            variant='filled'
            className='ease bg-white transition-all duration-100'
            style={{ width: inputWidth }}
            status={status}
            addonAfter={
              <Select
                value={selectedOption.description}
                onChange={handleOptionChange}
                defaultValue={selectedOption.description}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
              >
                {options.map((option) => (
                  <Option
                    key={option.description}
                    value={option.description}
                    className='text-black'
                  >
                    {option.description}
                  </Option>
                ))}
              </Select>
            }
            value={value}
            onChange={handleValueChange}
          />
        </ConfigProvider>
      </div>
      <span
        ref={spanRef}
        className='invisible absolute text-[14px] whitespace-pre'
      >
        {value} {selectedOption.description}
      </span>
    </div>
  );
};

export default AmountSelector;
