import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { GrDocumentUpdate } from 'react-icons/gr';
import { useSelector } from 'react-redux';
import { InputNumber } from 'antd';
import { Tooltip } from 'antd';

import Button from '@/atoms/Button/Button';
import PopupButton from '@/atoms/Button/PopupButton';
import { GoalChart } from '@/atoms/GoalChart';
import { RadioInput } from '@/atoms/Input';
import { NutritionTargetModal } from '@/atoms/NutritionTargetModal';
import { GOAL_TYPES } from '@/constants/user';
import {
  useGetNewNutritionTargetQuery,
  useGetNutritionTargetQuery,
  useGetPhysicalStatsQuery,
  useUpdateNutritionTargetMutation,
  useUpdatePhysicalStatsMutation,
} from '@/redux/query/apis/user/userApi';
import { userSelector } from '@/redux/slices/user';
import { physicalStatsSchema } from '@/schemas/physicalStatsSchema';
import { NutritionGoal } from '@/types/user';
import { formatDate } from '@/utils/dateUtils';

const WeightAndGoal: React.FC = () => {
  const userId = useSelector(userSelector).user.id;
  const [isOpen, setIsOpen] = useState(false);
  const [weight, setWeight] = useState<number | null>(null);
  const [goalType, setGoalType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    data: physicalStats,
    isLoading: isStatsLoading,
    refetch: refetchPhysicalStats,
  } = useGetPhysicalStatsQuery();
  const [updateWeight, { isLoading }] = useUpdatePhysicalStatsMutation();
  const [updateNutritionTarget] = useUpdateNutritionTargetMutation();
  const { data: newTarget, refetch: refetchNewTarget } =
    useGetNewNutritionTargetQuery({ userId });
  const { data: oldTarget, refetch: refetchOldTarget } =
    useGetNutritionTargetQuery({ userId });
  const weightRecords = physicalStats?.data?.weightRecords ?? [];
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (oldTarget?.data?.goalType && goalType === '') {
      setGoalType(oldTarget.data.goalType);
    }
  }, [oldTarget, goalType]);

  const handleUpdate = async () => {
    if (!physicalStats) return;

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
      weightRecords: [{ weight: validation.data.weight }],
    });
    await refetchPhysicalStats();
    refetchNewTarget();
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!newTarget || !newTarget.data) {
      return;
    }

    const payload: NutritionGoal = {
      userId: userId,
      goalType: goalType || oldTarget?.data?.goalType,
      calories: newTarget.data.calories,
      proteinTarget: newTarget.data.proteinTarget,
      carbTarget: newTarget.data.carbTarget,
      fatTarget: newTarget.data.fatTarget,
    };

    await updateNutritionTarget(payload).unwrap();
    await refetchOldTarget();
    setIsModalVisible(false);
  };

  const handleGoalTypeChange = async (value: string) => {
    setGoalType(value);

    if (value !== oldTarget?.data?.goalType) {
      setIsOpen(true);
      await updateNutritionTarget({
        userId: userId,
        ...oldTarget?.data,
        goalType: value,
      });
      await refetchOldTarget();
      await refetchNewTarget();
    }
  };
  if (isStatsLoading) return <div></div>;

  return (
    <div>
      <div className='flex w-[800px] flex-wrap gap-4 space-y-5 pl-[50px]'>
        <h1 className='mt-4 text-[28px]'>Weight And Goal</h1>
        {weightRecords.length > 1 && (
          <GoalChart
            data={weightRecords.map((record) => ({
              ...record,
              date: new Date(record.date).toISOString(),
            }))}
          />
        )}

        <div className='flex w-[800px] items-center justify-center'>
          <div>
            <p>Today&apos;s Weight</p>
          </div>
          <div className='ml-auto flex items-start gap-4'>
            <div className='flex flex-col'>
              <div className='flex w-[300px] items-center'>
                <div className='ml-auto'>
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
                      }}
                      controls={false}
                      className={`h-10 w-24 rounded-xl border px-4 py-1 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                        error ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </Tooltip>
                  <span className='ml-2 text-sm text-gray-500'>kg</span>
                  <Button
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className={`ml-2 border-none px-4 py-5 text-[16px] font-bold text-white ${
                      isLoading
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-[#ff774e] hover:bg-[#ff5722]'
                    }`}
                  >
                    {isLoading ? (
                      <FaSpinner className='animate-spin' />
                    ) : (
                      <GrDocumentUpdate />
                    )}
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {weightRecords.length > 0 && (
          <p className='text-gray-500'>
            Last updated: {weightRecords[weightRecords.length - 1]?.weight} kg
            on {formatDate(weightRecords[weightRecords.length - 1]?.date)}
          </p>
        )}

        <div className='flex w-[800px] items-center justify-center'>
          <div>
            <p>Set General Goal</p>
          </div>
          <div className='ml-auto'>
            <RadioInput
              options={[...GOAL_TYPES]}
              defaultActiveKey={goalType || oldTarget?.data?.goalType}
              onChange={handleGoalTypeChange}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <PopupButton
          onClick={() => {
            setIsOpen(false);
            setIsModalVisible(true);
          }}
        />
      )}
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

export default WeightAndGoal;
