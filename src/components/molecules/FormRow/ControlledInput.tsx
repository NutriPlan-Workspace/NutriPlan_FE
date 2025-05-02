import React from 'react';
import { Control, Controller } from 'react-hook-form';

import { InputField } from '@/atoms/Input';
import { cn } from '@/helpers/helpers';
import { FoodFormSchema } from '@/schemas/recipeSchema';

interface ControlledInputProps {
  name: keyof FoodFormSchema;
  control: Control<FoodFormSchema>;
  error?: string;
  className?: string;
}

const ControlledInput: React.FC<ControlledInputProps> = ({
  name,
  control,
  error,
  className = '',
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <InputField
        {...field}
        value={
          typeof field.value === 'string' || typeof field.value === 'number'
            ? field.value
            : ''
        }
        className={cn(
          'rounded-sm',
          error && 'border border-red-500',
          className,
        )}
        error={error}
      />
    )}
  />
);

export default ControlledInput;
