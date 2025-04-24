import React, { useEffect, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'antd';

import { useScale } from '@/contexts/ScaleContext';
import { useLazyGetFoodByIdQuery } from '@/redux/query/apis/food/foodApis';
import {
  foodSelector,
  removePreviousViewingDetailFood,
  setIsModalDetailOpen,
  setViewingDetailFood,
} from '@/redux/slices/food';
import { roundNumber } from '@/utils/roundNumber';

import { DetailedFood } from '../DetailedFood';
import { DetailedIngredient } from '../DetailedIngredient';

const ModalFoodDetail: React.FC = () => {
  const dispatch = useDispatch();
  const viewingDetailFood = useSelector(foodSelector).viewingDetailFood;
  const viewingFoodData =
    viewingDetailFood && 'foodId' in viewingDetailFood
      ? viewingDetailFood.foodId
      : viewingDetailFood;
  const previousViewingDetailFood =
    useSelector(foodSelector).previousViewingDetailFood;
  const { setAmount, setConversionFactor, setUnit } = useScale();

  const [titleModal, setTitleModal] = useState<string>(
    viewingFoodData ? viewingFoodData.name : '',
  );
  const isModalOpen = useSelector(foodSelector).isModalDetailOpen;

  const [triggerGetFoodById, { data: detailedFood, isFetching }] =
    useLazyGetFoodByIdQuery();

  useEffect(() => {
    if (!viewingFoodData) return;

    setTitleModal(viewingFoodData.name);
    dispatch(setIsModalDetailOpen(true));

    const fetchDetails = async () => {
      const res = await triggerGetFoodById(viewingFoodData._id);
      const fetchedFood = res.data?.data?.mainFood;

      if (fetchedFood) {
        const amount = roundNumber(fetchedFood.units[1]?.amount || 1, 2);
        const unit = fetchedFood.units[1]?.description || 'serving';
        setAmount(amount);
        setUnit(unit);
        setConversionFactor(amount);
      }
    };

    fetchDetails();
  }, [
    setAmount,
    setUnit,
    setConversionFactor,
    triggerGetFoodById,
    dispatch,
    viewingFoodData,
  ]);

  const handleClickBack = () => {
    if (!previousViewingDetailFood) return;
    dispatch(setViewingDetailFood(previousViewingDetailFood));
    dispatch(removePreviousViewingDetailFood());
  };

  if (!viewingFoodData) return null;
  return (
    <div className='food-detail'>
      <Modal
        className='detail-modal'
        centered
        title={
          <div className='flex h-full w-full items-center justify-start'>
            {previousViewingDetailFood && (
              <span className='mt-1 mr-2 h-7 rounded-md hover:cursor-pointer hover:bg-gray-100'>
                <IoMdArrowRoundBack onClick={() => handleClickBack()} />
              </span>
            )}
            <span>{titleModal}</span>
          </div>
        }
        open={isModalOpen}
        closable
        width={900}
        footer={null}
        onCancel={() => {
          dispatch(removePreviousViewingDetailFood());
          dispatch(setIsModalDetailOpen(false));
        }}
      >
        <div className='scrollbar-thin h-[75vh] w-full overflow-y-auto px-8 pb-8'>
          {!isFetching &&
            (detailedFood !== undefined &&
            detailedFood.data.mainFood.isRecipe ? (
              <DetailedFood
                food={detailedFood?.data.mainFood}
                listIngredient={detailedFood?.data.ingredientList || []}
              />
            ) : (
              <DetailedIngredient food={detailedFood?.data.mainFood} />
            ))}
        </div>
      </Modal>
    </div>
  );
};

export default ModalFoodDetail;
