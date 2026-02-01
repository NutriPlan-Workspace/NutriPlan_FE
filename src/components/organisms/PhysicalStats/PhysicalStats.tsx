import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Controller, type Resolver, useForm } from 'react-hook-form';
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

export interface PhysicalStatsHandle {
  save: () => Promise<boolean>;
  isSaving: boolean;
}

const PhysicalStats = React.forwardRef<PhysicalStatsHandle, PhysicalStatsProps>(
  (
    {
      embedded = false,
      className,
      showTitle = true,
      hideWeight = false,
      onTargetsChanged,
    },
    ref,
  ) => {
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
      formState: { errors },
      reset,
      watch,
      trigger,
      getValues,
    } = useForm<PhysicalStatsValues>({
      defaultValues: {
        height: null,
        weight: null,
        dateOfBirth: '',
        gender: '',
        bodyFat: '',
        activityLevel: '',
      },
      mode: 'onBlur',
      criteriaMode: 'all',
      resolver: zodResolver(
        physicalStatsSchema,
      ) as unknown as Resolver<PhysicalStatsValues>,
    });
    const dateOfBirth = watch('dateOfBirth');

    useEffect(() => {
      if (!data?.data) {
        setPhysicalStats({
          height: null,
          weight: null,
          dateOfBirth: '',
          gender: '',
          bodyFat: '',
          activityLevel: '',
        });
        reset({
          height: null,
          weight: null,
          dateOfBirth: '',
          gender: '',
          bodyFat: '',
          activityLevel: '',
        });
        return;
      }

      const {
        heightRecords,
        weightRecords,
        dateOfBirth,
        gender,
        bodyFat,
        activityLevel,
      } = data.data;

      const latestHeight =
        Array.isArray(heightRecords) && heightRecords.length > 0
          ? (heightRecords[heightRecords.length - 1]?.height ?? null)
          : null;
      const latestWeight =
        Array.isArray(weightRecords) && weightRecords.length > 0
          ? (weightRecords[weightRecords.length - 1]?.weight ?? null)
          : null;

      let dob = '';
      if (dateOfBirth) {
        const parsed = new Date(dateOfBirth);
        if (!Number.isNaN(parsed.getTime())) {
          dob = parsed.toISOString().split('T')[0];
        }
      }

      const isEmptyProfile =
        (!Array.isArray(heightRecords) || heightRecords.length === 0) &&
        (!Array.isArray(weightRecords) || weightRecords.length === 0) &&
        !dateOfBirth;

      const normalizedGender = isEmptyProfile
        ? ''
        : typeof gender === 'string'
          ? gender
          : '';
      const normalizedBodyFat = isEmptyProfile
        ? ''
        : typeof bodyFat === 'string'
          ? bodyFat
          : '';
      const normalizedActivity = isEmptyProfile
        ? ''
        : typeof activityLevel === 'string'
          ? activityLevel
          : '';

      setPhysicalStats({
        height: latestHeight,
        weight: latestWeight,
        dateOfBirth: dob,
        gender: normalizedGender,
        bodyFat: normalizedBodyFat,
        activityLevel: normalizedActivity,
      });
      reset({
        height: latestHeight,
        weight: latestWeight,
        dateOfBirth: dob,
        gender: normalizedGender,
        bodyFat: normalizedBodyFat,
        activityLevel: normalizedActivity,
      });
    }, [data, reset]);

    const [isSaving, setIsSaving] = useState(false);

    const save = useCallback(async () => {
      const isValid = await trigger();
      if (!isValid) return false;

      const values = getValues();
      if (!physicalStats || isSaving) return false;

      const nextHeight = values.height ?? null;
      const nextWeight = hideWeight ? null : (values.weight ?? null);

      const payload = {
        userId,
        ...(values.gender ? { gender: values.gender } : {}),
        ...(values.dateOfBirth ? { dateOfBirth: values.dateOfBirth } : {}),
        ...(values.bodyFat ? { bodyFat: values.bodyFat } : {}),
        ...(values.activityLevel
          ? { activityLevel: values.activityLevel }
          : {}),
        ...(typeof nextHeight === 'number'
          ? { heightRecords: [{ height: nextHeight }] }
          : {}),
        ...(typeof nextWeight === 'number'
          ? { weightRecords: [{ weight: nextWeight }] }
          : {}),
      };

      if (Object.keys(payload).length === 1) return false;

      try {
        setIsSaving(true);
        await updatePhysicalStats(payload).unwrap();
        await refetchPhysicalStats();
        onTargetsChanged?.();
        return true;
      } catch {
        // ignore
        return false;
      } finally {
        setIsSaving(false);
      }
    }, [
      trigger,
      getValues,
      physicalStats,
      isSaving,
      hideWeight,
      userId,
      updatePhysicalStats,
      refetchPhysicalStats,
      onTargetsChanged,
    ]);

    useImperativeHandle(ref, () => ({ save, isSaving }), [save, isSaving]);

    if (isLoading) return <div></div>;

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
            <span className='font-semibold text-[#e86852]'>Note:</span> changes
            are saved when you click Save below.
          </div>

          <form className='mt-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='rounded-2xl border border-black/5 bg-white/60 p-4'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <div className='text-sm font-semibold text-gray-900'>
                      Sex
                    </div>
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
                        defaultActiveKey={watch('gender') || ''}
                        options={[...SEX]}
                        onChange={(val) => {
                          field.onChange(val);
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
                    <div className='relative'>
                      <Controller
                        name='dateOfBirth'
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type='date'
                            placeholder='--/--/----'
                            onBlur={() => {
                              field.onBlur();
                            }}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            className='h-11 w-[200px] rounded-2xl border border-black/10 px-4 py-1 text-gray-800 shadow-sm focus:border-rose-200 focus:ring-1 focus:ring-rose-200'
                          />
                        )}
                      />
                      {!dateOfBirth && (
                        <span className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-gray-400'>
                          --/--/----
                        </span>
                      )}
                    </div>
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
                        defaultActiveKey={watch('bodyFat') || ''}
                        options={[...BODY_FAT]}
                        onChange={(val) => {
                          field.onChange(val);
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
                        defaultSelectedKey={watch('activityLevel') || undefined}
                        className='w-full md:w-[420px]'
                        onChange={(val) => {
                          field.onChange(val);
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
  },
);

PhysicalStats.displayName = 'PhysicalStats';

export default PhysicalStats;
