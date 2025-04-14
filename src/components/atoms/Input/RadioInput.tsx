import React, { useEffect, useState } from 'react';
import { Button } from 'antd';

import { cn } from '@/helpers/helpers';

interface Option {
  key: string;
  label: string;
  icon?: string;
}

interface RadioInputProps {
  options: Option[];
  defaultActiveKey?: string;
  onChange?: (value: string) => void;
}

const RadioInput: React.FC<RadioInputProps> = ({
  options,
  defaultActiveKey,
  onChange,
}) => {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    if (defaultActiveKey) {
      const matchedOption = options.find(
        (option) => option.key === defaultActiveKey,
      );
      if (matchedOption) {
        setActive(matchedOption.key);
      }
    }
  }, [defaultActiveKey, options]);

  return (
    <div className='inline-flex gap-2'>
      {options.map(({ key, label, icon }) => (
        <Button
          key={key}
          onClick={() => {
            setActive(key);
            onChange?.(key);
          }}
          className={cn(
            'flex items-center gap-2 rounded-xl border px-4 py-2 text-gray-700 transition-all duration-200 ease-in-out',
            active === key
              ? 'scale-[1.03] border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-300 bg-white hover:scale-105 hover:border-gray-400 hover:shadow-sm',
          )}
        >
          {icon && <span className='text-lg'>{icon}</span>}
          <span className='text-base'>{label}</span>
        </Button>
      ))}
    </div>
  );
};

export default RadioInput;
