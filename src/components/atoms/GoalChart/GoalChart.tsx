import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatDate } from '@/utils/dateUtils';

interface GoalChartProps {
  data: { date: string; weight: number }[] | undefined;
}

const GoalChart: React.FC<GoalChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const weights = data.map((d) => d.weight);
  const minValue = Math.min(...weights);
  const minYAxis = Math.floor(minValue - 0.5);

  return (
    <ResponsiveContainer width='100%' height={200}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray='3 3'
          stroke='#f5f5f5'
        />
        <XAxis
          tickLine={false}
          dataKey='date'
          axisLine={true}
          tickFormatter={(value) => formatDate(value)}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        />
        <YAxis
          axisLine={true}
          domain={[minYAxis, 'auto']}
          tickLine={false}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          width={30}
        />
        <Tooltip
          contentStyle={{ fontSize: '14px', borderRadius: '6px' }}
          labelFormatter={(value) => formatDate(value as string)}
        />
        <Line
          type='monotone'
          dataKey='weight'
          stroke='hsl(14, 84%, 63%)'
          strokeWidth={2}
          dot={{
            r: 3,
            fill: '#fff',
            strokeWidth: 2,
            stroke: 'hsl(14, 84%, 63%)',
          }}
          activeDot={{
            r: 5,
            fill: 'hsl(14, 84%, 63%)',
            stroke: '#fff',
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GoalChart;
