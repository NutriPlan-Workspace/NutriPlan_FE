import React, { useEffect, useState } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { InfoCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Switch, Tooltip, Typography } from 'antd';
import { motion } from 'framer-motion';

import { InputField } from '@/atoms/Input';
import {
  MICRONUTRIENT_PRESETS,
  MICRONUTRIENT_RECOMMENDATIONS,
  MicronutrientPresetKey,
} from '@/constants/micronutrientRecommendations';
import type { NutritionFormSchema } from '@/schemas/nutritionTargetSchema';

const { Paragraph, Text } = Typography;

interface MicronutrientsProps {
  control: Control<NutritionFormSchema>;
  errors: FieldErrors<NutritionFormSchema>;
  setValue: UseFormSetValue<NutritionFormSchema>;
  getValues: UseFormGetValues<NutritionFormSchema>;
}

const Micronutrients: React.FC<MicronutrientsProps> = ({
  control,
  errors,
  setValue,
}) => {
  const [limitSodium, setLimitSodium] = useState(false);
  const [limitCholesterol, setLimitCholesterol] = useState(false);

  const sodiumValue = useWatch({ control, name: 'maxiumSodium' });
  const cholesterolValue = useWatch({ control, name: 'maxiumCholesterol' });
  const fiberValue = useWatch({ control, name: 'minimumFiber' });

  // Sync switches with values on load / update
  useEffect(() => {
    if (sodiumValue && sodiumValue > 0) {
      setLimitSodium(true);
    }
  }, [sodiumValue]);

  useEffect(() => {
    if (cholesterolValue && cholesterolValue > 0) {
      setLimitCholesterol(true);
    }
  }, [cholesterolValue]);

  const handleSodiumSwitch = (checked: boolean) => {
    setLimitSodium(checked);
    if (!checked) {
      setValue('maxiumSodium', 0);
    } else if (!sodiumValue || sodiumValue === 0) {
      // Set recommended value when enabling
      setValue(
        'maxiumSodium',
        MICRONUTRIENT_RECOMMENDATIONS.sodium.recommended,
      );
    }
  };

  const handleCholesterolSwitch = (checked: boolean) => {
    setLimitCholesterol(checked);
    if (!checked) {
      setValue('maxiumCholesterol', 0);
    } else if (!cholesterolValue || cholesterolValue === 0) {
      // Set recommended value when enabling
      setValue(
        'maxiumCholesterol',
        MICRONUTRIENT_RECOMMENDATIONS.cholesterol.recommended,
      );
    }
  };

  // Quick-fill preset menu items
  const presetMenuItems: MenuProps['items'] = Object.entries(
    MICRONUTRIENT_PRESETS,
  ).map(([key, preset]) => ({
    key,
    label: preset.label,
    onClick: () => applyPreset(key as MicronutrientPresetKey),
  }));

  const applyPreset = (presetKey: MicronutrientPresetKey) => {
    const preset = MICRONUTRIENT_PRESETS[presetKey];
    setValue('minimumFiber', preset.fiber);
    setValue('maxiumSodium', preset.sodium);
    setValue('maxiumCholesterol', preset.cholesterol);
    setLimitSodium(true);
    setLimitCholesterol(true);
  };

  // Check if value is in warning range
  const getFiberWarning = () => {
    if (!fiberValue) return null;
    const { warningThreshold } = MICRONUTRIENT_RECOMMENDATIONS.fiber;
    if (warningThreshold?.high && fiberValue > warningThreshold.high) {
      return 'Very high - may cause digestive issues';
    }
    if (
      warningThreshold?.low &&
      fiberValue < warningThreshold.low &&
      fiberValue > 0
    ) {
      return 'Below recommended minimum';
    }
    return null;
  };

  const getSodiumWarning = () => {
    if (!sodiumValue || !limitSodium) return null;
    const { warningThreshold } = MICRONUTRIENT_RECOMMENDATIONS.sodium;
    if (warningThreshold?.high && sodiumValue > warningThreshold.high) {
      return 'Very high sodium limit';
    }
    if (warningThreshold?.low && sodiumValue < warningThreshold.low) {
      return 'Very restrictive - may be hard to meet';
    }
    return null;
  };

  const getCholesterolWarning = () => {
    if (!cholesterolValue || !limitCholesterol) return null;
    const { warningThreshold } = MICRONUTRIENT_RECOMMENDATIONS.cholesterol;
    if (warningThreshold?.high && cholesterolValue > warningThreshold.high) {
      return 'Very high cholesterol limit';
    }
    if (warningThreshold?.low && cholesterolValue < warningThreshold.low) {
      return 'Very restrictive - may be hard to meet';
    }
    return null;
  };

  const fiberWarning = getFiberWarning();
  const sodiumWarning = getSodiumWarning();
  const cholesterolWarning = getCholesterolWarning();

  return (
    <div className='flex flex-col gap-4'>
      {/* Quick-fill presets */}
      <div className='flex items-center justify-between'>
        <Text className='text-xs text-gray-500'>
          Use presets for quick setup
        </Text>
        <Dropdown menu={{ items: presetMenuItems }} placement='bottomRight'>
          <button
            type='button'
            className='flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200'
          >
            <ThunderboltOutlined className='text-amber-500' />
            Quick Fill
          </button>
        </Dropdown>
      </div>

      <div className='h-px bg-gray-200/70' />

      {/* Fiber */}
      <div className='flex items-center justify-between gap-4'>
        <div className='flex flex-col'>
          <div className='flex items-center gap-1.5'>
            <Paragraph className='m-0 text-sm font-medium text-gray-700'>
              Minimum fiber
            </Paragraph>
            <Tooltip title={MICRONUTRIENT_RECOMMENDATIONS.fiber.description}>
              <InfoCircleOutlined className='cursor-help text-xs text-gray-400' />
            </Tooltip>
          </div>
          <span className='text-xs text-gray-500'>grams per day</span>
          {fiberWarning && (
            <span className='mt-0.5 text-xs text-amber-600'>
              {fiberWarning}
            </span>
          )}
        </div>
        <Controller
          name='minimumFiber'
          control={control}
          render={({ field }) => (
            <Tooltip
              title={errors.minimumFiber?.message}
              open={!!errors.minimumFiber}
              classNames={{ root: 'np-tooltip' }}
            >
              <InputField
                {...field}
                type='number'
                inputMode='numeric'
                placeholder={String(
                  MICRONUTRIENT_RECOMMENDATIONS.fiber.recommended,
                )}
                className='hover:border-primary-200 focus:border-primary-200 h-10 w-[140px] rounded-xl text-right'
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </Tooltip>
          )}
        />
      </div>

      <div className='h-px bg-gray-200/70' />

      {/* Sodium toggle */}
      <div className='flex items-center justify-between gap-4'>
        <div className='flex flex-col'>
          <div className='flex items-center gap-1.5'>
            <Paragraph className='m-0 text-sm font-medium text-gray-700'>
              Limit daily sodium
            </Paragraph>
            <Tooltip title={MICRONUTRIENT_RECOMMENDATIONS.sodium.description}>
              <InfoCircleOutlined className='cursor-help text-xs text-gray-400' />
            </Tooltip>
          </div>
          <span className='text-xs text-gray-500'>
            enable a maximum sodium target
          </span>
        </div>
        <Switch checked={limitSodium} onChange={handleSodiumSwitch} />
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
            {sodiumWarning && (
              <span className='mt-0.5 text-xs text-amber-600'>
                {sodiumWarning}
              </span>
            )}
          </div>
          <Controller
            name='maxiumSodium'
            control={control}
            render={({ field }) => (
              <Tooltip
                title={errors.maxiumSodium?.message}
                open={!!errors.maxiumSodium}
                classNames={{ root: 'np-tooltip' }}
              >
                <InputField
                  {...field}
                  type='number'
                  inputMode='numeric'
                  placeholder={String(
                    MICRONUTRIENT_RECOMMENDATIONS.sodium.recommended,
                  )}
                  className='hover:border-primary-200 focus:border-primary-200 h-10 w-[140px] rounded-xl text-right'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </Tooltip>
            )}
          />
        </motion.div>
      )}

      <div className='h-px bg-gray-200/70' />

      {/* Cholesterol toggle */}
      <div className='flex items-center justify-between gap-4'>
        <div className='flex flex-col'>
          <div className='flex items-center gap-1.5'>
            <Paragraph className='m-0 text-sm font-medium text-gray-700'>
              Limit daily cholesterol
            </Paragraph>
            <Tooltip
              title={MICRONUTRIENT_RECOMMENDATIONS.cholesterol.description}
            >
              <InfoCircleOutlined className='cursor-help text-xs text-gray-400' />
            </Tooltip>
          </div>
          <span className='text-xs text-gray-500'>
            enable a maximum cholesterol target
          </span>
        </div>
        <Switch checked={limitCholesterol} onChange={handleCholesterolSwitch} />
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
            {cholesterolWarning && (
              <span className='mt-0.5 text-xs text-amber-600'>
                {cholesterolWarning}
              </span>
            )}
          </div>
          <Controller
            name='maxiumCholesterol'
            control={control}
            render={({ field }) => (
              <Tooltip
                title={errors.maxiumCholesterol?.message}
                open={!!errors.maxiumCholesterol}
                classNames={{ root: 'np-tooltip' }}
              >
                <InputField
                  {...field}
                  type='number'
                  inputMode='numeric'
                  placeholder={String(
                    MICRONUTRIENT_RECOMMENDATIONS.cholesterol.recommended,
                  )}
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
