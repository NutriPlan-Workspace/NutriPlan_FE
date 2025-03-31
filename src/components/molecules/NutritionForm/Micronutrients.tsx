import React, { useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Switch, Tooltip, Typography } from 'antd';
import { motion } from 'framer-motion';

import { InputField } from '@/atoms/Input';
import type { NutritionFormSchema } from '@/schemas/nutritionTargetSchema';

const { Title, Paragraph } = Typography;

interface MicronutrientsProps {
  control: Control<NutritionFormSchema>;
  errors: FieldErrors<NutritionFormSchema>;
}

const Micronutrients: React.FC<MicronutrientsProps> = ({ control, errors }) => {
  const [limitSodium, setLimitSodium] = useState(false);
  const [limitCholesterol, setLimitCholesterol] = useState(false);

  const handleSwitchChange = (
    setLimit: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setLimit((prev) => {
      const newValue = !prev;
      return newValue;
    });
  };

  return (
    <div className='mr-2 flex flex-col gap-2'>
      <Title level={3} className='font-thin'>
        Micronutrients
      </Title>

      <div className='flex items-center justify-between'>
        <Paragraph>Minimum Fiber</Paragraph>
        <Controller
          name='minimumFiber'
          control={control}
          render={({ field }) => (
            <Tooltip
              title={errors.minimumFiber?.message}
              open={!!errors.minimumFiber}
            >
              <InputField
                {...field}
                type='number'
                className='hover:border-primary-200 focus:border-primary-200 mb-2 w-[100px] rounded-md'
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </Tooltip>
          )}
        />
      </div>

      <div className='flex items-center justify-between'>
        <Paragraph>Limit Daily Sodium</Paragraph>
        <Switch
          checked={limitSodium}
          onChange={() => handleSwitchChange(setLimitSodium)}
        />
      </div>

      {limitSodium && (
        <motion.div
          className='flex items-center justify-between'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Paragraph>Maximum Sodium</Paragraph>
          <Controller
            name='maxiumSodium'
            control={control}
            render={({ field }) => (
              <Tooltip
                title={errors.maxiumSodium?.message}
                open={!!errors.maxiumSodium}
              >
                <InputField
                  {...field}
                  type='number'
                  className='hover:border-primary-200 focus:border-primary-200 mb-2 w-[100px] rounded-md'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </Tooltip>
            )}
          />
        </motion.div>
      )}

      <div className='flex items-center justify-between'>
        <Paragraph>Limit Daily Cholesterol</Paragraph>
        <Switch
          checked={limitCholesterol}
          onChange={() => handleSwitchChange(setLimitCholesterol)}
        />
      </div>

      {limitCholesterol && (
        <motion.div
          className='flex items-center justify-between'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Paragraph>Maximum Cholesterol</Paragraph>
          <Controller
            name='maxiumCholesterol'
            control={control}
            render={({ field }) => (
              <Tooltip
                title={errors.maxiumCholesterol?.message}
                open={!!errors.maxiumCholesterol}
              >
                <InputField
                  {...field}
                  type='number'
                  className='hover:border-primary-200 focus:border-primary-200 mb-2 w-[100px] rounded-md'
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
