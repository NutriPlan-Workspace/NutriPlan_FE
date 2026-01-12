import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdErrorOutline } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, InputNumber } from 'antd';

import { RadioInput } from '@/atoms/Input';
import ActivityLevelSelect from '@/atoms/Input/SelectOption';
import { BODY_FAT, SEX } from '@/constants/user';
import { cn } from '@/helpers/helpers';
import {
  useGetPhysicalStatsQuery,
  useUpdatePhysicalStatsMutation,
} from '@/redux/query/apis/user/userApi';
import { userSelector } from '@/redux/slices/user';
import { physicalStatsSchema } from '@/schemas/physicalStatsSchema';
import type { PhysicalStatsValues } from '@/types/user';

export interface PhysicalStatsProps {
  embedded?: boolean;
  className?: string;
  showTitle?: boolean;
  hideWeight?: boolean;
  onTargetsChanged?: () => void;
}

const PhysicalStats: React.FC<PhysicalStatsProps> = ({
  embedded = false,
  className,
  showTitle = true,
  hideWeight = false,
  onTargetsChanged,
}) => {
  const userId = useSelector(userSelector).user.id;
  const {
    data,
    isLoading,
    refetch: refetchPhysicalStats,
  } = useGetPhysicalStatsQuery();
  const [updatePhysicalStats] = useUpdatePhysicalStatsMutation();

  const [physicalStats, setPhysicalStats] =
    useState<PhysicalStatsValues | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PhysicalStatsValues>({
    defaultValues: {
      height: null,
      weight: null,
      dateOfBirth: '',
      gender: '',
      bodyFat: '',
      activityLevel: 'moderate',
    },
    mode: 'onBlur',
    criteriaMode: 'all',
    resolver: zodResolver(physicalStatsSchema),
  });
  const gender = watch('gender');
  const height = watch('height');
  const weight = watch('weight');
  const dateOfBirth = watch('dateOfBirth');
  const bodyFat = watch('bodyFat');
  const activityLevel = watch('activityLevel');

  useEffect(() => {
    if (data?.data) {
      const {
        heightRecords,
        weightRecords,
        dateOfBirth,
        gender,
        bodyFat,
        activityLevel,
      } = data.data;

      const latestHeight =
        heightRecords?.[heightRecords.length - 1]?.height ?? 0;
      const latestWeight =
        weightRecords?.[weightRecords.length - 1]?.weight ?? 0;
      const dob = new Date(dateOfBirth).toISOString().split('T')[0];

      setPhysicalStats({
        height: latestHeight,
        weight: latestWeight,
        dateOfBirth: dob,
        gender,
        bodyFat,
        activityLevel,
      });

      setValue('height', latestHeight);
      setValue('gender', gender);
      setValue('weight', latestWeight);
      setValue('dateOfBirth', dob);
      setValue('bodyFat', bodyFat);
      setValue('activityLevel', activityLevel);
    }
  }, [data]);

  const autoSave = async () => {
    if (!physicalStats) return;

    const nextHeight = height ?? physicalStats.height;
    const nextWeight = hideWeight
      ? physicalStats.weight
      : (weight ?? physicalStats.weight);

    const payload = {
      userId,
      gender: gender || physicalStats.gender,
      dateOfBirth: dateOfBirth || physicalStats.dateOfBirth,
      bodyFat: bodyFat || physicalStats.bodyFat,
      activityLevel: activityLevel || physicalStats.activityLevel,
      heightRecords: [{ height: nextHeight }],
      weightRecords: [{ weight: nextWeight }],
    };

    try {
      await updatePhysicalStats(payload).unwrap();
      await refetchPhysicalStats();
      onTargetsChanged?.();
      setPhysicalStats({
        height: nextHeight,
        weight: nextWeight,
        dateOfBirth: payload.dateOfBirth,
        gender: payload.gender,
        bodyFat: payload.bodyFat,
        activityLevel: payload.activityLevel,
      });
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (isLoading || !data?.data) return <div></div>;

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(embedded ? 'w-full' : 'ml-10 w-[800px]')}>
        {showTitle && (
          <h1
            className={cn(
              embedded
                ? 'mt-0 text-lg font-semibold text-gray-900'
                : 'mt-4 text-[28px] font-semibold',
            )}
          >
            Physical Stats
          </h1>
        )}
        <div className='rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-sm text-gray-700'>
          <span className='font-semibold text-[#e86852]'>Auto-save:</span> your
          changes are saved as you update fields.
        </div>

        <form className='mt-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='rounded-2xl border border-black/5 bg-white/60 p-4'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <div className='text-sm font-semibold text-gray-900'>Sex</div>
                  <div className='mt-1 text-xs text-gray-500'>
                    Used for calorie and macro estimation.
                  </div>
                </div>
              </div>
              <div className='mt-3'>
                <Controller
                  name='gender'
                  control={control}
                  render={({ field }) => (
                    <RadioInput
                      {...field}
                      variant='userHub'
                      defaultActiveKey={watch('gender')}
                      options={[...SEX]}
                      onChange={(val) => {
                        field.onChange(val);
                        handleSubmit(autoSave)();
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div className='rounded-2xl border border-black/5 bg-white/60 p-4'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <div className='text-sm font-semibold text-gray-900'>
                    Height
                  </div>
                  <div className='mt-1 text-xs text-gray-500'>
                    We keep the latest value.
                  </div>
                </div>
                <div className='flex flex-col items-end'>
                  <div className='flex items-center gap-2'>
                    <Controller
                      name='height'
                      control={control}
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          type='number'
                          controls={false}
                          onBlur={() => {
                            field.onBlur();
                            handleSubmit(autoSave)();
                          }}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          className='h-11 w-28 rounded-2xl border border-black/10 px-4 py-1 text-gray-800 shadow-sm focus:border-rose-200 focus:ring-1 focus:ring-rose-200'
                        />
                      )}
                    />
                    <span className='text-sm text-gray-500'>cm</span>
                  </div>
                  {errors.height && (
                    <div className='mt-1 flex items-center gap-1 text-xs text-red-500'>
                      <MdErrorOutline className='text-base' />
                      <span>{errors.height.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!hideWeight && (
              <div className='rounded-2xl border border-black/5 bg-white/60 p-4'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <div className='text-sm font-semibold text-gray-900'>
                      Weight
                    </div>
                    <div className='mt-1 text-xs text-gray-500'>
                      Used for progress and targets.
                    </div>
                  </div>
                  <div className='flex flex-col items-end'>
                    <div className='flex items-center gap-2'>
                      <Controller
                        name='weight'
                        control={control}
                        render={({ field }) => (
                          <InputNumber
                            {...field}
                            type='number'
                            controls={false}
                            onBlur={() => {
                              field.onBlur();
                              handleSubmit(autoSave)();
                            }}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            className='h-11 w-28 rounded-2xl border border-black/10 px-4 py-1 text-gray-800 shadow-sm focus:border-rose-200 focus:ring-1 focus:ring-rose-200'
                          />
                        )}
                      />
                      <span className='text-sm text-gray-500'>kg</span>
                    </div>
                    {errors.weight && (
                      <div className='mt-1 flex items-center gap-1 text-xs text-red-500'>
                        <MdErrorOutline className='text-base' />
                        <span>{errors.weight.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className='rounded-2xl border border-black/5 bg-white/60 p-4'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <div className='text-sm font-semibold text-gray-900'>
                    Birthday
                  </div>
                  <div className='mt-1 text-xs text-gray-500'>
                    Used to estimate metabolism.
                  </div>
                </div>
                <div className='flex flex-col items-end'>
                  <Controller
                    name='dateOfBirth'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='date'
                        onBlur={() => {
                          field.onBlur();
                          handleSubmit(autoSave)();
                        }}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        className='h-11 w-[200px] rounded-2xl border border-black/10 px-4 py-1 text-gray-800 shadow-sm focus:border-rose-200 focus:ring-1 focus:ring-rose-200'
                      />
                    )}
                  />
                  {errors.dateOfBirth && (
                    <div className='mt-1 flex items-center gap-1 text-xs text-red-500'>
                      <MdErrorOutline className='text-base' />
                      <span>{errors.dateOfBirth.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='rounded-2xl border border-black/5 bg-white/60 p-4 md:col-span-2'>
              <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                <div>
                  <div className='text-sm font-semibold text-gray-900'>
                    Body fat
                  </div>
                  <div className='mt-1 text-xs text-gray-500'>
                    Choose a rough range for better estimates.
                  </div>
                </div>
                <Controller
                  name='bodyFat'
                  control={control}
                  render={({ field }) => (
                    <RadioInput
                      {...field}
                      variant='userHub'
                      defaultActiveKey={watch('bodyFat')}
                      options={[...BODY_FAT]}
                      onChange={(val) => {
                        field.onChange(val);
                        handleSubmit(autoSave)();
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div className='rounded-2xl border border-black/5 bg-white/60 p-4 md:col-span-2'>
              <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                <div>
                  <div className='text-sm font-semibold text-gray-900'>
                    Activity level
                  </div>
                  <div className='mt-1 text-xs text-gray-500'>
                    Impacts your daily energy needs.
                  </div>
                </div>
                <Controller
                  name='activityLevel'
                  control={control}
                  render={({ field }) => (
                    <ActivityLevelSelect
                      {...field}
                      defaultSelectedKey={watch('activityLevel')}
                      className='w-full md:w-[420px]'
                      onChange={(val) => {
                        field.onChange(val);
                        handleSubmit(autoSave)();
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhysicalStats;
