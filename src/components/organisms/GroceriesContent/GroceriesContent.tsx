import React, { useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { Spin } from 'antd';

import { DateDisplay } from '@/atoms/DateDisplay';
import { PLAN_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { GroceryCard } from '@/molecules/GroceryCard';
import { NavigationButtons } from '@/molecules/NavigationButtons';
import { useGetGroceriesQuery } from '@/redux/query/apis/mealPlan/mealPlanApi';
import HubPageShell from '@/templates/HubPageShell';
import { getMealDate } from '@/utils/dateUtils';

const GroceriesContent: React.FC = () => {
  const { rangeDate, setSelectedPlan } = useDate();
  useEffect(() => {
    setSelectedPlan(PLAN_TYPES.WEEKLY_VIEW);
  }, [setSelectedPlan]);

  const { from, to } =
    rangeDate?.from && rangeDate?.to
      ? { from: getMealDate(rangeDate.from), to: getMealDate(rangeDate.to) }
      : {};

  const { data } = useGetGroceriesQuery(from && to ? { from, to } : skipToken);

  return (
    <HubPageShell
      title='Groceries'
      description='A combined ingredient list for your selected meal plan range.'
      actions={
        <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end'>
          <div className='order-2 flex items-center sm:order-1'>
            <div className='rounded-2xl border border-gray-200 bg-white/80 p-1 shadow-sm backdrop-blur-sm'>
              <NavigationButtons variant='compact' />
            </div>
          </div>

          <div className='order-1 sm:order-2'>
            <DateDisplay
              isGroceries
              showGroceriesPrefix={false}
              variant='compact'
              className='border-primary-100/70 from-primary-50/70 to-primary-50/60 max-w-full rounded-2xl border bg-gradient-to-r via-white/80 px-3 py-2 shadow-sm backdrop-blur-sm sm:max-w-[460px]'
            />
          </div>
        </div>
      }
      maxWidthClassName='max-w-[1200px]'
    >
      {!data?.data ? (
        <div className='flex min-h-[420px] items-center justify-center rounded-3xl border border-white/25 bg-white/45 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/35'>
          <Spin size='large' />
        </div>
      ) : (
        <GroceryCard data={data.data} />
      )}
    </HubPageShell>
  );
};

export default GroceriesContent;
