import React from 'react';
import { InputNumber, InputNumberProps, Select } from 'antd';

import { useScaleIngre } from '@/contexts/ScaleIngreContext';

interface unitScaleProp {
  units: {
    amount: number;
    description: string;
  }[];
}

const ScaleIngredient: React.FC<unitScaleProp> = ({ units }) => {
  const {
    amountIngre,
    unitIngre,
    setAmountIngre,
    setUnitIngre,
    setConversionFactorIngre,
  } = useScaleIngre();
  const onChangeAmount: InputNumberProps['onChange'] = (value) => {
    setAmountIngre(value as number);
  };
  const handleChangeUnit = (newUnit: string) => {
    if (unitIngre !== newUnit) {
      const currentUnitObj = units.find((u) => u.description === unitIngre);
      const newUnitObj = units.find((u) => u.description === newUnit);
      if (currentUnitObj && newUnitObj) {
        const newAmount =
          (newUnitObj.amount * amountIngre) / currentUnitObj.amount;

        setAmountIngre(Number(newAmount.toFixed(3)));
        setConversionFactorIngre(newUnitObj.amount);
        setUnitIngre(newUnit);
      }
    }
  };
  return (
    <div className='mt-5'>
      <h3 className='text-lg font-semibold'>Scale recipe</h3>
      <InputNumber
        min={1}
        defaultValue={units[0].amount}
        value={amountIngre}
        style={{ width: '80px', marginRight: '10px', textAlign: 'right' }}
        controls={false}
        onChange={onChangeAmount}
      />
      <Select
        defaultValue={units[0].description}
        style={{ width: '150px' }}
        options={units.map((item) => ({
          value: item.description,
          label: item.description,
        }))}
        value={unitIngre}
        onChange={handleChangeUnit}
      />
    </div>
  );
};

export default ScaleIngredient;
