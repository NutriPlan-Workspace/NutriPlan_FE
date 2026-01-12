import { useEffect, useState } from 'react';

import {
  useGetNewNutritionTargetQuery,
  useGetNutritionTargetQuery,
  useUpdateNutritionTargetMutation,
} from '@/redux/query/apis/user/userApi';
import type { NutritionGoal } from '@/types/user';

type UseNutritionTargetsPromptArgs = {
  userId: string;
};

export function useNutritionTargetsPrompt({
  userId,
}: UseNutritionTargetsPromptArgs) {
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [goalType, setGoalType] = useState('');

  const { data: oldTarget, refetch: refetchOldTarget } =
    useGetNutritionTargetQuery({ userId });

  const { data: newTarget, refetch: refetchNewTarget } =
    useGetNewNutritionTargetQuery({ userId });

  const [updateNutritionTarget] = useUpdateNutritionTargetMutation();

  useEffect(() => {
    if (!goalType && oldTarget?.data?.goalType) {
      setGoalType(oldTarget.data.goalType);
    }
  }, [goalType, oldTarget]);

  const notifyTargetsChanged = () => {
    setIsPromptVisible(true);
  };

  const openModal = async () => {
    setIsPromptVisible(false);
    setIsModalVisible(true);

    // Ensure we have fresh suggestions when opening.
    await Promise.all([refetchOldTarget(), refetchNewTarget()]);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const saveSuggestedTargets = async () => {
    if (!newTarget?.data) return;

    const payload: NutritionGoal = {
      userId,
      goalType: goalType || oldTarget?.data?.goalType,
      calories: newTarget.data.calories,
      proteinTarget: newTarget.data.proteinTarget,
      carbTarget: newTarget.data.carbTarget,
      fatTarget: newTarget.data.fatTarget,
    };

    await updateNutritionTarget(payload).unwrap();
    await refetchOldTarget();

    setIsModalVisible(false);
    setIsPromptVisible(false);
  };

  const changeGoalType = async (value: string) => {
    setGoalType(value);

    if (!oldTarget?.data) {
      notifyTargetsChanged();
      return;
    }

    if (value !== oldTarget.data.goalType) {
      await updateNutritionTarget({
        userId,
        ...oldTarget.data,
        goalType: value,
      }).unwrap();

      await Promise.all([refetchOldTarget(), refetchNewTarget()]);
      notifyTargetsChanged();
    }
  };

  return {
    goalType,
    setGoalType,
    oldTarget,
    newTarget,
    isPromptVisible,
    isModalVisible,
    notifyTargetsChanged,
    openModal,
    closeModal,
    saveSuggestedTargets,
    changeGoalType,
  };
}
