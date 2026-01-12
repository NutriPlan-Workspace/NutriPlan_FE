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
  variant?: 'default' | 'userHub';
  className?: string;
}

const RadioInput: React.FC<RadioInputProps> = ({
  options,
  defaultActiveKey,
  onChange,
  variant = 'default',
  className,
}) => {
  const [active, setActive] = useState<string>('');

  const styles =
    variant === 'userHub'
      ? {
          active:
            'scale-[1.03] border-rose-200 bg-rose-50 shadow-md text-[#e86852]',
          inactive:
            'border-black/5 bg-white/70 text-gray-700 hover:scale-[1.02] hover:border-rose-100 hover:shadow-sm',
        }
      : {
          active: 'scale-[1.03] border-blue-500 bg-blue-50 shadow-md',
          inactive:
            'border-gray-300 bg-white hover:scale-105 hover:border-gray-400 hover:shadow-sm',
        };

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
    <div className={cn('inline-flex flex-wrap gap-2', className)}>
      {options.map(({ key, label, icon }) => (
        <Button
          key={key}
          onClick={() => {
            setActive(key);
            onChange?.(key);
          }}
          className={cn(
            'flex items-center gap-2 rounded-xl border px-4 py-2 text-gray-700 transition-all duration-200 ease-in-out',
            active === key ? styles.active : styles.inactive,
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
