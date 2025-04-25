import React from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { Spin } from 'antd';

import { DateDisplay } from '@/atoms/DateDisplay';
import { PLAN_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { GroceryCard } from '@/molecules/GroceryCard';
import { NavigationButtons } from '@/molecules/NavigationButtons';
import { useGetGroceriesQuery } from '@/redux/query/apis/mealPlan/mealPlanApi';
import { getMealDate } from '@/utils/dateUtils';

const GroceriesContent: React.FC = () => {
  const { rangeDate, setSelectedPlan } = useDate();
  setSelectedPlan(PLAN_TYPES.WEEKLY_VIEW);
  const { from, to } =
    rangeDate?.from && rangeDate?.to
      ? { from: getMealDate(rangeDate.from), to: getMealDate(rangeDate.to) }
      : {};

  const { data } = useGetGroceriesQuery(from && to ? { from, to } : skipToken);
  return (
    <div>
      <div className='flex'>
        <NavigationButtons />
        <div className='mt-2 ml-2'>
          <DateDisplay isGroceries={true} />
        </div>
      </div>
      {!data?.data ? (
        <div className='flex h-[600px] items-center justify-center'>
          <Spin size='large' />
        </div>
      ) : (
        <div>
          <GroceryCard data={data.data} />
        </div>
      )}
    </div>
  );
};

export default GroceriesContent;
