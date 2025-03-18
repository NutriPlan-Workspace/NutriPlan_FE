import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from '@tanstack/react-router';

import { Button } from '@/atoms/Button';
import { NavigationHeader } from '@/atoms/NavigationHeader';
import { PATH } from '@/constants/path';

const Header: React.FC<{
  mealPlanRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ mealPlanRef }) => {
  const scrollToMealPlan = () => {
    mealPlanRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <header className='flex w-full items-center justify-center border-b border-black/8 px-0 lg:px-4 xl:px-24'>
      <div className='m-auto flex h-20 w-full items-center justify-between'>
        <div className='text-lg font-bold text-gray-800'>Nutri X Plan</div>

        <NavigationHeader />

        <div className='flex items-center gap-2'>
          <Button
            className='bg-primary hover:bg-primary-400 h-10 w-32 rounded-full border-none px-5 py-2.5 text-base font-bold text-black'
            onClick={scrollToMealPlan}
          >
            Plan Now
          </Button>
          <Button className='h-10 rounded-full border border-transparent bg-white px-5 py-2.5 text-base text-gray-600 hover:border-gray-300'>
            <Link to={PATH.LOGIN} className='flex items-center gap-1'>
              <span className='font-medium'>Log In</span>
              <FaArrowRight className='h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
export default Header;
