import React, { useEffect } from 'react';
import { Divider } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';

import {
  CATEGORIES_BY_GROUP,
  EXCLUDED_BY_DIET,
  FOOD_CATEGORIES,
} from '@/constants/foodCategories';
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

const FoodExclusions: React.FC = () => {
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
    <div className='h-[100vh] w-full overflow-y-scroll px-[50px]'>
      <div className='max-w-[700px]'>
        <h1 className='py-4 text-[28px]'>Food Exclusions</h1>
        <p className='pb-4 text-gray-600'>
          Add &quot;exclusions&quot; to filter out recipes from the generator
          suggestions. Any recipes that match their title or ingredients will
          not be included in your plans.
        </p>
        <p className='text-gray-600'>
          Custom Exclusions can be used to completely customize your experience.
          For example, add &quot;Bell Peppers&quot; if you are allergic or
          &quot;Smoothie&quot; if you dislike making them.
        </p>
      </div>
      <Divider />

      <div className='my-6 flex max-w-[1000px] gap-10'>
        <div className='max-w-[600px] flex-1'>
          <h2 className='text-[22px]'>Detail Category</h2>
          {CATEGORIES_BY_GROUP.map((category) => (
            <div key={category.group}>
              <h3 className='pt-6 pb-2 text-[18px]'>{category.group}</h3>
              <ul className='flex flex-wrap gap-2'>
                {('mainItem' in category && category.mainItem
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
            </div>
          ))}
        </div>

        <div className='sticky top-10 h-fit w-[400px]'>
          <h2 className='pb-2 text-[22px]'>
            Excluded by Diet (
            <span className='capitalize'>
              {primaryDietData && primaryDietData.data}
            </span>
            )
          </h2>
          {renderToggleItems(excludedByDiet)}

          <AnimatePresence>
            {exclusions.size > 0 && (
              <motion.div
                key='your-exclusions'
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='overflow-hidden'
              >
                <h2 className='pt-6 pb-2 text-[22px]'>Your Exclusions</h2>
                {renderToggleItems(
                  getYourExclusions(exclusions, excludedByDietFull),
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className='min-h-[150px]'>
            <h2 className='pt-6 pb-2 text-[22px]'>Recipes Variety</h2>
            <p className='text-sm text-gray-600'>
              You have excluded {excludedPercent}% of the available categories.
            </p>
            <div className='mt-2 mb-3 h-4 w-[300px] overflow-hidden rounded-full border border-gray-200 bg-white'>
              <motion.div
                className='bg-primary h-full rounded-full'
                initial={{ width: 0 }}
                animate={{ width: `${excludedPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>

            <AnimatePresence>
              {excludedPercent >= 60 && (
                <motion.div
                  className='bg-primary-100 px-3 py-1'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className='text-sm text-gray-600'>
                    Numerous food exclusions may limit the variety of recipes
                    available.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodExclusions;
