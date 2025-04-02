import React, { useState } from 'react';
import { Modal, Popover } from 'antd';

import { useScale } from '@/contexts/ScaleContext';
import { PieChart } from '@/molecules/PieChart';
import { DetailedFood } from '@/organisms/ModalsContent';
import { useGetFoodByIdQuery } from '@/redux/query/apis/food/foodApis';
import { Food } from '@/types/food';

import { NutritionPopoverFood } from '../NutritionPopoverFood';

interface FoodCardProps {
  foodItem: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ foodItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: detailedFood } = useGetFoodByIdQuery(foodItem._id);

  const { setAmount, setConversionFactor, setUnit } = useScale();

  const showModal = () => {
    const amount = Number(
      (detailedFood?.data.mainFood.units[1].amount || 1).toFixed(1),
    );
    const unit = detailedFood?.data.mainFood.units[1].description || 'serving';
    setAmount(amount);
    setUnit(unit);
    setConversionFactor(amount);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Popover
        placement='left'
        color='white'
        styles={{
          body: {
            padding: 0,
            borderRadius: '10px',
            overflow: 'hidden',
          },
        }}
        content={
          <NutritionPopoverFood
            mealItem={{
              _id: foodItem._id,
              foodId: foodItem,
              amount: 1,
              unit: 1,
            }}
            showIngredient={false}
          />
        }
      >
        <div
          className='cursor-pointer rounded-lg border-none shadow-md'
          onClick={showModal}
        >
          <div className='h-full w-full'>
            <div className='h-full w-full'>
              <img
                src={foodItem.imgUrls ? foodItem.imgUrls[0] : ''}
                alt={foodItem.name}
                className='h-full w-full rounded-md object-cover'
              />
            </div>
          </div>
          <div className='mt-2'>
            <p className='text-center font-bold text-gray-800'>
              {foodItem.name}
            </p>
          </div>
          <div className='flex items-center justify-center gap-2 pt-1'>
            <PieChart nutritionData={foodItem.nutrition} label={false} />
            <p className='text-sm text-gray-400'>{`${Math.round(foodItem.nutrition.calories).toString()} Calories`}</p>
          </div>
        </div>
      </Popover>
      <Modal
        title={detailedFood?.data.mainFood.name}
        open={isModalOpen}
        onOk={handleOk}
        closable={false}
        width={1000}
        onCancel={handleCancel}
      >
        {detailedFood && <DetailedFood detailedFood={detailedFood} />}
      </Modal>
    </>
  );
};
export default FoodCard;
