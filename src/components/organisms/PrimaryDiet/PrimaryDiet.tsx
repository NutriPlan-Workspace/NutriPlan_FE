import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { PRIMARY_DIET, PrimaryDietType } from '@/constants/user';
import { cn } from '@/helpers/helpers';
import {
  useGetPrimaryDietQuery,
  useUpdatePrimaryDietMutation,
} from '@/redux/query/apis/user/userApi';

import PrimaryDietCard from './PrimaryDietCard';

export interface PrimaryDietProps {
  embedded?: boolean;
  className?: string;
  showTitle?: boolean;
  onDietChange?: (diet: PrimaryDietType) => void;
}

const PrimaryDiet: React.FC<PrimaryDietProps> = ({
  embedded = false,
  className,
  showTitle = true,
  onDietChange,
}) => {
  const DIET_DETAILS: Record<
    PrimaryDietType,
    {
      title: string;
      summary: string;
      goodFor: string[];
      focusFoods: string[];
      watchOut: string[];
    }
  > = {
    anything: {
      title: 'Anything (Flexible)',
      summary:
        'A balanced baseline with no strict rules. Best if you want full control over exclusions and variety.',
      goodFor: ['Maximum flexibility', 'Trying new foods', 'Easy adherence'],
      focusFoods: [
        'Lean proteins',
        'Fruits & vegetables',
        'Whole grains',
        'Healthy fats',
      ],
      watchOut: ['Portion creep', 'Ultra-processed snacks', 'Sugary drinks'],
    },
    keto: {
      title: 'Keto (Low-carb)',
      summary:
        'Prioritizes fats and proteins while keeping carbs very low. Often used for appetite control.',
      goodFor: ['Low-carb preference', 'Stable energy', 'Simpler food choices'],
      focusFoods: [
        'Eggs',
        'Fish & meat',
        'Avocado',
        'Nuts & seeds',
        'Low-carb vegetables',
      ],
      watchOut: ['Hidden carbs', 'Low fiber', 'Hard to sustain socially'],
    },
    mediterranean: {
      title: 'Mediterranean',
      summary:
        'A heart-healthy pattern built around plants, olive oil, fish, and whole foods.',
      goodFor: ['Long-term health', 'Great variety', 'Balanced macros'],
      focusFoods: [
        'Olive oil',
        'Vegetables',
        'Legumes',
        'Fish',
        'Whole grains',
      ],
      watchOut: [
        'Too much refined bread',
        'Undereating protein',
        'Liquid calories',
      ],
    },
    paleo: {
      title: 'Paleo',
      summary:
        'Emphasizes minimally processed foods, typically excluding grains and most dairy.',
      goodFor: [
        'Whole-food approach',
        'Lower processed intake',
        'High-protein meals',
      ],
      focusFoods: ['Meat & fish', 'Vegetables', 'Fruits', 'Nuts & seeds'],
      watchOut: [
        'Low calcium',
        'Cost and prep time',
        'Overdoing saturated fat',
      ],
    },
    vegan: {
      title: 'Vegan',
      summary:
        'Fully plant-based meals. Great for variety, but needs attention to protein and micronutrients.',
      goodFor: ['Plant-based preference', 'High variety', 'Fiber-rich meals'],
      focusFoods: [
        'Beans & lentils',
        'Tofu/tempeh',
        'Whole grains',
        'Nuts',
        'Vegetables',
      ],
      watchOut: [
        'Low protein per meal',
        'Vitamin B12/iron/omega-3',
        'Ultra-processed substitutes',
      ],
    },
    vegetarian: {
      title: 'Vegetarian',
      summary:
        'Plant-forward meals that may include dairy/eggs depending on your choices.',
      goodFor: ['Plant-forward eating', 'Easy flexibility', 'Good variety'],
      focusFoods: [
        'Eggs',
        'Greek yogurt',
        'Beans & lentils',
        'Whole grains',
        'Vegetables',
      ],
      watchOut: [
        'Low protein',
        'Overdoing cheese',
        'Low iron/fiber if refined carbs dominate',
      ],
    },
  };

  const { data: primaryDietData } = useGetPrimaryDietQuery();
  useEffect(() => {
    if (primaryDietData?.data) {
      setSelected(primaryDietData.data as PrimaryDietType);
    }
  }, [primaryDietData]);

  // PRIMARY DIET
  const [selected, setSelected] = useState<PrimaryDietType | ''>('');
  const [updatePrimaryDiet, { isLoading: isUpdatingPrimaryDiet }] =
    useUpdatePrimaryDietMutation();
  useEffect(() => {
    const updateDiet = async () => {
      await updatePrimaryDiet({
        primaryDiet: selected as PrimaryDietType,
      }).unwrap();
    };
    if (selected !== '' && selected !== primaryDietData?.data) {
      onDietChange?.(selected as PrimaryDietType);
      updateDiet();
    }
  }, [selected, primaryDietData, updatePrimaryDiet]);

  const selectedDetails =
    selected && selected !== ''
      ? DIET_DETAILS[selected as PrimaryDietType]
      : null;

  return (
    <div
      className={cn(
        'w-full',
        embedded ? 'px-0' : 'pl-[50px]',
        embedded ? 'max-w-none' : 'max-w-[980px]',
        className,
      )}
    >
      {showTitle && (
        <h1
          className={cn(
            embedded ? 'pb-3 text-xl font-semibold' : 'py-4 text-[28px]',
          )}
        >
          Primary Diet
        </h1>
      )}
      {embedded ? (
        <p className='pb-4 text-sm text-gray-600'>
          Choose the diet style we should use as your baseline. This will also
          impact which categories get excluded by default.
        </p>
      ) : (
        <p className='pb-4 text-sm text-gray-600'>
          We&apos;ll base your meals off this main diet type. Choose
          &quot;Anything&quot; to customize your own unique diet from scratch
          and set specific exclusions from the{' '}
          <Link to={PATH.FOOD_EXCLUSIONS} className='text-primary-400'>
            &quot;Exclusions&quot; menu screen.
          </Link>
        </p>
      )}

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start'>
        <div className='lg:col-span-7'>
          <div className='flex flex-col gap-3'>
            {PRIMARY_DIET.map((diet) => (
              <PrimaryDietCard
                key={diet.key}
                value={diet.key}
                label={diet.label}
                excludes={diet.excludes}
                selectedValue={selected}
                onChange={setSelected}
                disabled={isUpdatingPrimaryDiet}
              />
            ))}
          </div>
        </div>

        <aside className='lg:col-span-5'>
          <div className='rounded-3xl border border-rose-100/70 bg-white/70 p-5 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] backdrop-blur-2xl sm:p-6 lg:sticky lg:top-24'>
            {!selectedDetails ? (
              <div>
                <div className='text-sm font-semibold text-gray-900'>
                  Diet guide
                </div>
                <p className='mt-2 text-sm text-gray-600'>
                  Select a diet on the left to see what it means, what to focus
                  on, and what to watch out for.
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                <div>
                  <div className='text-sm font-semibold text-gray-900'>
                    Why this diet?
                  </div>
                  <div className='mt-1 text-base font-semibold text-[#e86852]'>
                    {selectedDetails.title}
                  </div>
                  <p className='mt-2 text-sm text-gray-600'>
                    {selectedDetails.summary}
                  </p>
                </div>

                <div className='h-px bg-black/5' />

                <div>
                  <div className='text-sm font-semibold text-gray-900'>
                    Good for
                  </div>
                  <ul className='mt-2 space-y-1 text-sm text-gray-600'>
                    {selectedDetails.goodFor.map((item) => (
                      <li key={item} className='flex gap-2'>
                        <span className='mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ef7a66]' />
                        <span className='min-w-0'>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className='text-sm font-semibold text-gray-900'>
                    Focus foods
                  </div>
                  <ul className='mt-2 flex flex-wrap gap-2'>
                    {selectedDetails.focusFoods.map((item) => (
                      <li
                        key={item}
                        className='rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-[#e86852] ring-1 ring-rose-100'
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className='text-sm font-semibold text-gray-900'>
                    Watch out for
                  </div>
                  <ul className='mt-2 space-y-1 text-sm text-gray-600'>
                    {selectedDetails.watchOut.map((item) => (
                      <li key={item} className='flex gap-2'>
                        <span className='mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300' />
                        <span className='min-w-0'>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
export default PrimaryDiet;
