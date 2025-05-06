import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { PRIMARY_DIET, PrimaryDietType } from '@/constants/user';
import {
  useGetPrimaryDietQuery,
  useUpdatePrimaryDietMutation,
} from '@/redux/query/apis/user/userApi';

import PrimaryDietCard from './PrimaryDietCard';

const PrimaryDiet: React.FC = () => {
  const { data: primaryDietData } = useGetPrimaryDietQuery();
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
    }
  }, [selected, primaryDietData, updatePrimaryDiet]);

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
    </>
  );
};
export default PrimaryDiet;
