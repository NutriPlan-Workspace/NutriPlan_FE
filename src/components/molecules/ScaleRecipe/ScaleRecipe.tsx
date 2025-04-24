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
    const targetUnit = value === 'grams' ? units[0] : units[1];
    const currentUnit = value === 'grams' ? units[1] : units[0];
    setAmount(
      roundNumber((targetUnit.amount * amount) / currentUnit.amount, 3),
    );
    setConversionFactor(targetUnit.amount);
  };

  const handleChangeUnit = (value: string) => {
    if (unit === value) return null;
    changeUnit(value);
    setUnit(value);
  };

  return (
    <div>
      <h3 className='mt-6 pb-3 text-xl font-semibold'>Scale recipe</h3>
      <InputNumber
        min={1}
        defaultValue={units[0].amount}
        value={amount}
        style={{ width: '80px', marginRight: '10px', textAlign: 'right' }}
        onChange={onChangeAmount}
      />
      <Select
        defaultValue={units[0].description}
        style={{ width: '100px' }}
        options={[
          { value: units[0].description, label: units[0].description },
          { value: units[1].description, label: units[1].description },
        ]}
        value={unit}
        onChange={(value) => handleChangeUnit(value)}
      />
    </div>
  );
};

export default ScaleRecipe;
