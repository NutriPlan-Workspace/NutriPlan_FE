import { FC } from 'react';

import { NUTRITION_HEX_COLOR } from '@/constants/nutritionFormat';
import { useScale } from '@/contexts/ScaleContext';
import { useScaleIngre } from '@/contexts/ScaleIngreContext';
import { cn } from '@/helpers/helpers';
import { calculateNutrition } from '@/utils/calculateNutrition';

interface NutritionRowProp {
  detailedNutrition: {
    key?: string;
    title: string;
    amount: number;
    target?: string;
    unit: string;
  }[];
  type: string;
  hideTarget?: boolean;
}

const NutritionRow: FC<NutritionRowProp> = ({
  detailedNutrition,
  type,
  hideTarget = false,
}) => {
  const amountMealDay = 1;
  const conversionFactorMealDay = 1;
  const { amount, conversionFactor } = useScale();
  const { amountIngre, conversionFactorIngre } = useScaleIngre();

  const formatValue = (value: unknown) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
    return value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  const getCalculated = (raw: unknown) => {
    if (typeof raw !== 'number' || !Number.isFinite(raw)) return null;

    const computed =
      type === 'food'
        ? calculateNutrition(raw, amount, conversionFactor)
        : type === 'day'
          ? calculateNutrition(raw, amountMealDay, conversionFactorMealDay)
          : calculateNutrition(raw, amountIngre, conversionFactorIngre);

    return Number.isFinite(computed) ? computed : null;
  };

  const getDotColor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('carb') && !t.includes('net'))
      return NUTRITION_HEX_COLOR.CARBS;
    if (t.includes('fat') && !t.includes('alpha'))
      return NUTRITION_HEX_COLOR.FATS; // Avoid alpha carotene matching fat? No, title is specific.
    if (t.includes('protein')) return NUTRITION_HEX_COLOR.PROTEINS;
    if (t.includes('fiber')) return NUTRITION_HEX_COLOR.FIBER;
    if (t.includes('sodium')) return NUTRITION_HEX_COLOR.SODIUM;
    if (t.includes('cholesterol')) return NUTRITION_HEX_COLOR.CHOLESTEROL;
    if (t.includes('calor')) return NUTRITION_HEX_COLOR.CALORIES;
    return undefined;
  };

  return (
    <div className='divide-y divide-black/5'>
      {detailedNutrition.map((item) => {
        const computed = getCalculated(item.amount);
        const dotColor = getDotColor(item.title);
        const isCalories = item.key === 'calories' || item.title === 'Calories';

        return (
          <div
            key={item.key ?? item.title}
            className={cn('grid items-center gap-3 px-4 py-3 sm:px-5', {
              'grid-cols-12': !hideTarget,
              'grid-cols-2': hideTarget,
              'bg-slate-50/50': isCalories,
            })}
          >
            <div
              className={cn(
                'flex items-center gap-2 text-sm font-medium text-gray-800',
                {
                  'col-span-6': !hideTarget,
                  'col-span-1': hideTarget,
                  'text-base font-bold': isCalories,
                },
              )}
            >
              {dotColor && (
                <span
                  className='h-2.5 w-2.5 rounded-full'
                  style={{ backgroundColor: dotColor }}
                />
              )}
              <span className='truncate'>{item.title}</span>
            </div>

            <div
              className={cn(
                'text-right text-sm font-semibold text-gray-900 tabular-nums',
                {
                  'col-span-3': !hideTarget,
                  'col-span-1': hideTarget,
                  'text-base font-bold text-gray-900': isCalories,
                },
              )}
            >
              {computed === null ? (
                <span className='text-gray-400'>
                  {formatValue(item.amount)}
                </span>
              ) : (
                <>
                  {formatValue(computed)}
                  {item.unit ? (
                    <span
                      className={cn(
                        'ml-1 text-xs font-semibold text-gray-500',
                        {
                          'font-bold text-gray-600': isCalories,
                        },
                      )}
                    >
                      {item.unit}
                    </span>
                  ) : null}
                </>
              )}
            </div>

            {!hideTarget && (
              <div
                className={cn(
                  'col-span-3 text-right text-sm font-semibold text-gray-500',
                  {
                    'font-bold text-gray-800': isCalories,
                  },
                )}
              >
                {item.target ? item.target : '—'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NutritionRow;
