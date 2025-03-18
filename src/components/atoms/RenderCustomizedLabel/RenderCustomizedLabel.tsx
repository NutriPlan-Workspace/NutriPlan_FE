import React from 'react';

const RADIAN = Math.PI / 180;
const LABEL_POSITION_RATIO = 0.6;

interface RenderCustomizedLabelProp {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}

const RenderCustomizedLabel: React.FC<RenderCustomizedLabelProp> = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  if (percent === 0) return null;
  const radius =
    innerRadius + (outerRadius - innerRadius) * LABEL_POSITION_RATIO;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor='middle'
      dominantBaseline='central'
      fontSize={14}
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

export default RenderCustomizedLabel;
