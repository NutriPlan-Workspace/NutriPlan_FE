import React, { useState } from 'react';
import { Modal } from 'antd';

import { useScale } from '@/contexts/ScaleContext';
import { useScaleIngre } from '@/contexts/ScaleIngreContext';
import DetailedIngredient from '@/organisms/ModalsContent/DetailedIngredient';
import { Food } from '@/types/food';

interface IngredientProps {
  ingredientList: Food[];
}

const Ingredient: React.FC<IngredientProps> = ({ ingredientList }) => {
  const { amount, conversionFactor } = useScale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredient, setIngredient] = useState<Food | null>(null);
  const { setAmountIngre, setUnitIngre } = useScaleIngre();

  const showModal = (detailedIngredient: Food) => {
    setIngredient(detailedIngredient);
    setAmountIngre(detailedIngredient.units[0].amount);
    setUnitIngre(detailedIngredient.units[0].description);
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
      <Modal
        title={ingredient?.name}
        open={isModalOpen}
        onOk={handleOk}
        closable={false}
        width={800}
        onCancel={handleCancel}
      >
        {ingredient && <DetailedIngredient detailedIngredient={ingredient} />}
      </Modal>
      <div className='mt-4 mb-4'>
        <h2 className='text-lg font-semibold'>Ingredients</h2>
        <ul className='mt-2 list-inside list-disc'>
          {ingredientList.map((item, index) => (
            <>
              <div
                key={index}
                className='flex cursor-pointer items-center space-x-4 hover:bg-gray-100'
                onClick={() => showModal(item)}
              >
                <span className='w-22 flex-shrink-0 p-3'>
                  <img
                    className='h-auto w-full object-cover'
                    src={item.imgUrls[0] || ''}
                    alt={item.name}
                  />
                </span>
                <div className='flex min-w-70 flex-col'>
                  <h1 className='text-lg font-semibold'>{item.name}</h1>
                  <p className='text-gray-500'>{item.description}</p>
                  <div className='flex gap-x-6 text-gray-500'>
                    <span>
                      {(
                        ((item.units[2].amount || 1) * amount) /
                        conversionFactor
                      ).toFixed(1)}{' '}
                      {item.units[2].description}
                    </span>
                    <span>
                      {(
                        ((item.units[0].amount || 1) * amount) /
                        conversionFactor
                      ).toFixed(1)}{' '}
                      {item.units[0].description}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Ingredient;
