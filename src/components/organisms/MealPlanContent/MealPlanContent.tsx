import React from 'react';

import { HeaderLeftMealPlan } from '@/organisms/HeaderLeftMealPlan';
import { MealPlanChatbot } from '@/organisms/MealPlanChatbot';
import { MealSwapModalController } from '@/organisms/MealSwapModalController';

interface MealPlanContentProps {
  children: React.ReactNode;
}

const MealPlanContent: React.FC<MealPlanContentProps> = ({ children }) => (
  <div className='relative flex h-full min-h-0 flex-col'>
    <HeaderLeftMealPlan />

    <div
      className='min-h-0 flex-1 overflow-auto transition-[padding] duration-300'
      style={{
        paddingLeft: 'var(--mealplan-dock-offset-left, 0px)',
        paddingRight: 'var(--mealplan-dock-offset-right, 0px)',
      }}
    >
      {children}
    </div>

    <MealSwapModalController />
    <MealPlanChatbot />
  </div>
);

export default MealPlanContent;
