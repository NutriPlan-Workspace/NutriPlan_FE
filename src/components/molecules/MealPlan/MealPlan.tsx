import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { Card } from 'antd';

import { Button } from '@/atoms/Button';
import { CalorieInput } from '@/atoms/CalorieInput';
import { DietOptions } from '@/atoms/DietOptions';
import { NutritionList } from '@/atoms/NutritionList';
import { DIET_LABELS } from '@/constants/dietLabels';
import { PATH } from '@/constants/path';
import { MealPlanFormData, mealPlanSchema } from '@/schemas/mealPlan.schema';

interface MealPlanProps {
  mealPlanRef?: React.RefObject<HTMLDivElement | null>;
}

const MealPlan: React.FC<MealPlanProps> = ({ mealPlanRef }) => {
  const methods = useForm<MealPlanFormData>({
    resolver: zodResolver(mealPlanSchema),
    defaultValues: {
      calories: 180,
      meals: '1',
      diet: DIET_LABELS.ANYTHING,
    },
  });

  const { watch, handleSubmit, formState } = methods;
  const { isSubmitting } = formState;
  const selectedDiet = watch('diet');

  const onSubmit = async (data: MealPlanFormData) => {
    // Testing disable submit button
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Submitted Data:', data);
  };
  return (
    <div
      ref={mealPlanRef}
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
                disabled={isSubmitting}
                className='bg-primary hover:bg-primary-400 border-none px-8 py-5 text-[16px] font-bold text-black disabled:bg-gray-500 disabled:text-white disabled:opacity-50'
              >
                {isSubmitting ? 'Loading...' : 'Generate'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default MealPlan;
