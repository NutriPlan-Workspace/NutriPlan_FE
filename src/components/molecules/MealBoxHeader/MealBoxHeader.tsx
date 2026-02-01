import React from 'react';
import { HiOutlineArchiveBoxXMark, HiOutlineArrowPath } from 'react-icons/hi2';
import { IoWarning } from 'react-icons/io5';
import { Button, Popover, Tooltip, Typography } from 'antd';

import { cn } from '@/helpers/helpers';
import type { NutritionFields } from '@/types/food';
import type { MealPlanFood } from '@/types/mealPlan';

import { NutritionPopoverMeal } from '../NutritionPopoverMeal';

interface MealBoxHeaderProps {
  mealType: string;
  calories: number;
  nutritionData: NutritionFields;
  mealItems: MealPlanFood[];
  isHovered: boolean;
  onClearMealItems: () => void;
  onGenerateOptions: () => void;
  isGenerating?: boolean;
  canGenerate?: boolean;
  onOpenSetup?: () => void;
  dailyTarget?: number;
}

const MealBoxHeader: React.FC<MealBoxHeaderProps> = ({
  mealType,
  calories,
  nutritionData,
  mealItems,
  isHovered,
  onClearMealItems,
  onGenerateOptions,
  isGenerating = false,
  canGenerate = true,
  onOpenSetup,
  dailyTarget,
}) => (
  <div
    data-tour='planner-mealbox-header'
    className='flex items-center justify-between'
  >
    <div>
      <Typography className='text-[18px] font-bold capitalize'>
        {mealType}
      </Typography>
      <div className='flex items-center gap-2'>
        {!mealItems.length ? (
          <Typography className='text-[13px] text-gray-500'>
            EMPTY MEAL
          </Typography>
        ) : (
          <Popover
            className='cursor-help'
            placement='left'
            color='white'
            styles={{
              body: {
                padding: 0,
                borderRadius: '10px',
                overflow: 'hidden',
              },
            }}
            content={
              <NutritionPopoverMeal
                nutritionData={nutritionData}
                mealType={mealType}
              />
            }
          >
            <Typography className='text-gray-500'>
              {calories} Calories
            </Typography>
          </Popover>
        )}
        {dailyTarget && calories > dailyTarget * 0.5 && (
          <Tooltip title='This meal is using a large portion of your daily budget'>
            <div className='flex items-center justify-center text-yellow-500'>
              <IoWarning className='text-[20px]' />
            </div>
          </Tooltip>
        )}
      </div>
    </div>
    <div
      className={cn(
        'ml-auto flex items-center justify-center transition-all duration-200',
        {
          'opacity-0': !isHovered,
        },
      )}
    >
      {!canGenerate && onOpenSetup && (
        <button
          type='button'
          data-tour='planner-setup-link'
          onClick={onOpenSetup}
          className='mr-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-100'
        >
          Complete setup
        </button>
      )}
      <Button
        data-tour='planner-generate-meal'
        onClick={(e) => {
          e.preventDefault();
          onGenerateOptions();
        }}
        type='text'
        shape='circle'
        icon={<HiOutlineArrowPath className='text-xl' />}
        loading={isGenerating}
        disabled={!canGenerate}
      />
      <Button
        data-tour='planner-clear-meal'
        onClick={() => {
          onClearMealItems();
        }}
        type='text'
        shape='circle'
        icon={<HiOutlineArchiveBoxXMark className='text-xl' />}
      />
    </div>
  </div>
);
export default MealBoxHeader;
