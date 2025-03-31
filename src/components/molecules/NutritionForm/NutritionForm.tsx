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

const NutritionForm: React.FC<NutritionFormProps> = ({ nutritionData }) => {
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
      className='flex max-w-[690px] flex-col gap-4'
      onSubmit={handleSubmit(onSubmit)}
    >
      <NutritionTitle control={control} errors={errors} />
      <TargetMacros control={control} errors={errors} />
      <Micronutrients control={control} errors={errors} />

      <div className='flex items-center justify-center'>
        <Button
          htmlType='submit'
          className='bg-primary hover:bg-primary-400 h-[42px] w-[100px] border-none px-[24px] py-[9px] text-[16px] font-bold text-black disabled:bg-gray-500 disabled:text-white disabled:opacity-50'
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </form>
  );
};
export default NutritionForm;
