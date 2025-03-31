import React from 'react';
import { Typography } from 'antd';

import { NutritionForm } from '@/molecules/NutritionForm';
import { useGetNutritionRequestQuery } from '@/redux/query/apis/user/userApis';

const { Title } = Typography;

const NutritionTarget: React.FC = () => {
  const { data, isLoading } = useGetNutritionRequestQuery();

  return (
    <div className='m-10'>
      <div className='flex flex-col gap-2'>
        <Title level={2} className='font-extralight'>
          Nutrition Targets
        </Title>
        <p className='max-w-[500px] text-sm font-thin'>
          These store your desired nutrition targets. You can use the same
          targets for every day of the week, or give different profiles to
          different days (like workout vs rest days)
        </p>
        <NutritionForm nutritionData={data?.data} loading={isLoading} />
      </div>
    </div>
  );
};

export default NutritionTarget;
