import React, { useState } from 'react';
import {
  HiOutlineDocumentAdd,
  HiOutlineDocumentDuplicate,
} from 'react-icons/hi';
import { HiOutlineArrowPath } from 'react-icons/hi2';

import { Button } from '@/atoms/Button';
import { TargetPercentageSelect } from '@/atoms/TargetPercentageSelect';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/helpers/helpers';
import { useMealPlanSetupStatus } from '@/hooks/useMealPlanSetupStatus';
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
  const [targetPercentage, setTargetPercentage] = useState(100);
  const [autoGenerateMealPlan] = useAutoGenerateMealPlanMutation();
  const { showToastError } = useToast();
  const { canGenerate, nextSetupPath } = useMealPlanSetupStatus();

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
    if (!canGenerate) {
      showToastError(
        'Please complete Body & Goal and Nutrition Target before generating meals.',
      );
      return;
    }

    await handleAction(async () => {
      // Format date to ISO string to match datetime format
      const formattedDate = new Date(mealDate).toISOString();
      await autoGenerateMealPlan({
        date: formattedDate,
        targetPercentage,
      }).unwrap();
    });
  };

  if (isLoading) {
    return (
      <div className='space-y-2 pt-2'>
        <div className='w-full rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.35),_0_2px_4px_rgba(15,23,42,0.06)]'>
          <MealBoxSkeleton />
        </div>
        <div className='w-full rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.35),_0_2px_4px_rgba(15,23,42,0.06)]'>
          <MealBoxSkeleton />
        </div>
        <div className='w-full rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.35),_0_2px_4px_rgba(15,23,42,0.06)]'>
          <MealBoxSkeleton />
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
      <div
        className={cn('mt-6 flex items-center justify-center gap-2', {
          'mt-2': isWeekly,
        })}
      >
        {!canGenerate && (
          <a
            data-tour='planner-setup-link'
            href={nextSetupPath}
            className='mr-3 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100'
          >
            Complete setup to enable generate
          </a>
        )}
        <TargetPercentageSelect
          value={targetPercentage}
          onChange={setTargetPercentage}
          disabled={!canGenerate}
          size='middle'
        />
        <Button
          data-tour='planner-generate-day'
          size='large'
          variant='solid'
          color='primary'
          className='bg-primary hover:bg-primary-400 active:bg-primary-500 transition-bg text-black duration-300'
          icon={<HiOutlineArrowPath size={20} />}
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          Generate
        </Button>
      </div>
      <p className='pt-2 text-center text-sm'>
        using
        <span className='text-primary-400 pl-1'>
          {getDayOfWeek(new Date(mealDate))}&apos;s preferences
        </span>
        {targetPercentage !== 100 && (
          <span className='text-primary-400 pl-1'>
            at {targetPercentage}% target
          </span>
        )}
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
