import React, { useState } from 'react';
import {
  HiOutlineDocumentAdd,
  HiOutlineDocumentDuplicate,
} from 'react-icons/hi';
import { HiOutlineArrowPath } from 'react-icons/hi2';

import { Button } from '@/atoms/Button';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/helpers/helpers';
import { MealBoxSkeleton } from '@/molecules/MealBoxSkeleton';
import { useAutoGenerateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import { getDayOfWeek } from '@/utils/dateUtils';

interface EmptyMealDayProps {
  mealDate: string;
  onCreateBlank: (mealDate: string) => Promise<void>;
  onCopyPreviousDay: (mealDate: string) => Promise<void>;
  isWeekly?: boolean;
}

const EmptyMealDay: React.FC<EmptyMealDayProps> = ({
  mealDate,
  onCreateBlank,
  onCopyPreviousDay,
  isWeekly = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [autoGenerateMealPlan] = useAutoGenerateMealPlanMutation();
  const { showToastError } = useToast();

  const handleAction = async (action: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToastError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    await handleAction(async () => {
      // Format date to ISO string to match datetime format
      const formattedDate = new Date(mealDate).toISOString();
      await autoGenerateMealPlan({
        date: formattedDate,
      }).unwrap();
    });
  };

  if (isLoading) {
    return (
      <div className='w-full rounded-sm bg-white px-4 py-4 shadow-md'>
        <div
          className={cn('flex', {
            'flex-col gap-1': !isWeekly,
            'flex-row justify-between gap-4': isWeekly,
          })}
        >
          {[0, 1, 2].map((index) => (
            <div key={index} className='h-50'>
              <MealBoxSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'mt-1 w-full rounded-sm bg-white px-4 pt-[25px] pb-[30px] shadow-[0_2px_2px_0_rgba(0,0,0,0.05),_0_0_2px_0_rgba(35,31,32,0.1)] transition-all duration-200 hover:shadow-[0px_12px_12px_rgba(0,0,0,0.05),_0px_0px_12px_rgba(35,31,32,0.1)]',
        { 'pb-[20px]': isWeekly },
      )}
    >
      {isWeekly ? (
        <p className='text-center'>
          This meal plan is empty. Want to build it right now?
        </p>
      ) : (
        <>
          <p className='text-center'>This meal plan is empty.</p>
          <p className='text-center'>Want to build it right now?</p>
        </>
      )}
      <div className={cn('mt-6 flex justify-center', { 'mt-2': isWeekly })}>
        <Button
          size='large'
          variant='solid'
          color='primary'
          className='bg-primary hover:bg-primary-400 active:bg-primary-500 transition-bg text-black duration-300'
          icon={<HiOutlineArrowPath size={20} />}
          onClick={handleGenerate}
        >
          Generate
        </Button>
      </div>
      <p className='pt-2 text-center text-sm'>
        using
        <span className='text-primary-400 pl-1'>
          {getDayOfWeek(new Date(mealDate))}&apos;s preferences
        </span>
      </p>
      <p className={cn('my-5 text-center font-bold', { 'my-2': isWeekly })}>
        - or -
      </p>
      {isWeekly ? (
        <p className='text-center'>
          You can create a new one or copy it from your most recently created
          meal plan.
        </p>
      ) : (
        <>
          <p className='text-center'>You can create a new one</p>
          <p className='text-center'>
            or copy it from your most recently created meal plan.
          </p>
        </>
      )}
      <div
        className={cn(
          isWeekly
            ? 'mt-4 flex justify-center gap-2'
            : 'mt-4 grid grid-rows-1 justify-center gap-2',
        )}
      >
        <Button
          variant='filled'
          color='primary'
          icon={<HiOutlineDocumentAdd size={18} />}
          className={cn('border-borderGray w-fit text-black', {
            'mx-auto': !isWeekly,
          })}
          onClick={() => handleAction(() => onCreateBlank(mealDate))}
        >
          New blank plan
        </Button>
        <Button
          variant='filled'
          color='primary'
          icon={<HiOutlineDocumentDuplicate size={18} />}
          className={cn('border-borderGray w-fit text-black', {
            'mx-auto': !isWeekly,
          })}
          onClick={() => handleAction(() => onCopyPreviousDay(mealDate))}
        >
          Copy the latest meal plan
        </Button>
      </div>
    </div>
  );
};

export default EmptyMealDay;
