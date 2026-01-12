import React, { useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Switch, Tooltip, Typography } from 'antd';
import { motion } from 'framer-motion';

import { InputField } from '@/atoms/Input';
import type { NutritionFormSchema } from '@/schemas/nutritionTargetSchema';

const { Paragraph } = Typography;

interface MicronutrientsProps {
  control: Control<NutritionFormSchema>;
  errors: FieldErrors<NutritionFormSchema>;
}

const Micronutrients: React.FC<MicronutrientsProps> = ({ control, errors }) => {
  const [limitSodium, setLimitSodium] = useState(true);
  const [limitCholesterol, setLimitCholesterol] = useState(true);

  const handleSwitchChange = (
    setLimit: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setLimit((prev) => {
      const newValue = !prev;
      return newValue;
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex flex-col'>
          <Paragraph className='m-0 text-sm font-medium text-gray-700'>
            Minimum fiber
          </Paragraph>
          <span className='text-xs text-gray-500'>grams per day</span>
        </div>
        <Controller
          name='minimumFiber'
          control={control}
          render={({ field }) => (
            <Tooltip
              title={errors.minimumFiber?.message}
              open={!!errors.minimumFiber}
              overlayClassName='np-tooltip'
            >
              <InputField
                {...field}
                type='number'
                inputMode='numeric'
                className='hover:border-primary-200 focus:border-primary-200 h-10 w-[140px] rounded-xl text-right'
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </Tooltip>
          )}
        />
      </div>

      <div className='h-px bg-gray-200/70' />

      <div className='flex items-center justify-between gap-4'>
        <div className='flex flex-col'>
          <Paragraph className='m-0 text-sm font-medium text-gray-700'>
            Limit daily sodium
          </Paragraph>
          <span className='text-xs text-gray-500'>
            enable a maximum sodium target
          </span>
        </div>
        <Switch
          checked={limitSodium}
          onChange={() => handleSwitchChange(setLimitSodium)}
        />
      </div>

      {limitSodium && (
        <motion.div
          className='flex items-center justify-between gap-4'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className='flex flex-col'>
            <Paragraph className='m-0 text-sm font-medium text-gray-700'>
              Maximum sodium
            </Paragraph>
            <span className='text-xs text-gray-500'>mg per day</span>
          </div>
          <Controller
            name='maxiumSodium'
            control={control}
            render={({ field }) => (
              <Tooltip
                title={errors.maxiumSodium?.message}
                open={!!errors.maxiumSodium}
                overlayClassName='np-tooltip'
              >
                <InputField
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='hover:border-primary-200 focus:border-primary-200 h-10 w-[140px] rounded-xl text-right'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </Tooltip>
            )}
          />
        </motion.div>
      )}

      <div className='h-px bg-gray-200/70' />

      <div className='flex items-center justify-between gap-4'>
        <div className='flex flex-col'>
          <Paragraph className='m-0 text-sm font-medium text-gray-700'>
            Limit daily cholesterol
          </Paragraph>
          <span className='text-xs text-gray-500'>
            enable a maximum cholesterol target
          </span>
        </div>
        <Switch
          checked={limitCholesterol}
          onChange={() => handleSwitchChange(setLimitCholesterol)}
        />
      </div>

      {limitCholesterol && (
        <motion.div
          className='flex items-center justify-between gap-4'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className='flex flex-col'>
            <Paragraph className='m-0 text-sm font-medium text-gray-700'>
              Maximum cholesterol
            </Paragraph>
            <span className='text-xs text-gray-500'>mg per day</span>
          </div>
          <Controller
            name='maxiumCholesterol'
            control={control}
            render={({ field }) => (
              <Tooltip
                title={errors.maxiumCholesterol?.message}
                open={!!errors.maxiumCholesterol}
                overlayClassName='np-tooltip'
              >
                <InputField
                  {...field}
                  type='number'
                  inputMode='numeric'
                  className='hover:border-primary-200 focus:border-primary-200 h-10 w-[140px] rounded-xl text-right'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </Tooltip>
            )}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Micronutrients;
