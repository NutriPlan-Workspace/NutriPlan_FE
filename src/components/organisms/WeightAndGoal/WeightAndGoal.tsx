import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { FaSpinner } from 'react-icons/fa';
import { GrDocumentUpdate } from 'react-icons/gr';
import { useSelector } from 'react-redux';
import { InputNumber } from 'antd';
import { Tooltip } from 'antd';

import Button from '@/atoms/Button/Button';
import { GoalChart } from '@/atoms/GoalChart';
import { RadioInput } from '@/atoms/Input';
import { GOAL_TYPES } from '@/constants/user';
import { cn } from '@/helpers/helpers';
import {
  useGetPhysicalStatsQuery,
  useUpdatePhysicalStatsMutation,
} from '@/redux/query/apis/user/userApi';
import { userSelector } from '@/redux/slices/user';
import { physicalStatsSchema } from '@/schemas/physicalStatsSchema';
import { formatDate } from '@/utils/dateUtils';

export interface WeightAndGoalProps {
  embedded?: boolean;
  className?: string;
  showTitle?: boolean;
  goalType?: string;
  onGoalTypeChange?: (value: string) => void | Promise<void>;
  onTargetsChanged?: () => void;
}

export interface WeightAndGoalHandle {
  save: () => Promise<boolean>;
  isSaving: boolean;
}

const WeightAndGoal = React.forwardRef<WeightAndGoalHandle, WeightAndGoalProps>(
  (
    {
      embedded = false,
      className,
      showTitle = true,
      goalType: goalTypeProp,
      onGoalTypeChange,
      onTargetsChanged,
    },
    ref,
  ) => {
    const userId = useSelector(userSelector).user.id;
    const [weight, setWeight] = useState<number | null>(null);
    const {
      data: physicalStats,
      isLoading: isStatsLoading,
      refetch: refetchPhysicalStats,
    } = useGetPhysicalStatsQuery();
    const [updateWeight, { isLoading }] = useUpdatePhysicalStatsMutation();
    const weightRecords = useMemo(
      () => physicalStats?.data?.weightRecords ?? [],
      [physicalStats],
    );
    const [error, setError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    const goalType = goalTypeProp ?? '';

    const handleUpdate = useCallback(async () => {
      if (!physicalStats) return;
      if (weight === null || weight === undefined) return;
      if (isLoading) return;

      const latestSavedWeight = weightRecords[weightRecords.length - 1]?.weight;
      if (
        typeof latestSavedWeight === 'number' &&
        Number.isFinite(latestSavedWeight) &&
        latestSavedWeight === weight
      ) {
        setIsDirty(false);
        return;
      }

      const latestHeight =
        physicalStats.data.heightRecords?.[
          physicalStats.data.heightRecords.length - 1
        ]?.height ?? null;

      const validation = physicalStatsSchema.safeParse({
        height: latestHeight,
        weight,
        dateOfBirth: physicalStats.data.dateOfBirth,
      });

      if (!validation.success) {
        setError(validation.error.errors[0].message);
        return;
      }
      setError(null);
      await updateWeight({
        userId: userId,
        ...physicalStats.data,
        dateOfBirth: physicalStats.data.dateOfBirth
          ? new Date(physicalStats.data.dateOfBirth).toISOString()
          : '',
        weightRecords: [{ weight: validation.data.weight as number }],
      });
      await refetchPhysicalStats();
      onTargetsChanged?.();
      setIsDirty(false);
    }, [
      physicalStats,
      weight,
      isLoading,
      weightRecords,
      userId,
      updateWeight,
      refetchPhysicalStats,
      onTargetsChanged,
    ]);

    useEffect(() => {
      const latestSavedWeight = weightRecords[weightRecords.length - 1]?.weight;
      if (
        typeof latestSavedWeight === 'number' &&
        Number.isFinite(latestSavedWeight)
      ) {
        setWeight(latestSavedWeight);
      } else {
        setWeight(null);
      }
      setIsDirty(false);
    }, [weightRecords]);

    const handleGoalTypeChangeInternal = useCallback(
      async (value: string) => {
        await onGoalTypeChange?.(value);
      },
      [onGoalTypeChange],
    );

    useImperativeHandle(
      ref,
      () => ({
        save: async () => {
          if (!isDirty) return false;
          await handleUpdate();
          return true;
        },
        isSaving: isLoading,
      }),
      [handleUpdate, isDirty, isLoading],
    );
    if (isStatsLoading) return <div></div>;

    return (
      <div className={cn('w-full', className)}>
        <div
          className={cn(
            'flex w-full flex-col gap-5',
            embedded ? 'px-0' : 'pl-[50px]',
            embedded ? 'max-w-none' : 'max-w-[800px]',
          )}
        >
          {showTitle && (
            <h1
              className={cn(
                embedded
                  ? 'mt-0 text-lg font-semibold text-gray-900'
                  : 'mt-4 text-[28px] font-semibold',
              )}
            >
              Weight &amp; Goal
            </h1>
          )}

          {weightRecords.length > 1 && (
            <div className='rounded-2xl border border-black/5 bg-white/60 p-4'>
              <GoalChart
                data={weightRecords.map((record) => ({
                  ...record,
                  date: new Date(record.date).toISOString(),
                }))}
              />
            </div>
          )}

          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <div className='text-sm font-semibold text-gray-900'>
                  Today’s weight
                </div>
                <div className='mt-1 text-sm text-gray-500'>
                  Update to refresh your targets.
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-2'>
                <div className='inline-flex items-center gap-2 whitespace-nowrap'>
                  <Tooltip
                    title={error}
                    color='orange'
                    open={!!error}
                    placement='bottom'
                  >
                    <InputNumber
                      type='number'
                      value={weight}
                      onChange={(val) => {
                        setWeight(val);
                        setError(null);
                        const latestSavedWeight =
                          weightRecords[weightRecords.length - 1]?.weight;
                        if (
                          typeof latestSavedWeight === 'number' &&
                          Number.isFinite(latestSavedWeight) &&
                          latestSavedWeight === val
                        ) {
                          setIsDirty(false);
                        } else {
                          setIsDirty(true);
                        }
                      }}
                      onBlur={() => {
                        if (!embedded) return;
                      }}
                      controls={false}
                      className={cn(
                        'h-11 w-28 rounded-2xl border px-4 py-1 text-gray-800 shadow-sm',
                        embedded
                          ? 'focus:border-rose-200 focus:ring-1 focus:ring-rose-200'
                          : 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
                        error ? 'border-red-500' : 'border-black/10',
                      )}
                    />
                  </Tooltip>
                  <span className='text-sm text-gray-500'>kg</span>
                </div>
                {!embedded && (
                  <Button
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className={cn(
                      'h-11 rounded-2xl border-none px-4 font-semibold text-white',
                      isLoading
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-[#2F80ED] hover:bg-[#1c6bd4]',
                    )}
                  >
                    <span className='flex items-center gap-2'>
                      {isLoading ? (
                        <FaSpinner className='animate-spin' />
                      ) : (
                        <GrDocumentUpdate />
                      )}
                      Update
                    </span>
                  </Button>
                )}
              </div>
            </div>

            {weightRecords.length > 0 && (
              <div className='text-sm text-gray-600'>
                Last updated:{' '}
                <span className='font-medium'>
                  {weightRecords[weightRecords.length - 1]?.weight} kg
                </span>{' '}
                on{' '}
                <span className='font-medium'>
                  {formatDate(weightRecords[weightRecords.length - 1]?.date)}
                </span>
              </div>
            )}
          </div>

          <div className='h-px bg-black/5' />

          <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
            <div>
              <div className='text-sm font-semibold text-gray-900'>
                General goal
              </div>
              <div className='mt-1 text-sm text-gray-500'>
                Choose a direction; we’ll adjust targets accordingly.
              </div>
            </div>

            <div className='w-full sm:w-auto sm:max-w-full'>
              <RadioInput
                options={[...GOAL_TYPES]}
                defaultActiveKey={goalType}
                onChange={handleGoalTypeChangeInternal}
                variant={embedded ? 'userHub' : 'default'}
                className='w-full max-w-full justify-start sm:justify-end'
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

WeightAndGoal.displayName = 'WeightAndGoal';

export default WeightAndGoal;
