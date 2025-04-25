import React from 'react';

import { Banner } from '@/molecules/Banner';
import { MealPlan } from '@/molecules/MealPlan';

const LandingContent: React.FC = () => (
  <div className='flex flex-col items-center gap-10'>
    <section className='w-full border-b border-black/8 p-6 px-0 py-10'>
      <Banner />
    </section>

    <section className='my-10 flex w-full flex-col items-center p-6'>
      <MealPlan />
    </section>
  </div>
);

export default LandingContent;
