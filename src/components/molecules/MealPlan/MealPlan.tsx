import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BsStars } from 'react-icons/bs';
import { FaRobot, FaSyncAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { MdDragIndicator } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Popover } from 'antd';
import { motion } from 'motion/react';

import { Button } from '@/atoms/Button';
import { CalorieInput } from '@/atoms/CalorieInput';
import { DietOptions } from '@/atoms/DietOptions';
import { NutritionList } from '@/atoms/NutritionList';
import { DIET_LABELS } from '@/constants/dietLabels';
import { PATH } from '@/constants/path';
import { NUTRITION_POPOVER_BODY_STYLE } from '@/constants/popoverStyles';
import NutritionPopoverFood from '@/molecules/NutritionPopoverFood/NutritionPopoverFood';
import { useAutoGenerateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import {
  setIsModalDetailOpen,
  setViewingDetailFood,
} from '@/redux/slices/food';
import { userSelector } from '@/redux/slices/user/userSelector';
import { MealPlanFormData, mealPlanSchema } from '@/schemas/mealPlan.schema';
import type { MealPlanDay, MealPlanFood } from '@/types/mealPlan';
import {
  getTotalCalories,
  getTotalNutrition,
} from '@/utils/calculateNutrition';
import { convertDietLabelToPrimaryDiet } from '@/utils/dietUtils';
import { calculateNutritionAmounts } from '@/utils/nutrition';

import { DayBoxSummary } from '../DayBoxSummary';
import { NutritionPopoverMeal } from '../NutritionPopoverMeal';

const MealPlan: React.FC = () => {
  const [generateMealPlan, { isLoading }] = useAutoGenerateMealPlanMutation();
  const [generatedMealPlan, setGeneratedMealPlan] =
    useState<MealPlanDay | null>(null);
  const [showFeaturePromo, setShowFeaturePromo] = useState(false);

  const dispatch = useDispatch();
  const userState = useSelector(userSelector);
  const isLoggedIn = userState.user.id !== '';

  const methods = useForm<MealPlanFormData>({
    resolver: zodResolver(mealPlanSchema),
    defaultValues: {
      calories: 1800,
      meals: '3',
      diet: DIET_LABELS.ANYTHING,
    },
  });

  const { watch, handleSubmit } = methods;
  const selectedDiet = watch('diet');
  const calories = watch('calories');

  const onSubmit = async (data: MealPlanFormData) => {
    try {
      const nutritionAmounts = calculateNutritionAmounts(
        calories,
        selectedDiet,
      );
      const carbs = parseInt(nutritionAmounts.carbs);
      const protein = parseInt(nutritionAmounts.protein);
      const fat = parseInt(nutritionAmounts.fat);

      const response = await generateMealPlan({
        preferences: {
          type: convertDietLabelToPrimaryDiet(data.diet),
          calories: data.calories,
          carbs,
          protein,
          fat,
        },
      }).unwrap();

      if (response.data) {
        setGeneratedMealPlan(response.data);
        if (!isLoggedIn) {
          setShowFeaturePromo(true);
        }
      }
    } catch {
      // ignore errors here; handled by API layer
    }
  };

  const handleFoodClick = (item: MealPlanFood) => {
    if (!isLoggedIn) {
      return;
    }
    dispatch(setViewingDetailFood(item));
    dispatch(setIsModalDetailOpen(true));
  };

  return (
    <div
      id='try-plan'
      className='relative flex w-full flex-col gap-8 overflow-hidden'
    >
      <div className='pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-emerald-200/60 blur-[120px]' />
      <div className='pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-sky-200/60 blur-[120px]' />
      <div className='flex flex-col gap-3 lg:text-left'>
        <span className='text-center text-xs font-semibold tracking-[0.3em] text-emerald-600 uppercase'>
          Meal plan builder
        </span>
        <h2
          className='text-center text-3xl leading-tight font-semibold text-gray-900 md:text-4xl'
          style={{ fontFamily: 'var(--font-rossanova)' }}
        >
          Create your meal plan right here in seconds
        </h2>
        <p className='mx-auto text-center text-sm text-gray-600 md:text-base lg:mx-0'>
          Set your calories, pick a diet style, and instantly preview balanced
          macros with a plan tailored to your goals.
        </p>
      </div>
      <div className='grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch'>
        <div className='flex flex-col gap-6'>
          <Card
            className='mealplan-card h-full w-full rounded-[24px] border border-emerald-100/60 bg-white shadow-[0_24px_64px_-36px_rgba(16,24,40,0.25)]'
            styles={{ body: { width: '100%', padding: 0, height: '100%' } }}
          >
            <div className='flex h-full flex-col gap-6 p-6 sm:p-7'>
              <div className='text-left'>
                <p className='text-xs font-semibold tracking-[0.25em] text-emerald-600 uppercase'>
                  Preferred diet
                </p>
                <h3 className='mt-2 text-2xl font-semibold text-gray-900'>
                  Choose your nutrition targets
                </h3>
              </div>

              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='flex w-full flex-col gap-6'
                >
                  <div className='flex flex-col gap-5'>
                    <div className='rounded-2xl border border-gray-200/70 bg-slate-50/60 p-4'>
                      <DietOptions />
                    </div>

                    <NutritionList selectedDiet={selectedDiet}>
                      <CalorieInput variant='compact' className='p-0' />
                    </NutritionList>
                  </div>

                  <div className='flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600'>
                    <span>Want to set specific macro targets?</span>
                    <a
                      href={PATH.REGISTER}
                      className='font-semibold text-emerald-600 hover:underline'
                    >
                      Create a free account!
                    </a>
                  </div>

                  <div className='mt-1 flex justify-center'>
                    <Button
                      htmlType='submit'
                      disabled={isLoading}
                      className='bg-primary hover:bg-primary-400 border-none px-8 py-5 text-[16px] font-bold text-black disabled:bg-gray-500 disabled:text-white disabled:opacity-50'
                    >
                      {isLoading ? 'Loading...' : 'Generate'}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className='flex h-full flex-col rounded-[24px] border border-emerald-100/60 bg-white p-5 shadow-[0_24px_64px_-36px_rgba(16,24,40,0.25)]'
        >
          <div className='relative flex items-center justify-between'>
            <div>
              <p className='text-xs font-semibold tracking-[0.25em] text-emerald-600 uppercase'>
                Generated plan
              </p>
              <h3 className='mt-2 text-xl font-semibold text-gray-900'>
                Today’s meals
              </h3>
            </div>
            <div className='relative'>
              <span className='rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>
                Preview
              </span>
              {!isLoggedIn && showFeaturePromo && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className='absolute top-full right-0 z-20 mt-3 w-[280px] rounded-xl border border-emerald-100 bg-white p-4 shadow-xl'
                >
                  <div className='absolute -top-2 right-4 h-4 w-4 rotate-45 border-t border-l border-emerald-100 bg-white' />
                  <button
                    onClick={() => setShowFeaturePromo(false)}
                    className='absolute top-2 right-2 text-gray-400 transition-colors hover:text-gray-600'
                  >
                    <IoMdClose size={18} />
                  </button>
                  <div className='flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase'>
                    <BsStars className='text-sm' />
                    <span>Login to unlock</span>
                  </div>
                  <div className='mt-3 grid grid-cols-3 gap-2'>
                    <div className='flex flex-col items-center gap-1 text-center'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600'>
                        <MdDragIndicator />
                      </div>
                      <span className='text-[10px] font-medium text-gray-600'>
                        Drag & Drop
                      </span>
                    </div>
                    <div className='flex flex-col items-center gap-1 text-center'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600'>
                        <FaSyncAlt className='text-xs' />
                      </div>
                      <span className='text-[10px] font-medium text-gray-600'>
                        Auto-Generate
                      </span>
                    </div>
                    <div className='flex flex-col items-center gap-1 text-center'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600'>
                        <FaRobot />
                      </div>
                      <span className='text-[10px] font-medium text-gray-600'>
                        AI Assistant
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {generatedMealPlan ? (
            <div className='mt-4 flex flex-1 flex-col'>
              <DayBoxSummary
                allDayMealItems={[
                  ...generatedMealPlan.mealItems.breakfast,
                  ...generatedMealPlan.mealItems.lunch,
                  ...generatedMealPlan.mealItems.dinner,
                ]}
                isLoading={isLoading}
                showProgress={false}
              />

              <div className='mt-6 flex-1 space-y-6 overflow-auto pr-1'>
                {(
                  [
                    {
                      key: 'breakfast',
                      label: 'Breakfast',
                      items: generatedMealPlan.mealItems.breakfast,
                    },
                    {
                      key: 'lunch',
                      label: 'Lunch',
                      items: generatedMealPlan.mealItems.lunch,
                    },
                    {
                      key: 'dinner',
                      label: 'Dinner',
                      items: generatedMealPlan.mealItems.dinner,
                    },
                  ] as const
                ).map((meal) => (
                  <div
                    key={meal.key}
                    className='rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.25),_0_2px_4px_rgba(15,23,42,0.06)] backdrop-blur-sm'
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <div className='text-sm font-semibold text-gray-900'>
                          {meal.label}
                        </div>
                        <div className='mt-1 text-xs text-gray-500'>
                          {meal.items.length > 0
                            ? `${meal.items.length} item${meal.items.length === 1 ? '' : 's'}`
                            : 'No items'}
                        </div>
                      </div>
                      <Popover
                        placement='left'
                        color='white'
                        styles={{ body: { padding: 0 } }}
                        content={
                          <NutritionPopoverMeal
                            mealType={meal.label}
                            nutritionData={getTotalNutrition(meal.items)}
                          />
                        }
                      >
                        <div className='cursor-pointer rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100'>
                          {getTotalCalories(meal.items)} kcal
                        </div>
                      </Popover>
                    </div>

                    {meal.items.length > 0 ? (
                      <div className='mt-4 space-y-2'>
                        {meal.items.map((item) => (
                          <Popover
                            key={item._id}
                            placement='left'
                            color='white'
                            styles={{ body: NUTRITION_POPOVER_BODY_STYLE }}
                            content={<NutritionPopoverFood mealItem={item} />}
                          >
                            <div
                              onClick={() => handleFoodClick(item)}
                              className={`flex cursor-pointer items-center gap-3 rounded-xl border border-black/5 bg-white/70 px-3 py-2 transition-colors hover:bg-white/90 ${!isLoggedIn ? 'cursor-default' : ''}`}
                            >
                              <div className='h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100'>
                                <img
                                  src={
                                    item.foodId.imgUrls?.[0] ||
                                    'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif'
                                  }
                                  alt={item.foodId.name}
                                  className='h-full w-full object-cover'
                                />
                              </div>
                              <div className='min-w-0 flex-1'>
                                <div className='truncate text-sm font-medium text-gray-900'>
                                  {item.foodId.name}
                                </div>
                                <div className='mt-0.5 text-xs text-gray-500'>
                                  {item.amount}{' '}
                                  {item.foodId.units?.[item.unit]?.description}
                                </div>
                              </div>
                              <div className='shrink-0 text-xs font-semibold text-gray-600'>
                                {Math.round(item.foodId.nutrition.calories)}{' '}
                                kcal
                              </div>
                            </div>
                          </Popover>
                        ))}
                      </div>
                    ) : (
                      <div className='mt-4 rounded-xl border border-dashed border-emerald-200/80 bg-emerald-50/30 p-4 text-center text-xs text-emerald-700'>
                        No meals generated for this slot.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='mt-6 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-emerald-200/80 bg-emerald-50/40 p-6 text-center text-sm text-emerald-700'>
              Generate a plan to see your meals here.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MealPlan;
