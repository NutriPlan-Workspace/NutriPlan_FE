import React, { useEffect, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'antd';

import { FOOD_CATEGORIES } from '@/constants/foodCategories';
import { useScale } from '@/contexts/ScaleContext';
import {
  useLazyGetFoodByIdQuery,
  useTrackFoodViewMutation,
} from '@/redux/query/apis/food/foodApis';
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
  const [trackFoodView] = useTrackFoodViewMutation();

  const categoryLabelByValue = new Map(
    FOOD_CATEGORIES.map(
      (category) => [category.value, category.label] as const,
    ),
  );

  useEffect(() => {
    if (!viewingFoodData) return;

    setTitleModal(viewingFoodData.name);
    dispatch(setIsModalDetailOpen(true));

    trackFoodView({ foodId: viewingFoodData._id, source: 'modal' });

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
    trackFoodView,
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
          {detailedFood?.data?.mainFood?.categories?.length ? (
            <div className='sticky top-0 z-10 -mx-8 mb-4 border-b border-gray-200/70 bg-white/70 px-8 py-4 backdrop-blur'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <div className='text-xs font-semibold tracking-widest text-gray-500'>
                    CATEGORIES
                  </div>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {detailedFood.data.mainFood.categories
                      .map((id) => categoryLabelByValue.get(id))
                      .filter((label): label is string => Boolean(label))
                      .map((label, idx) => (
                        <span
                          key={`${label}-${idx}`}
                          className='rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[12px] font-semibold text-gray-800 shadow-[0_12px_30px_-26px_rgba(16,24,40,0.45)]'
                        >
                          {label}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

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
