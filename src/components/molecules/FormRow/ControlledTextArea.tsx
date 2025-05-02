import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Input } from 'antd';

import { cn } from '@/helpers/helpers';
import { FoodFormSchema } from '@/schemas/recipeSchema';

interface ControlledTextAreaProps {
  name: keyof FoodFormSchema;
  control: Control<FoodFormSchema>;
  error?: string;
  className?: string;
  rows?: number;
  maxLength?: number;
}

const ControlledTextArea: React.FC<ControlledTextAreaProps> = ({
  name,
  control,
  error,
  className = '',
  rows = 3,
  maxLength = 300,
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <div className='flex flex-col gap-1'>
        <Input.TextArea
          {...field}
          rows={rows}
          maxLength={maxLength}
          value={typeof field.value === 'string' ? field.value : ''}
          className={cn(
            'resize-none rounded-sm',
            error && 'border border-red-500',
            className,
          )}
        />
        {error && <span className='text-sm text-red-500'>{error}</span>}
      </div>
    )}
  />
);

export default ControlledTextArea;
