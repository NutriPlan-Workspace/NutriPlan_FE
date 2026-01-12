import { FC } from 'react';

import { useScale } from '@/contexts/ScaleContext';
import { useScaleIngre } from '@/contexts/ScaleIngreContext';
import { cn } from '@/helpers/helpers';
import { calculateNutrition } from '@/utils/calculateNutrition';

interface NutritionRowProp {
  detailedNutrition: {
    key?: string;
    title: string;
    amount: number;
    unit: string;
  }[];
  type: string;
}

const NutritionRow: FC<NutritionRowProp> = ({ detailedNutrition, type }) => {
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

  const dotClassByTitle: Record<string, string> = {
    Carbs: 'bg-yellow-500',
    Fats: 'bg-blue-500',
    Protein: 'bg-purple-500',
    Proteins: 'bg-purple-500',
  };

  return (
    <div className='divide-y divide-black/5'>
      {detailedNutrition.map((item) => {
        const computed = getCalculated(item.amount);

        return (
          <div
            key={item.key ?? item.title}
            className='grid grid-cols-12 items-center gap-3 px-4 py-3 sm:px-5'
          >
            <div className='col-span-6 flex items-center gap-2 text-sm font-medium text-gray-800'>
              {dotClassByTitle[item.title] && (
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    dotClassByTitle[item.title],
                  )}
                />
              )}
              <span className='truncate'>{item.title}</span>
            </div>

            <div className='col-span-3 text-right text-sm font-semibold text-gray-900 tabular-nums'>
              {computed === null ? (
                <span className='text-gray-400'>
                  {formatValue(item.amount)}
                </span>
              ) : (
                <>
                  {formatValue(computed)}
                  {item.unit ? (
                    <span className='ml-1 text-xs font-semibold text-gray-500'>
                      {item.unit}
                    </span>
                  ) : null}
                </>
              )}
            </div>

            <div className='col-span-3 text-right text-sm font-semibold text-gray-400'>
              —
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NutritionRow;
