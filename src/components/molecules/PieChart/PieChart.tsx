import React from 'react';
import { Cell, Pie, PieChart as AntdPieChart } from 'recharts';

import { RenderCustomizedLabel } from '@/atoms/RenderCustomizedLabel';
import { NUTRITION_HEX_COLOR } from '@/constants/nutritionFormat';
import { NutritionSummaryFields } from '@/types/mealPlan';

interface PieChartProps {
  className?: string;
  nutritionData: NutritionSummaryFields;
  size?: number;
  label?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  className,
  nutritionData,
  size,
  label,
}) => {
  const chartData = [
    {
      name: 'C',
      value: nutritionData.carbs,
      color: NUTRITION_HEX_COLOR.CARBS,
    },
    {
      name: 'F',
      value: nutritionData.fats,
      color: NUTRITION_HEX_COLOR.FATS,
    },
    {
      name: 'P',
      value: nutritionData.proteins,
      color: NUTRITION_HEX_COLOR.PROTEINS,
    },
  ];

  return (
    <AntdPieChart width={size || 20} height={size || 20} className={className}>
      <Pie
        data={chartData}
        cx='50%'
        cy='50%'
        labelLine={false}
        label={label ? (props) => <RenderCustomizedLabel {...props} /> : false}
        outerRadius={(size || 20) / 2 - 2}
        dataKey='value'
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </AntdPieChart>
  );
};

export default PieChart;
