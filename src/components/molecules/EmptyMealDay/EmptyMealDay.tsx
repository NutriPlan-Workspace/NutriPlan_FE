import React from 'react';
import {
  HiOutlineClipboardCopy,
  HiOutlineDocumentAdd,
  HiOutlineDocumentDuplicate,
} from 'react-icons/hi';
import { HiOutlineArrowPath } from 'react-icons/hi2';

import { Button } from '@/atoms/Button';
import { cn } from '@/helpers/helpers';
import { getDayOfWeek } from '@/utils/dateUtils';

interface EmptyMealDayProps {
  mealDate: string;
  onCreateBlank: (mealDate: string) => void;
  onCopyPreviousDay: (mealDate: string) => void;
  isWeekly?: boolean;
}

const EmptyMealDay: React.FC<EmptyMealDayProps> = ({
  mealDate,
  onCreateBlank,
  onCopyPreviousDay,
  isWeekly = false,
}) => (
  <div
    className={cn(
      'w-full rounded-sm bg-white px-4 pt-[15px] pb-[60px] shadow-[0_2px_2px_0_rgba(0,0,0,0.05),_0_0_2px_0_rgba(35,31,32,0.1)] transition-all duration-200 hover:shadow-[0px_12px_12px_rgba(0,0,0,0.05),_0px_0px_12px_rgba(35,31,32,0.1)]',
      { 'pb-[20px]': isWeekly },
    )}
  >
    <p className='mt-2 text-center'>
      This meal plan will be automatically generated and emailed to you the
      prior Friday
    </p>
    <p className='my-3 text-center font-bold'>- or -</p>
    <p className='text-center'>Want to build it right now?</p>
    <div className={cn('mt-8 flex justify-center', { 'mt-2': isWeekly })}>
      <Button
        size='large'
        variant='solid'
        color='gold'
        className='bg-primary hover:bg-primary-400 active:bg-primary-500 transition-bg text-black duration-300'
        icon={<HiOutlineArrowPath size={20} />}
      >
        Generate
      </Button>
    </div>
    <p className='text-center text-sm'>
      using
      <Button variant='link' color='gold' className='pl-1'>
        {getDayOfWeek(new Date(mealDate))}&apos;s preferences
      </Button>
    </p>
    <div className='mt-4 grid grid-rows-1 justify-center gap-2'>
      <Button
        variant='filled'
        color='gold'
        icon={<HiOutlineDocumentDuplicate size={18} />}
        className='border-borderGray mx-auto w-fit text-black'
        onClick={() => onCopyPreviousDay(mealDate)}
      >
        Copy the previous meal plan
      </Button>
      <Button
        variant='filled'
        color='gold'
        icon={<HiOutlineDocumentAdd size={18} />}
        className='border-borderGray mx-auto w-fit text-black'
        onClick={() => onCreateBlank(mealDate)}
      >
        New blank plan
      </Button>
      <Button
        variant='filled'
        color='gold'
        icon={<HiOutlineClipboardCopy size={18} />}
        className='border-borderGray mx-auto w-fit text-black'
      >
        Load a saved meal plan
      </Button>
    </div>
  </div>
);

export default EmptyMealDay;
