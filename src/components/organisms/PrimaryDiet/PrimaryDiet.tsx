import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from '@tanstack/react-router';

import { PopupButton } from '@/atoms/Button';
import { NutritionTargetModal } from '@/atoms/NutritionTargetModal';
import { PATH } from '@/constants/path';
import { PRIMARY_DIET, PrimaryDietType } from '@/constants/user';
import {
  useGetNewNutritionTargetQuery,
  useGetNutritionTargetQuery,
  useGetPrimaryDietQuery,
  useUpdateNutritionTargetMutation,
  useUpdatePrimaryDietMutation,
} from '@/redux/query/apis/user/userApi';
import { userSelector } from '@/redux/slices/user';
import type { NutritionGoal } from '@/types/user';

import PrimaryDietCard from './PrimaryDietCard';

const PrimaryDiet: React.FC = () => {
  const [isNutritionTargetUpdated, setIsNutriionTargetUpdated] =
    useState(false);
  const userId = useSelector(userSelector).user.id;
  const { data: primaryDietData } = useGetPrimaryDietQuery();
  const [updateNutritionTarget] = useUpdateNutritionTargetMutation();
  const { data: newTarget, refetch: refetchNewTarget } =
    useGetNewNutritionTargetQuery({ userId });
  const { data: oldTarget, refetch: refetchOldTarget } =
    useGetNutritionTargetQuery({ userId });
  useEffect(() => {
    if (primaryDietData?.data) {
      setSelected(primaryDietData.data as PrimaryDietType);
    }
  }, [primaryDietData]);

  // PRIMARY DIET
  const [selected, setSelected] = useState<PrimaryDietType | ''>('');
  const [updatePrimaryDiet, { isLoading: isUpdatingPrimaryDiet }] =
    useUpdatePrimaryDietMutation();
  useEffect(() => {
    const updateDiet = async () => {
      await updatePrimaryDiet({
        primaryDiet: selected as PrimaryDietType,
      }).unwrap();
    };
    if (selected !== '' && selected !== primaryDietData?.data) {
      updateDiet();
      refetchNewTarget();
      setIsNutriionTargetUpdated(true);
    }
  }, [selected, updatePrimaryDiet, primaryDietData, refetchNewTarget]);

  // NUTRITION TARGET
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSave = async () => {
    if (!newTarget || !newTarget.data) {
      return;
    }

    const payload: NutritionGoal = {
      userId: userId,
      goalType: oldTarget?.data?.goalType,
      calories: newTarget.data.calories,
      proteinTarget: newTarget.data.proteinTarget,
      carbTarget: newTarget.data.carbTarget,
      fatTarget: newTarget.data.fatTarget,
    };

    await updateNutritionTarget(payload).unwrap();
    await refetchOldTarget();
    setIsModalVisible(false);
  };

  return (
    <>
      <div className='w-[700px] pl-[50px]'>
        <h1 className='py-4 text-[28px]'>Primary Diet</h1>
        <p className='pb-4 text-gray-600'>
          We&apos;ll base your meals off this main main diet type. Choose
          &quot;Anything&quot; to customize your own unique diet from scratch
          and set specific exclusions from the{' '}
          <Link to={PATH.FOOD_EXCLUSIONS} className='text-primary-400'>
            &quot;Exclusions&quot; menu screen.
          </Link>
        </p>
        <div className='flex flex-col'>
          {PRIMARY_DIET.map((diet) => (
            <PrimaryDietCard
              key={diet.key}
              value={diet.key}
              label={diet.label}
              excludes={diet.excludes}
              selectedValue={selected}
              onChange={setSelected}
              disabled={isUpdatingPrimaryDiet}
            />
          ))}
        </div>
      </div>
      {isNutritionTargetUpdated && (
        <PopupButton
          onClick={() => {
            setIsNutriionTargetUpdated(false);
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
    </>
  );
};
export default PrimaryDiet;
