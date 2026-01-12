import React, { useEffect } from 'react';
import { Divider } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';

import {
  CATEGORIES_BY_GROUP,
  EXCLUDED_BY_DIET,
  FOOD_CATEGORIES,
} from '@/constants/foodCategories';
import { cn } from '@/helpers/helpers';
import {
  useGetFoodExclusionsQuery,
  useGetPrimaryDietQuery,
  useUpdateFoodExclusionsMutation,
} from '@/redux/query/apis/user/userApi';
import {
  getNewExclusions,
  getRelatedCategories,
  getYourExclusions,
} from '@/utils/foodCategory';

import ExclusionButton from './ExclusionButton';

export interface FoodExclusionsProps {
  embedded?: boolean;
  className?: string;
  showTitle?: boolean;
}

const FoodExclusions: React.FC<FoodExclusionsProps> = ({
  embedded = false,
  className,
  showTitle = true,
}) => {
  const { data: primaryDietData } = useGetPrimaryDietQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: foodExclusionData } = useGetFoodExclusionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateFoodExclusions] = useUpdateFoodExclusionsMutation();
  const [excludedByDiet, setExcludedByDiet] = React.useState<Set<number>>(
    new Set(),
  );
  const [excludedByDietFull, setExcludedByDietFull] = React.useState<
    Set<number>
  >(new Set());
  const [exclusions, setExclusions] = React.useState<Set<number>>(new Set());

  useEffect(() => {
    if (primaryDietData?.data) {
      setExcludedByDiet(
        new Set(
          EXCLUDED_BY_DIET[
            primaryDietData.data as keyof typeof EXCLUDED_BY_DIET
          ],
        ),
      );
      setExcludedByDietFull(
        new Set(
          EXCLUDED_BY_DIET[
            primaryDietData.data as keyof typeof EXCLUDED_BY_DIET
          ].flatMap((cate) => getRelatedCategories(cate)),
        ),
      );
    }
  }, [primaryDietData]);

  useEffect(() => {
    if (foodExclusionData?.data) {
      setExclusions(new Set(foodExclusionData.data.categories));
    }
  }, [foodExclusionData]);

  const excludedPercent = Math.round(
    (new Set([...excludedByDietFull, ...exclusions]).size /
      FOOD_CATEGORIES.length) *
      100,
  );

  const toggleExclusion = (value: number) => {
    setExclusions(() => getNewExclusions(value, exclusions));
    const newExclusions = {
      categories: Array.from(getNewExclusions(value, exclusions)),
      foods: foodExclusionData?.data.foods || [],
    };
    updateFoodExclusions(newExclusions);
  };

  const renderToggleItems = (source: Set<number>) => (
    <ul className='flex flex-wrap gap-2'>
      {FOOD_CATEGORIES.filter((item) => source.has(item.value)).map((item) => (
        <li key={item.value}>
          <ExclusionButton
            item={item}
            disabled={excludedByDiet.has(item.value)}
            isActive={exclusions.has(item.value)}
            onToggle={toggleExclusion}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        'w-full',
        embedded ? 'overflow-visible px-0' : 'overflow-y-auto px-[50px]',
        className,
      )}
    >
      {showTitle && (
        <div className={cn(embedded ? 'max-w-none' : 'max-w-[700px]')}>
          <h1 className='py-4 text-[28px]'>Food Exclusions</h1>
          <p className='pb-4 text-gray-600'>
            Add &quot;exclusions&quot; to filter out recipes from generator
            suggestions. Any recipes that match their title or ingredients will
            not be included in your plans.
          </p>
          <p className='text-gray-600'>
            Custom exclusions can be used to completely customize your
            experience.
          </p>
          <Divider />
        </div>
      )}

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <div className='mb-4 flex items-end justify-between gap-3'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                Categories
              </h2>
              <p className='mt-1 text-sm text-gray-600'>
                Toggle categories to filter recipes and suggestions.
              </p>
            </div>
          </div>

          <div className='space-y-6'>
            {CATEGORIES_BY_GROUP.map((category) => (
              <section
                key={category.group}
                className='rounded-3xl border border-black/5 bg-white/60 p-5 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.22)] backdrop-blur-2xl'
              >
                <h3 className='text-base font-semibold text-gray-900'>
                  {category.group}
                </h3>
                <ul className='mt-3 flex flex-wrap gap-2'>
                  {('mainItem' in category && category.mainItem !== undefined
                    ? [category.mainItem, ...category.items]
                    : category.items
                  ).map((value) => {
                    const item = FOOD_CATEGORIES.find((c) => c.value === value);
                    if (!item) return null;
                    return (
                      <li key={item.value}>
                        <ExclusionButton
                          item={item}
                          disabled={excludedByDietFull.has(item.value)}
                          isActive={exclusions.has(item.value)}
                          onToggle={toggleExclusion}
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <aside className='lg:col-span-4'>
          <div className='sticky top-10 space-y-6'>
            <section className='rounded-3xl border border-rose-100/70 bg-white/70 p-5 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.22)] backdrop-blur-2xl'>
              <h2 className='text-base font-semibold text-gray-900'>
                Excluded by diet
                <span className='ml-2 text-sm font-medium text-gray-600'>
                  ({primaryDietData?.data ? String(primaryDietData.data) : '—'})
                </span>
              </h2>
              <div className='mt-3'>{renderToggleItems(excludedByDiet)}</div>
            </section>

            <AnimatePresence>
              {exclusions.size > 0 && (
                <motion.section
                  key='your-exclusions'
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className='overflow-hidden rounded-3xl border border-black/5 bg-white/60 p-5 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.22)] backdrop-blur-2xl'
                >
                  <h2 className='text-base font-semibold text-gray-900'>
                    Your exclusions
                  </h2>
                  <div className='mt-3'>
                    {renderToggleItems(
                      getYourExclusions(exclusions, excludedByDietFull),
                    )}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            <section className='rounded-3xl border border-black/5 bg-white/60 p-5 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.22)] backdrop-blur-2xl'>
              <h2 className='text-base font-semibold text-gray-900'>
                Recipe variety
              </h2>
              <p className='mt-1 text-sm text-gray-600'>
                You have excluded{' '}
                <span className='font-semibold text-gray-900'>
                  {excludedPercent}%
                </span>{' '}
                of categories.
              </p>

              <div className='mt-3 h-3 w-full overflow-hidden rounded-full border border-black/5 bg-white'>
                <motion.div
                  className='h-full rounded-full bg-[#ef7a66]'
                  initial={{ width: 0 }}
                  animate={{ width: `${excludedPercent}%` }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                />
              </div>

              <AnimatePresence>
                {excludedPercent >= 60 && (
                  <motion.div
                    className='mt-3 rounded-2xl bg-rose-50 px-3 py-2 text-sm text-gray-600 ring-1 ring-rose-100'
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    Numerous exclusions may limit recipe variety.
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FoodExclusions;
