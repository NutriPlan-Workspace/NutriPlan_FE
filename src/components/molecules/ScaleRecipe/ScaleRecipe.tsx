import React from 'react';
import { InputNumber, InputNumberProps, Select } from 'antd';

import { useScale } from '@/contexts/ScaleContext';
import { roundNumber } from '@/utils/roundNumber';

interface unitScaleProp {
  units: {
    amount: number;
    description: string;
  }[];
}

const ScaleRecipe: React.FC<unitScaleProp> = ({ units }) => {
  const { amount, unit, setAmount, setUnit, setConversionFactor } = useScale();

  const onChangeAmount: InputNumberProps['onChange'] = (value) => {
    setAmount(value as number);
  };

  const changeUnit = (value: string) => {
    const targetUnit = units.find((u) => u.description === value);
    const currentUnit = units.find((u) => u.description === unit);

    if (!targetUnit || !currentUnit) return;

    setAmount(
      roundNumber((targetUnit.amount * amount) / currentUnit.amount, 3),
    );
    setConversionFactor(targetUnit.amount);
  };

  const handleChangeUnit = (value: string) => {
    if (unit === value) return;
    changeUnit(value);
    setUnit(value);
  };

  return (
    <div>
      <h3 className='mt-6 pb-3 text-xl font-semibold'>Scale recipe</h3>
      <InputNumber
        min={1}
        value={amount}
        style={{ width: '80px', marginRight: '10px', textAlign: 'right' }}
        onChange={onChangeAmount}
      />
      <Select
        value={unit}
        style={{ width: '100px' }}
        options={units.map((u) => ({
          value: u.description,
          label: u.description,
        }))}
        onChange={handleChangeUnit}
      />
    </div>
  );
};

export default ScaleRecipe;
