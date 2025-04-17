import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/atoms/Button';
import { SIDEBAR_WIDTH } from '@/constants/layout';
import { SideAddFood } from '@/molecules/SideAddFood';
import { HeaderLeftMealPlan } from '@/organisms/HeaderLeftMealPlan';

interface MealPlanContentProps {
  isSidebarOpen: boolean;
  children: React.ReactNode;
}

const MealPlanContent: React.FC<MealPlanContentProps> = ({
  isSidebarOpen,
  children,
}) => {
  const [filterFood, setFilterFood] = useState(false);
  const [calculatedWidth, setCalculatedWidth] = useState('100vw');

  useEffect(() => {
    const sidebarWidth = isSidebarOpen
      ? SIDEBAR_WIDTH.OPEN
      : SIDEBAR_WIDTH.COLLAPSED;

    const width = `calc(100vw - ${sidebarWidth}px)`;
    setCalculatedWidth(filterFood ? `calc(${width} - 420px)` : width);
  }, [isSidebarOpen, filterFood]);

  return (
    <div className='relative flex h-screen w-full flex-col'>
      <HeaderLeftMealPlan />
      <motion.div
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className='flex justify-start gap-2 overflow-x-hidden'
      >
        <AnimatePresence>
          {filterFood && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
              className='sticky top-0'
            >
              <SideAddFood setFilterFood={setFilterFood} />
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ width: calculatedWidth }}>{children}</div>
      </motion.div>
      {!filterFood && (
        <Button
          className='bg-primary absolute bottom-10 left-5 z-2 flex h-[40px] items-center gap-2 border-none hover:text-black/60'
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
