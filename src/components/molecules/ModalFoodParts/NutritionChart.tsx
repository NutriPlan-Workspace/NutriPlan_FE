import { FC } from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { nutritionChart } from '@/constants/nutritionFormat';
import { useScale } from '@/contexts/ScaleContext';
import { useScaleIngre } from '@/contexts/ScaleIngreContext';
import { NutritionFields } from '@/types/food';
import { roundNumber } from '@/utils/roundNumber';

import CustomizedLabelChart from './CustomizedLabelChart';

interface NutritionChartProps {
  nutrition: NutritionFields;
  type: string;
}

const NutritionChart: FC<NutritionChartProps> = ({ nutrition, type }) => {
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

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        cx='50%'
        cy='50%'
        labelLine={false}
        label={CustomizedLabelChart}
        outerRadius={90}
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
