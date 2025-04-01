import React from 'react';
import { ConfigProvider, InputNumber, Select } from 'antd';

import { useAmountSelector } from '@/hooks/useAmountSelector';

const { Option } = Select;

interface AmountSelectorProps {
  cardId: string;
  currentUnit: number;
  currentAmount: number;
  options: {
    index: number;
    amount: number;
    description: string;
  }[];
  onAmountChange: (amount: number, unit: number, cardId: string) => void;
}

const AmountSelector: React.FC<AmountSelectorProps> = ({
  cardId,
  currentUnit,
  currentAmount,
  options,
  onAmountChange,
}) => {
  const {
    selectedOption,
    value,
    inputWidth,
    status,
    isFocused,
    spanRef,
    setIsFocused,
    setIsHovered,
    handleValueChange,
    handleOptionChange,
  } = useAmountSelector({ currentUnit, currentAmount, options });

  return (
    <div className='align-center relative flex flex-col items-start justify-evenly'>
      {/* Real Input */}
      <div
        className='relative overflow-hidden'
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
              onAmountChange(value, selectedOption.index, cardId);
            }}
            controls={true}
            variant='filled'
            className='ease bg-white transition-all duration-100'
            style={{ width: inputWidth }}
            status={status}
            addonAfter={
              <Select
                value={selectedOption.description}
                onChange={handleOptionChange}
                defaultValue={'0'}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
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
