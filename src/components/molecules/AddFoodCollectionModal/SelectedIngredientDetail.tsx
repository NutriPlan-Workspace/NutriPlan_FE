import React, { useState } from 'react';
import { Button, Image, InputNumber, Select, Typography } from 'antd';

import { Food } from '@/types/food';
import { IngredientInput } from '@/types/ingredient';
import { getUnitAmountFromUnits } from '@/utils/foodUnits';

import { NutritionSummary } from '../NutritionSummary';

const { Title } = Typography;

interface SelectedIngredientDetailProps {
  selectedFood: Food;
  onAddFood: (input: IngredientInput) => void;
  onBack: () => void;
}

const SelectedIngredientDetail: React.FC<SelectedIngredientDetailProps> = ({
  selectedFood,
  onAddFood,
  onBack,
}) => {
  const [unitIndex, setUnitIndex] = useState(0);
  const [amount, setAmount] = useState<number>(
    getUnitAmountFromUnits(selectedFood.units, 0, 1),
  );

  const handleAdd = () => {
    onAddFood({
      ingredientFoodId: selectedFood._id,
      amount,
      unit: unitIndex,
    });
  };

  const handleUnitChange = (index: number) => {
    setUnitIndex(index);
    setAmount(getUnitAmountFromUnits(selectedFood.units, index, 1));
  };

  return (
    <div className='flex flex-col gap-2'>
      <Title level={3} className='m-0 font-thin'>
        {selectedFood.name}
      </Title>
      <Image
        width='300'
        src={selectedFood.imgUrls[0]}
        alt='Image food'
        className='rounded-md object-cover'
      />

      <div className='flex items-center gap-2'>
        <InputNumber
          min={1}
          value={amount}
          onChange={(value) => setAmount(value || 1)}
        />
        <Select
          value={unitIndex}
          onChange={handleUnitChange}
          style={{ width: 160 }}
          options={selectedFood.units.map((u, idx) => ({
            label: u.description,
            value: idx,
          }))}
        />
      </div>
      <div className='flex items-center gap-4'>
        <Button
          onClick={handleAdd}
          className='bg-primary hover:border-primary w-[120px] hover:text-black'
        >
          Add Ingredient
        </Button>
        <Button
          onClick={onBack}
          className='w-[120px] bg-gray-300 px-2 hover:border-gray-400 hover:text-black'
        >
          Back
        </Button>
      </div>

      <NutritionSummary
        nutrition={selectedFood.nutrition}
        type='ingredient'
        isDetailCollection={true}
      />
    </div>
  );
};

export default SelectedIngredientDetail;
