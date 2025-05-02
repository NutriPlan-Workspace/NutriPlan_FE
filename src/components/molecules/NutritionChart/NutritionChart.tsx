import { FC } from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { nutritionChart } from '@/constants/nutritionFormat';
import { useScale } from '@/contexts/ScaleContext';
import { useScaleIngre } from '@/contexts/ScaleIngreContext';
import type { NutritionFields } from '@/types/food';
import { roundNumber } from '@/utils/roundNumber';

import { CustomizedLabelChart } from '../CustomizedLabelChart';

interface NutritionChartProps {
  nutrition: NutritionFields;
  type: string;
  isDetailCollection?: boolean;
}

const NutritionChart: FC<NutritionChartProps> = ({
  nutrition,
  type,
  isDetailCollection = false,
}) => {
  const { amount, conversionFactor } = useScale();
  const { amountIngre, conversionFactorIngre } = useScaleIngre();
  const data = nutritionChart.map(({ key, label, color }) => {
    const value =
      type === 'food'
        ? roundNumber((nutrition[key] * amount) / conversionFactor, 3)
        : roundNumber(
            (nutrition[key] * amountIngre) / conversionFactorIngre,
            3,
          );

    return {
      name: label,
      value,
      color,
    };
  });

  const chartSize = isDetailCollection ? 220 : 240;
  const outerRadius = isDetailCollection ? 90 : 100;

  return (
    <PieChart width={chartSize} height={chartSize}>
      <Pie
        data={data}
        labelLine={false}
        label={CustomizedLabelChart}
        outerRadius={outerRadius}
        fill='#8884d8'
        dataKey='value'
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default NutritionChart;
