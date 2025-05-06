import React from 'react';
import { Link } from '@tanstack/react-router';

import { PATH } from '@/constants/path';

const Banner: React.FC = () => (
  <div className='flex w-full items-center justify-between gap-5 lg:px-4 xl:px-28'>
    <div className='relative w-1/2'>
      <h1 className='font-rossanova m-0 w-full text-[56px] leading-[100%] font-bold tracking-[-1.92px] text-[#26272b] not-italic'>
        <span className='text-primary'>VietNamese&apos;s Trusted</span>
        <br />
        Nutrition,
        <br />
        Top Plan Meals
      </h1>
      <p className='mt-3 mb-6 w-full text-center text-lg font-thin md:mb-12 md:max-w-[460px] md:text-left'>
        We create personalized meal plans based on your food preferences,
        budget, and schedule. Reach your diet and nutritional goals with our
        calorie calculator, weekly meal plans, grocery lists, and more.
      </p>
      <Link
        to={PATH.MEAL_PLAN}
        className='font-display mb-[12px] text-[14px] leading-[150%] font-bold text-[#199861] not-italic hover:cursor-pointer hover:underline'
      >
        Put your diet on NutriPlan now!
      </Link>
    </div>

    <div className='flex w-1/2 justify-end'>
      <div>
        <img
          src='https://cu-media.imgix.net/media/catalog/product/cache/x1200/1/2/1293_david_adan_mixed_green_salad_with_mozzarella_and_balsamic_basil_vinaigrette_wb_high-res.jpg'
          alt='banner'
          className='h-auto w-full rounded-xl object-cover'
        />
      </div>
    </div>
  </div>
);

export default Banner;
