import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Select, Tooltip } from 'antd';

import { InputField } from '@/atoms/Input';
import { cn } from '@/helpers/helpers';

type CalorieInputProps = {
  variant?: 'default' | 'compact';
  className?: string;
};

const CalorieInput: React.FC<CalorieInputProps> = ({
  variant = 'default',
  className,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const isCompact = variant === 'compact';

  return (
    <div
      className={cn(
        isCompact
          ? 'flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-100/70 bg-white/75 px-3 py-3'
          : 'flex flex-col items-start gap-4',
        className,
      )}
    >
      <Controller
        name='calories'
        control={control}
        render={({ field }) => (
          <div
            className={cn(
              'flex items-center gap-2',
              isCompact
                ? 'rounded-xl border border-white/60 bg-white/80 px-3 py-2'
                : 'flex-col items-start',
            )}
          >
            <span
              className={cn(
                'font-medium text-gray-700',
                isCompact
                  ? 'text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase'
                  : 'text-sm',
              )}
            >
              Calories
            </span>

            <div className={cn('relative', isCompact ? 'w-[92px]' : 'w-20')}>
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
                    isCompact
                      ? 'border-white/60 bg-white/70 font-semibold'
                      : '',
                    errors.calories ? 'border-red-500 placeholder-red-500' : '',
                  )}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? Number(value) : '');
                  }}
                />
              </Tooltip>
            </div>

            <span
              className={cn(
                'text-xs font-semibold text-slate-400',
                !isCompact && 'hidden',
              )}
            >
              kcal
            </span>
          </div>
        )}
      />

      <Controller
        name='meals'
        control={control}
        render={({ field }) => (
          <div
            className={cn(
              'flex items-center gap-2',
              isCompact
                ? 'rounded-xl border border-white/60 bg-white/80 px-3 py-2'
                : 'flex-col items-start',
            )}
          >
            <span
              className={cn(
                'font-medium text-gray-700',
                isCompact
                  ? 'text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase'
                  : 'text-sm',
              )}
            >
              Meals
            </span>

            <Tooltip
              title={String(errors.meals?.message)}
              open={!!errors.meals}
            >
              <div>
                <Select
                  {...field}
                  className={cn(
                    isCompact ? 'w-[86px]' : 'w-[70px]',
                    errors.meals ? 'border-red-500' : '',
                  )}
                  options={[{ value: '3', label: '3' }]}
                />
              </div>
            </Tooltip>

            {errors.meals && !isCompact && (
              <span className='mt-1 text-sm text-red-500'>
                {String(errors.meals?.message)}
              </span>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default CalorieInput;
