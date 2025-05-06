import React, { useEffect } from 'react';
import { InputNumber, InputNumberProps, Select } from 'antd';

import { useScaleIngre } from '@/contexts/ScaleIngreContext';
import { roundNumber } from '@/utils/roundNumber';

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

  useEffect(() => {
    if (units.length > 0) {
      setAmountIngre(units[0].amount);
      setUnitIngre(units[0].description);
      setConversionFactorIngre(units[0].amount);
    }
  }, [units]);

  const onChangeAmount: InputNumberProps['onChange'] = (value) => {
    setAmountIngre(value as number);
  };

  const changeUnit = (value: string) => {
    const targetUnit = units.find((u) => u.description === value);
    const currentUnit = units.find((u) => u.description === unitIngre);

    if (!targetUnit || !currentUnit) return;

    setAmountIngre(
      roundNumber(
        (targetUnit.amount * (amountIngre || 0)) / currentUnit.amount,
        3,
      ),
    );
    setConversionFactorIngre(targetUnit.amount);
  };

  const handleChangeUnit = (value: string) => {
    if (unitIngre === value) return;
    changeUnit(value);
    setUnitIngre(value);
  };

  return (
    <div>
      <h3 className='pt-3 pb-3 text-xl font-semibold'>Scale recipe</h3>
      <InputNumber
        min={1}
        value={amountIngre}
        style={{ width: '80px', marginRight: '10px', textAlign: 'right' }}
        controls={false}
        onChange={onChangeAmount}
      />
      <Select
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
