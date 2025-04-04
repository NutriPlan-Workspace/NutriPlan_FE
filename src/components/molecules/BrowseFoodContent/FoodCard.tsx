import React, { useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Modal, Popover } from 'antd';

import { useScale } from '@/contexts/ScaleContext';
import { PieChart } from '@/molecules/PieChart';
import ModalFoodIngre from '@/organisms/ModalFoodIngre/ModalFoodIngre';
import { useGetFoodByIdQuery } from '@/redux/query/apis/food/foodApis';
import { Food } from '@/types/food';
import { roundNumber } from '@/utils/roundNumber';

import { NutritionPopoverFood } from '../NutritionPopoverFood';

interface FoodCardProps {
  foodItem: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ foodItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: detailedFood } = useGetFoodByIdQuery(foodItem._id);

  const { setAmount, setConversionFactor, setUnit } = useScale();

  const [titleModal, setTitleModal] = useState(
    detailedFood?.data.mainFood.name,
  );

  const [detailedIngredient, setDetailedIngredient] = useState<Food | null>(
    null,
  );

  const showModal = () => {
    const amount = roundNumber(
      detailedFood?.data.mainFood.units[1].amount || 1,
      2,
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

  const handleOnclickBack = () => {
    setDetailedIngredient(null);
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
        title={
          <div className='flex gap-2'>
            {detailedIngredient && (
              <span className='mt-1 h-7 rounded-md hover:cursor-pointer hover:bg-gray-100'>
                <IoMdArrowRoundBack onClick={() => handleOnclickBack()} />
              </span>
            )}
            <span>{titleModal}</span>
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        closable={true}
        width={900}
        onCancel={handleCancel}
        footer={<></>}
      >
        {detailedFood && (
          <ModalFoodIngre
            detailedFood={detailedFood}
            setTitleModal={setTitleModal}
            setDetailedIngredient={setDetailedIngredient}
            detailedIngredient={detailedIngredient}
          />
        )}
      </Modal>
    </>
  );
};
export default FoodCard;
