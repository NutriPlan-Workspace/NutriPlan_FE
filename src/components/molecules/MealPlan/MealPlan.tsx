import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { Card } from 'antd';
import { motion } from 'motion/react';

import { Button } from '@/atoms/Button';
import { CalorieInput } from '@/atoms/CalorieInput';
import { DietOptions } from '@/atoms/DietOptions';
import { NutritionList } from '@/atoms/NutritionList';
import { DIET_LABELS } from '@/constants/dietLabels';
import { PATH } from '@/constants/path';
import { MealBox } from '@/organisms/MealBox';
import { useAutoGenerateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import { MealPlanFormData, mealPlanSchema } from '@/schemas/mealPlan.schema';
import type { MealPlanDay } from '@/types/mealPlan';
import { convertDietLabelToPrimaryDiet } from '@/utils/dietUtils';
import { calculateNutritionAmounts } from '@/utils/nutrition';

import { DayBoxSummary } from '../DayBoxSummary';

const MealPlan: React.FC = () => {
  const [generateMealPlan, { isLoading }] = useAutoGenerateMealPlanMutation();
  const [generatedMealPlan, setGeneratedMealPlan] =
    useState<MealPlanDay | null>(null);

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
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
    }
  };

  return (
    <div
      id='try-plan'
      className='flex flex-col items-center justify-center lg:px-4 xl:px-24'
    >
      <h2 className='font-rossanova mb-6 text-[40px] font-bold'>
        Create your meal plan right here in seconds
      </h2>

      <Card className='flex w-full max-w-[900px] flex-col items-center gap-6 p-[50px] shadow-md'>
        <h3 className='text-primary mb-4 text-center text-lg text-[24px] font-semibold'>
          Preferred Diet
        </h3>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex w-full flex-col items-center gap-6'
          >
            <DietOptions />

            <CalorieInput />

            <NutritionList selectedDiet={selectedDiet} />

            <div className='flex items-center justify-center gap-2 text-[14px]'>
              <p>Want to set specific macro targets?</p>
              <Link to={PATH.REGISTER} className='hover:underline'>
                Create a free account!
              </Link>
            </div>

            <div className='mt-3 flex justify-center'>
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
      </Card>

      {generatedMealPlan && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='w-full'
        >
          <Card className='mt-7 flex w-full max-w-[900px] flex-col items-center gap-6 p-[50px] shadow-md'>
            <div className='animate-fadeIn mt-4 w-full max-w-[900px]'>
              <h3 className='text-primary mb-4 text-center text-[24px] font-semibold'>
                Your Generated Meal Plan
              </h3>
              <DayBoxSummary
                allDayMealItems={[
                  ...generatedMealPlan.mealItems.breakfast,
                  ...generatedMealPlan.mealItems.lunch,
                  ...generatedMealPlan.mealItems.dinner,
                ]}
                isLoading={isLoading}
              />
              <div className='mt-6 space-y-6'>
                <MealBox
                  mealDate={generatedMealPlan.mealDate}
                  mealType='breakfast'
                  mealItems={generatedMealPlan.mealItems.breakfast}
                  isLoading={isLoading}
                />
                <MealBox
                  mealDate={generatedMealPlan.mealDate}
                  mealType='lunch'
                  mealItems={generatedMealPlan.mealItems.lunch}
                  isLoading={isLoading}
                />
                <MealBox
                  mealDate={generatedMealPlan.mealDate}
                  mealType='dinner'
                  mealItems={generatedMealPlan.mealItems.dinner}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default MealPlan;
