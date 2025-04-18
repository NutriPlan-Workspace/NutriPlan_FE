import React from 'react';

import { DateDisplay } from '@/atoms/DateDisplay';
import { DropdownMenu } from '@/atoms/DropdownMenu';
import { RemoveDropzone } from '@/atoms/RemoveDropzone';
import { PLAN_MENU_ITEMS } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { NavigationButtons } from '@/molecules/NavigationButtons';

const HeaderLeftMealPlan: React.FC = () => {
  const { setSelectedPlan } = useDate();

  const handlePlanChange = (key: string) => {
    setSelectedPlan(key);
  };
  return (
    <div className='flex items-center justify-between border-b border-b-gray-200 pr-8'>
      <div className='bd-[#ede9e6] box-border w-full px-[15px] pt-[20px] pb-[16px]'>
        <DateDisplay />
        <div className='flex w-full flex-wrap items-center gap-x-4 tracking-[0.3px]'>
          <DropdownMenu items={PLAN_MENU_ITEMS} onSelect={handlePlanChange} />
          <NavigationButtons />
        </div>
      </div>
      <RemoveDropzone />
    </div>
  );
};

export default HeaderLeftMealPlan;
