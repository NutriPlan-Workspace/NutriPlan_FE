import React, { useEffect, useRef } from 'react';
import { ConfigProvider, InputNumber, Select } from 'antd';

import { roundWithThreshold } from '@/constants/threshold';
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
    spanRef,
    isFocused,
    setIsFocused,
    handleValueChange,
    handleOptionChange,
  } = useAmountSelector({ currentUnit, currentAmount, options });

  const lastCommittedRef = useRef({
    amount: roundWithThreshold(currentAmount),
    unit: currentUnit,
  });

  useEffect(() => {
    lastCommittedRef.current = {
      amount: roundWithThreshold(currentAmount),
      unit: currentUnit,
    };
  }, [currentAmount, currentUnit]);

  return (
    <div className='align-center relative flex flex-col items-start justify-evenly'>
      {/* Real Input */}
      <div className='relative overflow-hidden'>
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
              onAmountChange(
                roundWithThreshold(value),
                selectedOption.index,
                cardId,
              );
            }}
            controls={false}
            variant='filled'
            className='ease bg-white transition-all duration-100'
            style={{ width: inputWidth }}
            status={status}
            addonAfter={
              <Select
                value={selectedOption.description}
                onChange={(newDescription) => {
                  const newOption = options.find(
                    (o) => o.description === newDescription,
                  );
                  if (!newOption) return;
                  // Calculate converted value before updating local state
                  const newValueCalculated =
                    (value / selectedOption.amount) * newOption.amount;
                  // apply threshold rounding
                  const rounded = roundWithThreshold(newValueCalculated);
                  // Update local state
                  handleOptionChange(newDescription);
                  // Commit to parent so unit & amount persist and DB updates
                  if (
                    lastCommittedRef.current.amount !== rounded ||
                    lastCommittedRef.current.unit !== newOption.index
                  ) {
                    onAmountChange(rounded, newOption.index, cardId);
                    lastCommittedRef.current = {
                      amount: rounded,
                      unit: newOption.index,
                    };
                  }
                }}
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
