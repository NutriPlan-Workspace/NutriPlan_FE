import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/atoms/Button';
import { SideAddFood } from '@/molecules/SideAddFood';
import { HeaderLeftMealPlan } from '@/organisms/HeaderLeftMealPlan';

interface MealPlanContentProps {
  width: string;
  children: React.ReactNode;
}

const MealPlanContent: React.FC<MealPlanContentProps> = ({
  width,
  children,
}) => {
  const [filterFood, setFilterFood] = useState(false);
  const [calculatedWidth, setCalculatedWidth] = useState(width);

  useEffect(() => {
    setCalculatedWidth(filterFood ? `calc(${width} - 420px)` : width);
  }, [filterFood, width]);

  return (
    <div className='relative flex h-screen w-full flex-col'>
      <HeaderLeftMealPlan />
      <motion.div
        animate={{ width }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className='flex h-full justify-start gap-2 overflow-y-auto'
      >
        <AnimatePresence>
          {filterFood && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
            >
              <SideAddFood setFilterFood={setFilterFood} />
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ width: calculatedWidth }}>{children}</div>
      </motion.div>
      {!filterFood && (
        <Button
          className='bg-primary absolute bottom-10 left-5 flex h-[40px] items-center gap-2 border-none hover:text-black/60'
          onClick={() => setFilterFood(true)}
        >
          <FaSearch />
          <p>Search Food</p>
        </Button>
      )}
    </div>
  );
};

export default MealPlanContent;
