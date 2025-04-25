import React from 'react';
import { Button, Image, Typography } from 'antd';

import { useGetFoodByIdQuery } from '@/redux/query/apis/food/foodApis';
import { Food } from '@/types/food';

import { DirectionsList } from '../DirectionList';
import { Ingredient } from '../Ingredient';
import { NutritionSummary } from '../NutritionSummary';

const { Title } = Typography;

interface SelectedFoodDetailProps {
  selectedFood: Food;
  onAddFood: (foodId: string) => void;
  onBack: () => void;
}

const SelectedFoodDetail: React.FC<SelectedFoodDetailProps> = ({
  selectedFood,
  onAddFood,
  onBack,
}) => {
  const { data: detailFood } = useGetFoodByIdQuery(selectedFood._id);
  return (
    <div className='flex flex-col gap-2'>
      <Title level={3} className='m-0 font-thin'>
        {selectedFood.name}
      </Title>
      <Image
        width='100%'
        src={selectedFood.imgUrls[0]}
        alt='Image food'
        className='rounded-md object-cover'
      />
      <div className='flex items-center gap-2'>
        <Button
          onClick={() => onAddFood(selectedFood._id)}
          className='bg-primary hover:border-primary w-[120px] hover:text-black'
        >
          Add food
        </Button>
        <Button
          onClick={onBack}
          className='w-[120px] bg-gray-300 px-2 hover:border-gray-400 hover:text-black'
        >
          Back to Filters
        </Button>
      </div>
      <div className='flex items-center gap-2'>
        <NutritionSummary
          nutrition={selectedFood.nutrition}
          type='food'
          isDetailCollection={true}
        />
      </div>
      {detailFood?.data?.ingredientList && (
        <Ingredient ingredientList={detailFood?.data?.ingredientList} />
      )}
      {selectedFood?.directions && (
        <DirectionsList directions={selectedFood.directions} />
      )}
    </div>
  );
};

export default SelectedFoodDetail;
