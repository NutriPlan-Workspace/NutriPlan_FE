import React from 'react';
import { motion } from 'framer-motion';

import { HeaderLeftMealPlan } from '@/organisms/HeaderLeftMealPlan';

interface MealPlanContentProps {
  width: string;
  children: React.ReactNode;
}

const MealPlanContent: React.FC<MealPlanContentProps> = ({
  width,
  children,
}) => (
  <div className='flex h-full w-full flex-col'>
    <HeaderLeftMealPlan />
    <motion.div
      animate={{ width }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className='h-full'
    >
      {children}
    </motion.div>
  </div>
);

export default MealPlanContent;
