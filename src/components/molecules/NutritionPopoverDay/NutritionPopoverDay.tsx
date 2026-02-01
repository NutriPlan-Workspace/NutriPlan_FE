import React, { useState } from 'react';
import { HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi';
import { IoWarning } from 'react-icons/io5';
import { useNavigate } from '@tanstack/react-router';
import { Button, Tooltip } from 'antd';

import {
  NUTRITION_HEX_COLOR,
  nutritionFormat,
  targetKeyMap,
} from '@/constants/nutritionFormat';
import { PATH } from '@/constants/path';
import { cn } from '@/helpers/helpers';
import { PieChart } from '@/molecules/PieChart';
import ModalNutritionDetail from '@/organisms/ModalNutritionDetail/ModalNutritionDetail';
import type { NutritionFields } from '@/types/food';
import type { NutritionGoal } from '@/types/user';
import { getInvalidNutritionKeys } from '@/utils/calculateNutrition';
import { roundNumber } from '@/utils/roundNumber';

interface NutritionPopoverDayProps {
  title: string;
  nutritionData: NutritionFields | undefined;
  targetNutrition?: NutritionGoal;
  onClick?: () => void;
  isSingleDay?: boolean;
  targetPercentage?: number;
}

const NutritionPopoverDay: React.FC<NutritionPopoverDayProps> = ({
  title,
  nutritionData,
  targetNutrition,
  onClick,
  isSingleDay = false,
  targetPercentage,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const invalidKeys = getInvalidNutritionKeys(nutritionData, targetNutrition);

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5',
        {
          'w-[400px]': !isSingleDay,
          'w-full shadow-none ring-0': isSingleDay, // Adopt parent width if single day (embedded)
        },
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-slate-50 px-5 py-3',
          {
            'justify-center border-none bg-transparent px-0 py-0': isSingleDay,
          },
        )}
      >
        <div className={cn('flex flex-col', { 'items-center': isSingleDay })}>
          <h3 className='text-md m-0 font-bold text-emerald-950'>{title}</h3>
          {targetPercentage && targetPercentage !== 100 && !isSingleDay && (
            <Tooltip title='Percentage of your daily nutrition goals allocated to this meal/day.'>
              <span className='w-fit cursor-help rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800'>
                Goal: {targetPercentage}% of Day
              </span>
            </Tooltip>
          )}
        </div>
        {!isSingleDay && (
          <div className='flex items-center gap-2'>
            <Tooltip title='Adjust Targets'>
              <Button
                size='small'
                icon={<HiOutlineAdjustments />}
                type='text'
                shape='circle'
                className='text-emerald-700 hover:bg-emerald-100'
                onClick={() => navigate({ to: PATH.NUTRITION_TARGETS })}
              />
            </Tooltip>
            {onClick && (
              <HiOutlineX
                className='cursor-pointer text-xl text-slate-400 hover:text-slate-600'
                onClick={onClick}
              />
            )}
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className='flex justify-center bg-white py-4'>
        {nutritionData && (
          <PieChart
            nutritionData={nutritionData}
            size={isSingleDay ? 200 : 140}
            label={true}
          />
        )}
      </div>

      {/* Warning Banner */}
      {invalidKeys.length > 0 && (
        <div className='mx-4 mb-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-sm text-amber-800'>
          <IoWarning className='text-lg text-amber-500' />
          <span className='font-medium'>
            Adjustment needed for {invalidKeys.join(', ')}
          </span>
        </div>
      )}

      {/* Table Header */}
      <div className='grid grid-cols-[1fr_80px_80px] bg-slate-50 px-5 py-2 text-xs font-semibold tracking-wider text-slate-500 uppercase'>
        <div>Nutrient</div>
        <div className='text-right'>Total</div>
        <div className='text-right'>Target</div>
      </div>

      {/* List */}
      <div className='flex flex-col px-1'>
        {nutritionFormat.map((item) => {
          const isInvalid = invalidKeys.includes(item.key);
          const keyMap = targetKeyMap[item.key];
          const targetVal = targetNutrition?.[keyMap];

          let targetText = '-';
          if (item.key === 'calories' && typeof targetVal === 'number') {
            targetText = `${roundNumber(targetVal, 0)}`; // Calories usually int
          } else if (
            targetVal &&
            typeof targetVal === 'object' &&
            'from' in targetVal &&
            'to' in targetVal
          ) {
            targetText = `${roundNumber(targetVal.from, 1)} - ${roundNumber(targetVal.to, 1)}`;
          } else if (typeof targetVal === 'number') {
            if (item.key === 'fiber') {
              targetText = `> ${roundNumber(targetVal, 1)}`;
            } else if (
              ['sodium', 'cholesterol'].includes(item.key) &&
              targetVal > 0
            ) {
              targetText = `< ${roundNumber(targetVal, 1)}`;
            }
          }

          // Colors
          let dotColor = '#cbd5e1'; // slate-300
          if (item.key === 'carbs') dotColor = NUTRITION_HEX_COLOR.CARBS;
          if (item.key === 'fats') dotColor = NUTRITION_HEX_COLOR.FATS;
          if (item.key === 'proteins') dotColor = NUTRITION_HEX_COLOR.PROTEINS;
          if (item.key === 'calories') dotColor = NUTRITION_HEX_COLOR.CALORIES;
          if (item.key === 'fiber') dotColor = NUTRITION_HEX_COLOR.FIBER;
          if (item.key === 'sodium') dotColor = NUTRITION_HEX_COLOR.SODIUM;
          if (item.key === 'cholesterol')
            dotColor = NUTRITION_HEX_COLOR.CHOLESTEROL; // Highlight background

          const isCalories = item.key === 'calories';

          return (
            <div
              key={item.key}
              className={cn(
                'grid grid-cols-[1fr_80px_80px] items-center border-b border-slate-100 px-4 py-2.5 text-sm transition-colors last:border-0 hover:bg-slate-50',
                {
                  'bg-amber-50/40': isInvalid,
                  'bg-slate-50/50 py-3': isCalories, // Highlight background
                },
              )}
            >
              <div className='flex items-center gap-2.5'>
                <span
                  className='h-2.5 w-2.5 rounded-full'
                  style={{ backgroundColor: dotColor }}
                />
                <span
                  className={cn('font-medium', {
                    'text-amber-800': isInvalid,
                    'text-slate-700': !isInvalid,
                    'text-base font-bold text-gray-800': isCalories, // Highlight Text
                  })}
                >
                  {item.label}
                </span>
                {isInvalid && (
                  <IoWarning className='text-amber-500' title='Target missed' />
                )}
              </div>

              {/* Value */}
              <div
                className={cn('text-right font-semibold text-slate-800', {
                  'text-amber-700': isInvalid,
                  'text-base font-bold text-gray-900': isCalories, // Highlight Value
                })}
              >
                {nutritionData &&
                  roundNumber(
                    nutritionData[item.key as keyof NutritionFields],
                    1,
                  )}
                <span
                  className={cn('ml-0.5 text-xs font-normal text-slate-400', {
                    'font-semibold text-gray-500': isCalories,
                  })}
                >
                  {item.unit}
                </span>
              </div>

              {/* Target */}
              <div className='text-right text-xs font-medium text-slate-500'>
                {targetText !== '-' ? (
                  <span>
                    {targetText}
                    <span className='ml-0.5 text-[10px] text-slate-400'>
                      {item.unit}
                    </span>
                  </span>
                ) : (
                  <span className='text-slate-300'>-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className='border-t border-slate-100 bg-slate-50 p-4'>
        <Button
          block
          type='default'
          className='border-slate-200 font-medium text-slate-600 shadow-sm hover:border-emerald-500 hover:text-emerald-600'
          onClick={() => setIsModalOpen(true)}
        >
          View Detailed Analysis
        </Button>
      </div>

      <ModalNutritionDetail
        nutrition={nutritionData}
        targetNutrition={targetNutrition}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type='day'
      />
    </div>
  );
};

export default NutritionPopoverDay;
