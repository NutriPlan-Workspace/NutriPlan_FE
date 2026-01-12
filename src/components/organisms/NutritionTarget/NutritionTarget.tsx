import React from 'react';

import { NutritionForm } from '@/molecules/NutritionForm';
import { useGetNutritionRequestQuery } from '@/redux/query/apis/user/userApis';

const NutritionTarget: React.FC = () => {
  const { data, isLoading } = useGetNutritionRequestQuery();

  return (
    <div className='w-full'>
      <NutritionForm nutritionData={data?.data} loading={isLoading} />
    </div>
  );
};

export default NutritionTarget;
