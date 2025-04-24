import React from 'react';

import SearchInput from '@/molecules/BrowseFoodContent/SearchInput';
import { Footer } from '@/molecules/Footer';
import { Header } from '@/molecules/Header';
import FoodGrid from '@/organisms/FoodGrid/FoodGrid';
import type { Food } from '@/types/food';
import type { FoodFilterQuery } from '@/types/foodFilterQuery';

interface BrowseFoodTemplateProps {
  foods: Food[];
  isFetching: boolean;
  onLoadMore: () => void;
  onFilterChange?: (
    newFilters: Partial<FoodFilterQuery>,
    keysToRemove?: (keyof FoodFilterQuery)[],
  ) => void;
  isLastPage: boolean;
}

const BrowseFoodTemplate: React.FC<BrowseFoodTemplateProps> = ({
  foods,
  isFetching,
  onLoadMore,
  onFilterChange,
  isLastPage,
}) => (
  <div className='flex min-h-screen flex-col'>
    <Header />
    <div className='flex h-auto items-center justify-center'>
      <div className='relative mt-4 flex h-[355px] w-[1115px] items-center justify-center overflow-hidden'>
        <img
          className='h-full w-full rounded-xl object-cover'
          src='https://res.cloudinary.com/dtwrwvffl/image/upload/v1742542188/ciarypp5jujsfd5vpskj.jpg'
          alt='banner'
        />
        <div className='absolute top-1/2 left-10 w-[450px] -translate-y-1/2'>
          <p className='font-rossanova text-[30px] text-[#FFC84E]'>
            Plan smarter, eat healthier !
          </p>
          <p className='text-[20px] text-white'>
            Get personalized meal plans & track your nutrition effortlessly.
          </p>
        </div>
      </div>
    </div>

    <div className='flex flex-1 flex-col px-50'>
      <div className='mt-30 mb-15 text-center'>
        <h2 className='font-rossanova text-[28px] font-bold'>
          What&apos;s cooking near you
        </h2>
        <p className='text-[#A8A8A8]'>
          This is a sample menu — the meals shown are subject to availability.
        </p>
      </div>
      <SearchInput onFilterChange={onFilterChange} />
      <div className='mt-10 mb-30 flex-1'>
        <FoodGrid
          foods={foods}
          isFetching={isFetching}
          onLoadMore={onLoadMore}
          isLastPage={isLastPage}
        />
      </div>
    </div>
    <footer className='bg-black px-0 py-6 text-white lg:px-4 xl:px-24'>
      <Footer />
    </footer>
  </div>
);

export default BrowseFoodTemplate;
