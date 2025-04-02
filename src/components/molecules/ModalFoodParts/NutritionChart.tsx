import { FC } from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { NUTRITION_HEX_COLOR } from '@/constants/nutritionFormat';
import { useScale } from '@/contexts/ScaleContext';
import { NutritionFields } from '@/types/food';

import CustomizedLabelChart from './CustomizedLabelChart';

interface NutritionChartProps {
  nutrition: NutritionFields;
}

const NutritionChart: FC<NutritionChartProps> = ({ nutrition }) => {
  const { amount, conversionFactor } = useScale();

  const data = [
    {
      name: 'Carbs',
      value: Number(((nutrition.carbs * amount) / conversionFactor).toFixed(3)),
      color: NUTRITION_HEX_COLOR.CARBS,
    },
    {
      name: 'Fats',
      value: Number(((nutrition.fats * amount) / conversionFactor).toFixed(3)),
      color: NUTRITION_HEX_COLOR.FATS,
    },
    {
      name: 'Proteins',
      value: Number(
        ((nutrition.proteins * amount) / conversionFactor).toFixed(3),
      ),
      color: NUTRITION_HEX_COLOR.PROTEINS,
    },
  ];

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
