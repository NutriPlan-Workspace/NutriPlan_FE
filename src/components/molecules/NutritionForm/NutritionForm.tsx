import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/atoms/Button';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants/message';
import { useToast } from '@/contexts/ToastContext';
import { useUpdateNutritionRequestMutation } from '@/redux/query/apis/user/userApis';
import {
  NutritionFormSchema,
  nutritionSchema,
} from '@/schemas/nutritionTargetSchema';
import type { NutritionTarget } from '@/types/user';

import Micronutrients from './Micronutrients';
import NutritionTitle from './NutritionFormTitle';
import TargetMacros from './TargetMacros';

interface NutritionFormProps {
  nutritionData: NutritionTarget | undefined;
  loading: boolean;
}

const NutritionForm: React.FC<NutritionFormProps> = ({
  nutritionData,
  loading,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NutritionFormSchema>({
    resolver: zodResolver(nutritionSchema),
    defaultValues: nutritionData || {
      calories: 0,
      proteinTarget: { from: 0, to: 0 },
      carbTarget: { from: 0, to: 0 },
      fatTarget: { from: 0, to: 0 },
      minimumFiber: 0,
      maxiumSodium: 0,
      maxiumCholesterol: 0,
    },
  });

  useEffect(() => {
    if (nutritionData) {
      reset(nutritionData);
    }
  }, [nutritionData, reset]);

  const { showToastError, showToastSuccess } = useToast();

  const [updateNutrition, { isLoading }] = useUpdateNutritionRequestMutation();

  const isBusy = loading || isLoading;

  const onSubmit = async (data: NutritionFormSchema) => {
    try {
      const response = await updateNutrition(data).unwrap();
      if (response.code === HTTP_STATUS.OK) {
        showToastSuccess(SUCCESS_MESSAGES.UPDATE_NUTRITION_SUCCESS);
        return;
      }
      showToastError(ERROR_MESSAGES.UPDATE_NUTRITION_FAILED);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToastError(ERROR_MESSAGES.UPDATE_NUTRITION_FAILED);
    }
  };

  return (
    <form
      className='flex w-full flex-col gap-6'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        <div className='flex flex-col gap-6 lg:col-span-7'>
          <section className='rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_14px_36px_-30px_rgba(16,24,40,0.28)] saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/85 sm:p-6'>
            <div className='flex flex-col gap-1'>
              <div className='text-sm font-semibold text-gray-900'>
                Calories
              </div>
              <div className='text-xs text-gray-500'>
                Your daily energy target (kcal).
              </div>
            </div>
            <div className='mt-4'>
              <NutritionTitle control={control} errors={errors} />
            </div>
          </section>

          <section className='rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_14px_36px_-30px_rgba(16,24,40,0.28)] saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/85 sm:p-6'>
            <div className='flex flex-col gap-1'>
              <div className='text-sm font-semibold text-gray-900'>
                Macro ranges
              </div>
              <div className='text-xs text-gray-500'>
                Pick a flexible range for carbs, fats, and protein.
              </div>
            </div>
            <div className='mt-5'>
              <TargetMacros control={control} errors={errors} />
            </div>
          </section>
        </div>

        <div className='lg:col-span-5'>
          <section className='rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_14px_36px_-30px_rgba(16,24,40,0.28)] saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/85 sm:p-6'>
            <div className='flex flex-col gap-1'>
              <div className='text-sm font-semibold text-gray-900'>
                Micronutrients
              </div>
              <div className='text-xs text-gray-500'>
                Optional limits for fiber, sodium, and cholesterol.
              </div>
            </div>
            <div className='mt-4'>
              <Micronutrients control={control} errors={errors} />
            </div>
          </section>
        </div>
      </div>

      <div className='flex items-center justify-end'>
        <Button
          htmlType='submit'
          type='primary'
          loading={isBusy}
          disabled={isBusy}
          className='!bg-primary hover:!bg-primary-400 h-11 rounded-2xl !border-none px-6 !text-black shadow-[0_14px_34px_-26px_rgba(16,24,40,0.45)] disabled:!bg-gray-300 disabled:!text-gray-600'
        >
          Update targets
        </Button>
      </div>
    </form>
  );
};
export default NutritionForm;
