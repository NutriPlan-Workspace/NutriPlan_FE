import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

import { RangeSlider } from '@/atoms/RangeSlider';
import { NUTRITION_TARGET_MIN_GAP } from '@/constants/nutritionTargets';
import type { NutritionFormSchema } from '@/schemas/nutritionTargetSchema';

interface TargetMacrosProps {
  control: Control<NutritionFormSchema>;
  errors: FieldErrors<NutritionFormSchema>;
}

const TargetMacros: React.FC<TargetMacrosProps> = ({ control, errors }) => (
  <div className='flex flex-col gap-5'>
    <Controller
      name='carbTarget'
      control={control}
      render={({ field }) => (
        <div>
          <RangeSlider
            color='lightcoral'
            title='Carbs'
            {...field}
            maxValue={619}
            minGap={NUTRITION_TARGET_MIN_GAP.CARB}
          />
          {(errors?.carbTarget?.from || errors?.carbTarget?.to) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.carbTarget?.from?.message ||
                errors.carbTarget?.to?.message}
            </p>
          )}
        </div>
      )}
    />

    <Controller
      name='fatTarget'
      control={control}
      render={({ field }) => (
        <div>
          <RangeSlider
            color='lightblue'
            title='Fats'
            {...field}
            maxValue={275}
            minGap={NUTRITION_TARGET_MIN_GAP.FAT}
          />
          {(errors?.fatTarget?.from || errors?.fatTarget?.to) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.fatTarget?.from?.message || errors.fatTarget?.to?.message}
            </p>
          )}
        </div>
      )}
    />

    <Controller
      name='proteinTarget'
      control={control}
      render={({ field }) => (
        <div>
          <RangeSlider
            color='lightgreen'
            title='Proteins'
            {...field}
            maxValue={619}
            minGap={NUTRITION_TARGET_MIN_GAP.PROTEIN}
          />
          {(errors?.proteinTarget?.from || errors?.proteinTarget?.to) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.proteinTarget?.from?.message ||
                errors.proteinTarget?.to?.message}
            </p>
          )}
        </div>
      )}
    />
  </div>
);

export default TargetMacros;
