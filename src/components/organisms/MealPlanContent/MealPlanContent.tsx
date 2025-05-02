import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/atoms/Button';
import { SideAddFood } from '@/molecules/SideAddFood';
import { HeaderLeftMealPlan } from '@/organisms/HeaderLeftMealPlan';

interface MealPlanContentProps {
  children: React.ReactNode;
}

const MealPlanContent: React.FC<MealPlanContentProps> = ({ children }) => {
  const [filterFood, setFilterFood] = useState(false);

  return (
    <div className='relative flex h-screen flex-col'>
      <HeaderLeftMealPlan />

      <div className='flex overflow-y-auto'>
        <AnimatePresence>
          {filterFood && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
              className='sticky top-0 w-[300px]'
            >
              <SideAddFood setFilterFood={setFilterFood} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className='flex-1 overflow-auto'>{children}</div>
      </div>

      {!filterFood && (
        <Button
          className='bg-primary absolute bottom-10 left-5 z-2 flex h-[40px] items-center gap-2 border-none hover:text-black/60'
          onClick={() => setFilterFood(true)}
        >
          <FaSearch />
          <p>Add Food</p>
        </Button>
      )}
    </div>
  );
};

export default MealPlanContent;
