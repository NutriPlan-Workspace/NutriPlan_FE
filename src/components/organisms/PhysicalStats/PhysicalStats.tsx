import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdErrorOutline } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, InputNumber } from 'antd';

import PopupButton from '@/atoms/Button/PopupButton';
import { RadioInput } from '@/atoms/Input';
import ActivityLevelSelect from '@/atoms/Input/SelectOption';
import { NutritionTargetModal } from '@/atoms/NutritionTargetModal';
import { BODY_FAT, SEX } from '@/constants/user';
import {
  useGetNewNutritionTargetQuery,
  useGetNutritionTargetQuery,
  useGetPhysicalStatsQuery,
  useUpdateNutritionTargetMutation,
  useUpdatePhysicalStatsMutation,
} from '@/redux/query/apis/user/userApi';
import { userSelector } from '@/redux/slices/user';
import { physicalStatsSchema } from '@/schemas/physicalStatsSchema';
import type { NutritionGoal, PhysicalStatsValues } from '@/types/user';

const PhysicalStats: React.FC = () => {
  const userId = useSelector(userSelector).user.id;
  const {
    data,
    isLoading,
    refetch: refetchPhysicalStats,
  } = useGetPhysicalStatsQuery();
  const [updatePhysicalStats] = useUpdatePhysicalStatsMutation();

  const [physicalStats, setPhysicalStats] =
    useState<PhysicalStatsValues | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: newTarget, refetch: refetchNewTarget } =
    useGetNewNutritionTargetQuery({ userId }, { skip: !isModalVisible });
  const { data: oldTarget, refetch } = useGetNutritionTargetQuery(
    { userId },
    { skip: !isModalVisible },
  );
  const [updateNutritionTarget] = useUpdateNutritionTargetMutation();
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
    if (isModalVisible) {
      refetchNewTarget();
      refetch();
    }
  }, [isModalVisible, refetch, refetchNewTarget]);

  const handleSave = async () => {
    if (!newTarget || !newTarget.data) {
      return;
    }

    const nutritionGoal: NutritionGoal = {
      userId: userId,
      calories: newTarget.data.calories,
      proteinTarget: newTarget.data.proteinTarget,
      carbTarget: newTarget.data.carbTarget,
      fatTarget: newTarget.data.fatTarget,
    };

    await updateNutritionTarget(nutritionGoal).unwrap();
  };

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

  const isChanged = useCallback(() => {
    if (!physicalStats) return false;
    return (
      physicalStats.height !== watch('height') ||
      physicalStats.weight !== watch('weight') ||
      physicalStats.dateOfBirth !== watch('dateOfBirth') ||
      physicalStats.gender !== watch('gender') ||
      physicalStats.bodyFat !== watch('bodyFat') ||
      physicalStats.activityLevel !== watch('activityLevel')
    );
  }, [physicalStats]);

  useEffect(() => {
    if (!physicalStats || !isChanged()) return;
    const payload = {
      userId,
      gender,
      dateOfBirth,
      bodyFat,
      activityLevel,
      heightRecords: height
        ? [{ height: height }]
        : [{ height: physicalStats.height }],
      weightRecords: weight
        ? [{ weight: weight }]
        : [{ weight: physicalStats.weight }],
    };

    updatePhysicalStats(payload)
      .unwrap()
      .then(() => {
        setIsOpen(true);
        setPhysicalStats({
          gender,
          dateOfBirth,
          bodyFat,
          activityLevel,
          height,
          weight,
        });
      })
      .catch((err) => {
        console.error('Update failed:', err);
      });
  }, [
    physicalStats,
    gender,
    dateOfBirth,
    bodyFat,
    activityLevel,
    updatePhysicalStats,
    isChanged,
    userId,
  ]);

  const autoSave = async () => {
    if (!physicalStats) {
      return;
    }
    const payload = {
      userId,
      gender,
      dateOfBirth,
      bodyFat,
      activityLevel,
      heightRecords: height
        ? [{ height: height }]
        : [{ height: physicalStats.height }],
      weightRecords: weight
        ? [{ weight: weight }]
        : [{ weight: physicalStats.weight }],
    };
    await updatePhysicalStats(payload);
    await refetchPhysicalStats();
    setIsOpen(true);
  };

  const handlePopupClick = () => {
    setIsOpen(false);
    setIsModalVisible(true);
  };

  if (isLoading || !data?.data) return <div></div>;

  return (
    <div>
      <div className='ml-10 w-[800px]'>
        <h1 className='mt-4 text-[28px] font-semibold'>Physical Stats</h1>
        <form>
          <div className='mt-5 flex border-b border-gray-300 pb-4'>
            <p>Sex</p>
            <div className='ml-auto'>
              <Controller
                name='gender'
                control={control}
                render={({ field }) => (
                  <RadioInput
                    {...field}
                    defaultActiveKey={watch('gender')}
                    options={[...SEX]}
                    onChange={(val) => {
                      field.onChange(val);
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-5 border-b border-gray-300 pb-4'>
            <div className='flex items-center justify-between'>
              <p>Height</p>
              <div className='flex flex-col items-end'>
                <div className='flex items-center'>
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
                        className='h-10 w-24 rounded-xl border border-gray-300 px-4 py-1 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      />
                    )}
                  />
                  <span className='ml-2 text-sm text-gray-500'>cm</span>
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
          <div className='mt-5 border-b border-gray-300 pb-4'>
            <div className='flex items-center justify-between'>
              <p>Weight</p>
              <div className='flex flex-col items-end'>
                <div className='flex items-center'>
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
                        className='h-10 w-24 rounded-xl border border-gray-300 px-4 py-1 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      />
                    )}
                  />
                  <span className='ml-2 text-sm text-gray-500'>kg</span>
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
          <div className='mt-5 border-b border-gray-300 pb-4'>
            <div className='flex items-center justify-between'>
              <p>Birthday</p>
              <div className='flex flex-col items-end'>
                <div className='flex items-center'>
                  <Controller
                    name='dateOfBirth'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='date'
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        className='h-10 w-[200px] rounded-xl border border-gray-300 px-4 py-1 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      />
                    )}
                  />
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
          <div className='mt-5 flex border-b border-gray-300 pb-4'>
            <p>Bodyfat</p>
            <div className='ml-auto'>
              <Controller
                name='bodyFat'
                control={control}
                render={({ field }) => (
                  <RadioInput
                    {...field}
                    defaultActiveKey={watch('bodyFat')}
                    options={[...BODY_FAT]}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-5 flex'>
            <p>Activity Level</p>
            <div className='ml-auto'>
              <Controller
                name='activityLevel'
                control={control}
                render={({ field }) => (
                  <ActivityLevelSelect
                    {...field}
                    defaultSelectedKey={watch('activityLevel')}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </div>
          </div>
        </form>
      </div>
      {isOpen && <PopupButton onClick={handlePopupClick} />}
      <NutritionTargetModal
        isModalVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        oldTarget={oldTarget}
        newTarget={newTarget}
        handleSave={handleSave}
      />
    </div>
  );
};

export default PhysicalStats;
