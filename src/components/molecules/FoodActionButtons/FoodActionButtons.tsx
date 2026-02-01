import React, { useCallback, useState } from 'react';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { HiOutlineStar, HiOutlineXCircle } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from '@tanstack/react-router';
import { Popconfirm, Spin } from 'antd';

import { cn } from '@/helpers/helpers';
import {
  useGetExclusionCollectionQuery,
  useUpdateExclusionFoodsMutation,
  useUpdateFavoriteFoodsMutation,
} from '@/redux/query/apis/collection/collectionApi';
import {
  addToFavoriteList,
  collectionSelector,
  removeFromFavoriteList,
} from '@/redux/slices/collection';
import {
  removePreviousViewingDetailFood,
  setCurrentCustomFood,
  setCurrentCustomIngredients,
  setIsModalDetailOpen,
} from '@/redux/slices/food';
import type { Food } from '@/types/food';
import { showToastError } from '@/utils/toastUtils';

interface FoodActionButtonsProps {
  food: Food;
  listIngredient?: Food[];
}

const FoodActionButtons: React.FC<FoodActionButtonsProps> = ({
  food,
  listIngredient,
}) => {
  const dispatch = useDispatch();
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingExclude, setLoadingExclude] = useState(false);
  const navigate = useNavigate();

  const favoriteList = useSelector(collectionSelector).favoriteList;
  const isFavorite = favoriteList.some((item) => item.food === food._id);

  const { data: exclusionCollection } = useGetExclusionCollectionQuery();
  const exclusionFoods = exclusionCollection?.data?.foods ?? [];
  const excludedIds = exclusionFoods.map((item) =>
    typeof item.food === 'string' ? item.food : item.food._id,
  );
  const isExcluded = excludedIds.includes(food._id);

  const [updateFavoriteFoods] = useUpdateFavoriteFoodsMutation();
  const [updateExclusionFoods] = useUpdateExclusionFoodsMutation();

  const toggleFavorite = async () => {
    setLoadingFavorite(true);
    try {
      const isFavorited = favoriteList.some((item) => item.food === food._id);

      let updatedFavoriteList;

      if (isFavorited) {
        updatedFavoriteList = favoriteList.filter(
          (item) => item.food !== food._id,
        );
        dispatch(removeFromFavoriteList(food._id));
      } else {
        const newFavoriteFood = {
          food: food._id,
          date: new Date().toISOString(),
        };
        updatedFavoriteList = [...favoriteList, newFavoriteFood];
        dispatch(addToFavoriteList(newFavoriteFood));
      }

      await updateFavoriteFoods({ data: updatedFavoriteList }).unwrap();
    } catch {
      showToastError('Failed to update favorite foods');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const toggleExclude = async () => {
    setLoadingExclude(true);
    try {
      const baseList = exclusionFoods.map((item) => ({
        food: typeof item.food === 'string' ? item.food : item.food._id,
        date: item.date ?? new Date().toISOString(),
      }));
      const updatedExclusions = isExcluded
        ? baseList.filter((item) => item.food !== food._id)
        : [...baseList, { food: food._id, date: new Date().toISOString() }];

      await updateExclusionFoods({ data: updatedExclusions }).unwrap();
    } catch {
      showToastError('Failed to update exclusions');
    } finally {
      setLoadingExclude(false);
    }
  };

  const handleEdit = useCallback(() => {
    if (food.isCustom) {
      if (food.isRecipe) {
        dispatch(setCurrentCustomFood(food));
        if (listIngredient) {
          dispatch(setCurrentCustomIngredients(listIngredient));
        }
        navigate({ to: '/custom-recipes/create-recipe' });
        dispatch(removePreviousViewingDetailFood());
        dispatch(setIsModalDetailOpen(false));
      } else {
        navigate({ to: `/custom-recipes/custom-food/${food._id}` });
        dispatch(removePreviousViewingDetailFood());
        dispatch(setIsModalDetailOpen(false));
      }
    }
  }, [food, navigate, dispatch, listIngredient]);

  const handleConfirm = useCallback(() => {
    if (food.isRecipe) {
      navigate({ to: '/custom-recipes/create-recipe' });
      dispatch(setCurrentCustomFood(food));
      dispatch(setCurrentCustomIngredients(listIngredient!));
      dispatch(removePreviousViewingDetailFood());
      dispatch(setIsModalDetailOpen(false));
    } else {
      navigate({ to: '/custom-recipes/custom-food' });
      dispatch(setCurrentCustomFood(food));
      dispatch(removePreviousViewingDetailFood());
      dispatch(setIsModalDetailOpen(false));
    }
  }, [food, navigate, dispatch, listIngredient]);

  return (
    <div className='z-1 flex w-full cursor-pointer justify-center rounded-b-md border-x border-b border-gray-200'>
      {/* Favorite */}
      <div
        className='flex h-10 w-full flex-col items-center justify-center text-gray-500 transition-all hover:bg-amber-50 hover:text-amber-500'
        onClick={toggleFavorite}
      >
        {loadingFavorite ? (
          <Spin size='small' className='flex h-[20px] items-center' />
        ) : isFavorite ? (
          <HiOutlineStar className='mb-0.5 text-lg text-amber-500' />
        ) : (
          <HiOutlineStar className='mb-0.5 text-lg' />
        )}
        <span
          className={cn('text-[10px] font-medium', {
            'text-amber-500': isFavorite,
          })}
        >
          {isFavorite ? 'Favorited' : 'Favorite'}
        </span>
      </div>

      {/* Exclusion */}
      <div
        className='flex h-10 w-full flex-col items-center justify-center border-l border-gray-200 text-gray-500 transition-all hover:bg-rose-50 hover:text-rose-600'
        onClick={toggleExclude}
      >
        {loadingExclude ? (
          <Spin size='small' className='flex h-[20px] items-center' />
        ) : (
          <HiOutlineXCircle
            className={cn('mb-0.5 text-lg', {
              'text-rose-500': isExcluded,
            })}
          />
        )}
        <span
          className={cn('text-[10px] font-medium', {
            'text-rose-500': isExcluded,
          })}
        >
          {isExcluded ? 'Excluded' : 'Exclude'}
        </span>
      </div>

      {/* Edit */}
      {food.isCustom ? (
        <div
          className='flex h-10 w-full flex-col items-center justify-center border-l border-gray-200 text-gray-500 transition-all hover:bg-cyan-50 hover:text-cyan-600'
          onClick={handleEdit}
        >
          <HiOutlinePencilAlt className='mb-0.5 text-lg' />
          <span className='text-[10px] font-medium'>Edit</span>
        </div>
      ) : (
        <Popconfirm
          title={`Edit ${food.name}`}
          description={
            <div>
              Editing this recipe will create a copy
              <br />
              because it is curated by NutriPlan.
            </div>
          }
          onConfirm={handleConfirm}
        >
          <div
            className='flex h-10 w-full flex-col items-center justify-center border-l border-gray-200 text-gray-500 transition-all hover:bg-cyan-50 hover:text-cyan-600'
            onClick={handleEdit}
          >
            <HiOutlinePencilAlt className='mb-0.5 text-lg' />
            <span className='text-[10px] font-medium'>Edit</span>
          </div>
        </Popconfirm>
      )}
    </div>
  );
};

export default FoodActionButtons;
