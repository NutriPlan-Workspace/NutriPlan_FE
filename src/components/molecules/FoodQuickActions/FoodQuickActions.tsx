/* eslint-disable simple-import-sort/imports */
import React, { useMemo, useState } from 'react';
import {
  HiOutlineArchiveBoxArrowDown,
  HiOutlineHeart,
  HiOutlineXCircle,
} from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, Tooltip } from 'antd';

import { Button } from '@/atoms/Button';
import { useToast } from '@/contexts/ToastContext';
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
import { useUpsertPantryItemMutation } from '@/redux/query/apis/pantry/pantryApi';
import type { Food } from '@/types/food';

interface FoodQuickActionsProps {
  food: Food;
  size?: 'sm' | 'md';
  className?: string;
}

const FoodQuickActions: React.FC<FoodQuickActionsProps> = ({
  food,
  size = 'md',
  className,
}) => {
  const { showToastError, showToastSuccess } = useToast();

  const dispatch = useDispatch();
  const favoriteList = useSelector(collectionSelector).favoriteList;

  const [updateFavorites, { isLoading: isUpdatingFavorites }] =
    useUpdateFavoriteFoodsMutation();

  const { data: exclusionData } = useGetExclusionCollectionQuery();
  const [updateExclusions, { isLoading: isUpdatingExclusions }] =
    useUpdateExclusionFoodsMutation();

  const [upsertPantryItem, { isLoading: isAddingPantry }] =
    useUpsertPantryItemMutation();

  const [leftoverQty, setLeftoverQty] = useState<number>(1);
  const [leftoverUnit, setLeftoverUnit] = useState<string>(
    food.units?.[1]?.description ?? food.units?.[0]?.description ?? 'serving',
  );

  const iconClass = size === 'sm' ? 'h-[18px] w-[18px]' : 'h-[20px] w-[20px]';

  const buttonClass =
    size === 'sm' ? 'h-8 w-8 rounded-full' : 'h-9 w-9 rounded-full';

  const pantryUnitOptions = useMemo(() => {
    const seen = new Set<string>();
    const options = (food.units ?? [])
      .map((u) => (u?.description ?? '').trim())
      .filter(Boolean)
      .filter((desc) => {
        if (seen.has(desc)) return false;
        seen.add(desc);
        return true;
      });

    if (!options.length) options.push('serving');
    if (!seen.has('gram')) options.push('gram');

    return options;
  }, [food.units]);

  const onAddFavorite = async () => {
    try {
      const isFavorited = favoriteList.some((item) => item.food === food._id);
      const next = isFavorited
        ? favoriteList.filter((item) => item.food !== food._id)
        : [...favoriteList, { food: food._id, date: new Date().toISOString() }];

      if (isFavorited) {
        dispatch(removeFromFavoriteList(food._id));
      } else {
        dispatch(
          addToFavoriteList({ food: food._id, date: next.at(-1)!.date }),
        );
      }

      await updateFavorites({ data: next }).unwrap();
      showToastSuccess('Added to favorites.');
    } catch (error) {
      showToastError(`Failed to add to favorites. ${error}`);
    }
  };

  const onAddExclusion = async () => {
    try {
      const current = exclusionData?.data?.foods ?? [];
      const baseList = current.map((item) => ({
        food: typeof item.food === 'string' ? item.food : item.food._id,
        date: item.date ?? new Date().toISOString(),
      }));
      const isExcluded = baseList.some((item) => item.food === food._id);
      const next = isExcluded
        ? baseList.filter((item) => item.food !== food._id)
        : [...baseList, { food: food._id, date: new Date().toISOString() }];

      await updateExclusions({ data: next }).unwrap();
      showToastSuccess('Added to exclusions.');
    } catch (error) {
      showToastError(`Failed to add to exclusions. ${error}`);
    }
  };

  const onAddLeftovers = async () => {
    try {
      const qty = Number(leftoverQty) || 0;
      if (qty <= 0) return;

      await upsertPantryItem({
        ingredientFoodId: food._id,
        name: food.name,
        quantity: qty,
        unit: leftoverUnit,
        status: 'in_pantry',
      }).unwrap();
      showToastSuccess('Added leftovers to pantry.');
    } catch (error) {
      showToastError(`Failed to add to pantry. ${error}`);
    }
  };

  return (
    <div className={className}>
      <div className='flex items-center gap-1.5'>
        <Tooltip title='Add to favorites'>
          <button
            type='button'
            className={`inline-flex items-center justify-center border border-white/60 bg-white/80 shadow-sm backdrop-blur ${buttonClass}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddFavorite();
            }}
            disabled={isUpdatingFavorites}
          >
            <HiOutlineHeart className={iconClass} />
          </button>
        </Tooltip>

        <Tooltip title='Add to exclusions'>
          <button
            type='button'
            className={`inline-flex items-center justify-center border border-white/60 bg-white/80 shadow-sm backdrop-blur ${buttonClass}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddExclusion();
            }}
            disabled={isUpdatingExclusions}
          >
            <HiOutlineXCircle className={iconClass} />
          </button>
        </Tooltip>

        <Popover
          trigger='click'
          placement='bottomRight'
          content={
            <div className='w-[220px] space-y-2'>
              <div className='text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase'>
                Leftovers to pantry
              </div>
              <div className='flex gap-2'>
                <input
                  type='number'
                  min={0}
                  step={0.1}
                  value={leftoverQty}
                  onChange={(e) => setLeftoverQty(Number(e.target.value) || 0)}
                  className='h-9 w-[90px] rounded-lg border border-gray-200 px-3 text-sm outline-none'
                />
                <select
                  value={leftoverUnit}
                  onChange={(e) => setLeftoverUnit(e.target.value)}
                  className='h-9 flex-1 rounded-lg border border-gray-200 bg-white px-2 text-sm outline-none'
                >
                  {pantryUnitOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                className='bg-primary hover:bg-primary-400 w-full border-none text-black'
                disabled={isAddingPantry}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddLeftovers();
                }}
              >
                {isAddingPantry ? 'Adding...' : 'Add to pantry'}
              </Button>
            </div>
          }
        >
          <Tooltip title='Add leftovers to pantry'>
            <button
              type='button'
              className={`inline-flex items-center justify-center border border-white/60 bg-white/80 shadow-sm backdrop-blur ${buttonClass}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <HiOutlineArchiveBoxArrowDown className={iconClass} />
            </button>
          </Tooltip>
        </Popover>
      </div>
    </div>
  );
};

export default FoodQuickActions;
