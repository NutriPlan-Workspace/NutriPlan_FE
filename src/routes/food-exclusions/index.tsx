import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import FoodExclusions from '@/organisms/FoodExclusions/FoodExclusions';
import { PrimaryDiet } from '@/organisms/PrimaryDiet';
import UserHubPageShell from '@/templates/UserHubPageShell';
import { handleUserRoute } from '@/utils/route';

const FoodExclusionsPage: React.FC = () => (
  <UserHubPageShell
    title='Food Exclusions'
    description='Set your primary diet and exclude foods you don’t want in recommendations.'
  >
    <div className='flex flex-col gap-6'>
      <section className='rounded-3xl border border-rose-100/70 bg-white/70 p-6 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] backdrop-blur-2xl sm:p-7'>
        <div className='mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>Primary Diet</h2>
          <p className='mt-1 text-sm text-gray-600'>
            Helps us tailor foods and meal plans to you.
          </p>
        </div>
        <PrimaryDiet embedded showTitle={false} />
      </section>

      <section className='rounded-3xl border border-rose-100/70 bg-white/70 p-6 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] backdrop-blur-2xl sm:p-7'>
        <div className='mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Excluded Foods
          </h2>
          <p className='mt-1 text-sm text-gray-600'>
            We’ll avoid these in search and suggestions.
          </p>
        </div>
        <FoodExclusions embedded showTitle={false} />
      </section>
    </div>
  </UserHubPageShell>
);

export const Route = createFileRoute(
  PATH.FOOD_EXCLUSIONS as keyof FileRoutesByPath,
)({
  component: FoodExclusionsPage,
  beforeLoad: handleUserRoute,
});
