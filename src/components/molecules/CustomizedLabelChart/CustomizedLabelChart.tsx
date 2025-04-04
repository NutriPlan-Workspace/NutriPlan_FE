export type renderCustomerLabelProp = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index?: number;
};

const RADIAN = Math.PI / 180;

const CustomizedLabelChart = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: renderCustomerLabelProp) => {
  const radius = innerRadius + (outerRadius - innerRadius) / 1.5;

  if (midAngle < 15) return null;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);

  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x - 4}
      y={y}
      fill='white'
      textAnchor={x < cx ? 'start' : 'end'}
      dominantBaseline='central'
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default CustomizedLabelChart;
