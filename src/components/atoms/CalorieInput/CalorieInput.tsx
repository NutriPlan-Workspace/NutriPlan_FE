import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Select, Tooltip } from 'antd';

import { InputField } from '@/atoms/Input';
import { cn } from '@/helpers/helpers';

const CalorieInput: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className='flex flex-col items-center gap-4'>
      <Controller
        name='calories'
        control={control}
        render={({ field }) => (
          <div className='flex flex-col items-center'>
            <div className='relative flex items-center gap-2'>
              <label className='text-[16px] font-medium'>I want to eat</label>

              <div className='relative w-20'>
                <Tooltip
                  title={String(errors.calories?.message)}
                  open={!!errors.calories}
                >
                  <InputField
                    {...field}
                    type='number'
                    inputMode='numeric'
                    pattern='\d+'
                    className={cn(
                      'w-full appearance-none text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                      errors.calories
                        ? 'border-red-500 placeholder-red-500'
                        : '',
                    )}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? Number(value) : '');
                    }}
                  />
                </Tooltip>
              </div>

              <span className='text-[16px] font-medium'>calories</span>
            </div>
          </div>
        )}
      />

      <div className='flex items-center justify-center gap-2 text-[14px]'>
        <p>Not sure?</p>
        <a href='#' className='hover:underline'>
          Try our Calorie Calculator
        </a>
      </div>

      <Controller
        name='meals'
        control={control}
        render={({ field }) => (
          <div className='flex items-center gap-2'>
            <label className='text-[16px] font-medium'>in</label>
            <Select
              {...field}
              className='w-[60px] text-center'
              options={Array.from({ length: 5 }, (_, i) => ({
                value: String(i + 1),
                label: String(i + 1),
              }))}
            />
            <span className='text-[16px] font-medium'>meals</span>
          </div>
        )}
      />
    </div>
  );
};

export default CalorieInput;
