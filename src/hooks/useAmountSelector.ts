import { useEffect, useRef, useState } from 'react';

interface UseAmountSelectorProps {
  currentUnit: number;
  currentAmount: number;
  options: {
    index: number;
    amount: number;
    description: string;
  }[];
}

export const useAmountSelector = ({
  currentUnit,
  currentAmount,
  options,
}: UseAmountSelectorProps) => {
  const [selectedOption, setSelectedOption] = useState(
    options[currentUnit] || options[0],
  );
  const [value, setValue] = useState<number>(currentAmount);
  const [inputWidth, setInputWidth] = useState(105);
  const [status, setStatus] = useState<'' | 'error' | 'warning'>('');
  const [isFocused, setIsFocused] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      const newWidth = spanRef.current.getBoundingClientRect().width + 55;
      setInputWidth(newWidth);
    }
  }, [value, selectedOption]);

  useEffect(() => {
    setStatus(value <= 0 ? 'warning' : '');
  }, [value]);

  const handleValueChange = (val: number | null) => {
    const newVal = val || 0;
    if (newVal < 0) return;
    setValue(newVal);
  };

  const handleOptionChange = (newDescription: string) => {
    const newOption = options.find(
      ({ description }) => description === newDescription,
    );
    if (!newOption || !selectedOption) return;

    const newValueCalculated =
      (value / selectedOption.amount) * newOption.amount;
    setValue(newValueCalculated);
    setSelectedOption(newOption);
  };

  return {
    selectedOption,
    value,
    inputWidth,
    status,
    spanRef,
    isFocused,
    setIsFocused,
    handleValueChange,
    handleOptionChange,
  };
};
