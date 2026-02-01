import React, { useCallback, useEffect, useState } from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { FoodsSection } from '@/molecules/FoodsSection';
import FoodExclusions from '@/organisms/FoodExclusions/FoodExclusions';
import { PrimaryDiet } from '@/organisms/PrimaryDiet';
import {
  useGetExclusionCollectionQuery,
  useUpdateExclusionFoodsMutation,
} from '@/redux/query/apis/collection/collectionApi';
import UserHubPageShell from '@/templates/UserHubPageShell';
import type { CollectionFood } from '@/types/collection';
import type { MenuItemDropdown } from '@/types/menuItem';
import { handleUserRoute } from '@/utils/route';

const dropdownItems: MenuItemDropdown[] = [
  { key: '1', label: 'Date Added' },
  { key: '2', label: 'Name' },
];

const FoodExclusionsPage: React.FC = () => {
  const { data: exclusionData } = useGetExclusionCollectionQuery();
  const [updateExclusionFoods] = useUpdateExclusionFoodsMutation();
  const [foods, setFoods] = useState<CollectionFood[]>([]);

  useEffect(() => {
    if (exclusionData?.data?.foods) {
      setFoods(exclusionData.data.foods);
    }
  }, [exclusionData]);

  const buildBriefs = useCallback(
    (items: CollectionFood[]) =>
      items.map((item) => ({
        food: item.food._id,
        date: item.date,
      })),
    [],
  );

  const handleRemoveFood = async (foodId: string) => {
    const nextFoods = foods.filter((item) => item.food._id !== foodId);
    const result = await updateExclusionFoods({
      data: buildBriefs(nextFoods),
    }).unwrap();
    if (result?.data?.foods) {
      setFoods(result.data.foods);
    } else {
      setFoods(nextFoods);
    }
  };

  const handleAddFood = async (foodId: string) => {
    if (foods.some((item) => item.food._id === foodId)) return;
    const nextFoods = [
      ...foods,
      {
        food: { _id: foodId } as CollectionFood['food'],
        date: new Date().toISOString(),
        _id: foodId,
      },
    ];
    const result = await updateExclusionFoods({
      data: buildBriefs(nextFoods),
    }).unwrap();
    if (result?.data?.foods) {
      setFoods(result.data.foods);
    } else {
      setFoods(nextFoods);
    }
  };

  return (
    <UserHubPageShell
      title='Food Exclusions'
      description='Set your primary diet and exclude foods you don’t want in recommendations.'
    >
      <div className='flex flex-col gap-6'>
        <section
          data-tour='userhub-primary-diet-card'
          className='rounded-3xl border border-rose-100/70 bg-white/70 p-6 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] backdrop-blur-2xl sm:p-7'
        >
          <div className='mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Primary Diet
            </h2>
            <p className='mt-1 text-sm text-gray-600'>
              Helps us tailor foods and meal plans to you.
            </p>
          </div>
          <div data-tour='userhub-primary-diet-picker'>
            <PrimaryDiet embedded showTitle={false} />
          </div>
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

        <section className='rounded-3xl border border-rose-100/70 bg-white/70 p-6 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] backdrop-blur-2xl sm:p-7'>
          <div className='mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Exclusion Collection
            </h2>
            <p className='mt-1 text-sm text-gray-600'>
              Foods added here will be blocked from search and meal plan
              generation when exclusions are enabled.
            </p>
          </div>
          <FoodsSection
            dropdownItems={dropdownItems}
            foods={foods}
            onRemoveFood={handleRemoveFood}
            onAddFood={handleAddFood}
          />
        </section>
      </div>
    </UserHubPageShell>
  );
};

export const Route = createFileRoute(
  PATH.FOOD_EXCLUSIONS as keyof FileRoutesByPath,
)({
  component: FoodExclusionsPage,
  beforeLoad: handleUserRoute,
});
