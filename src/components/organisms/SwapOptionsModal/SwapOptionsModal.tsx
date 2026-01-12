import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Empty, Image, Input, Modal, Select, Spin } from 'antd';

import { FOOD_CATEGORIES } from '@/constants/foodCategories';
import type { DishType } from '@/constants/foodFilter';
import {
  setIsModalDetailOpen,
  setViewingDetailFood,
} from '@/redux/slices/food/foodReducer';
import type { SwapModalFilters } from '@/redux/slices/mealPlan';
import type { Food } from '@/types/food';
import type {
  SwapFoodOption,
  SwapMealOption,
  SwapNutrition,
  SwapOptionsResponse,
} from '@/types/mealSwap';

const FALLBACK_FOOD_IMAGE =
  'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif';

type SwapOptionsModalProps = {
  open: boolean;
  onClose: () => void;
  data: SwapOptionsResponse | null;
  isLoading: boolean;
  onApply: (option: SwapFoodOption | SwapMealOption) => void;
  title: string;
  filters?: SwapModalFilters;
  onFiltersChange?: (filters: SwapModalFilters) => void;
};

const formatMacros = (nutrition?: SwapNutrition) => {
  if (!nutrition) return '';
  const calories = nutrition.calories ?? 0;
  const protein = nutrition.protein ?? 0;
  const carbs = nutrition.carbs ?? 0;
  const fat = nutrition.fat ?? 0;
  return `${Math.round(calories)} kcal · ${Math.round(protein)}P · ${Math.round(carbs)}C · ${Math.round(fat)}F`;
};

const formatServing = (option: SwapFoodOption) => {
  if (option.amount === undefined) return '';
  const rounded = Math.round(option.amount * 100) / 100;
  const unitLabel = option.food?.units?.[option.unit ?? 0]?.description;
  return unitLabel ? `${rounded} ${unitLabel}` : `${rounded}`;
};

const SwapOptionsModal: React.FC<SwapOptionsModalProps> = ({
  open,
  onClose,
  data,
  isLoading,
  onApply,
  title,
  filters,
  onFiltersChange,
}) => {
  const dispatch = useDispatch();

  const categoryMap = useMemo(
    () => new Map(FOOD_CATEGORIES.map((item) => [item.value, item.label])),
    [],
  );

  const openFoodDetail = useCallback(
    (foodId: string, name?: string) => {
      const minimalFood = {
        _id: foodId,
        name: name || 'Food',
        imgUrls: [],
      } as unknown as Food;

      dispatch(setViewingDetailFood(minimalFood));
      dispatch(setIsModalDetailOpen(true));
    },
    [dispatch],
  );

  const renderCategories = (categories?: number[]) => {
    if (!categories?.length) return null;
    const labels = categories
      .map((value) => categoryMap.get(value))
      .filter(Boolean)
      .slice(0, 3) as string[];

    if (!labels.length) return null;
    return (
      <div className='mt-1 flex flex-wrap gap-1'>
        {labels.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600'
          >
            {label}
          </span>
        ))}
      </div>
    );
  };

  const renderFoodOption = (option: SwapFoodOption, index: number) => {
    const name = option.food?.name || option.foodId;
    const serving = formatServing(option);
    const macros = formatMacros(option.nutrition);
    const image =
      option.food?.imgUrls?.[0] ||
      (option.food as unknown as { imageUrl?: string })?.imageUrl ||
      (option.food as unknown as { image?: string })?.image ||
      '';

    return (
      <div
        key={`${option.foodId}-${index}`}
        className='flex items-start justify-between gap-4 rounded-xl border border-gray-200 p-3 transition-shadow hover:shadow-sm'
      >
        <div className='flex items-start gap-3'>
          <Image
            src={image || FALLBACK_FOOD_IMAGE}
            alt={name}
            className='h-12 w-12 rounded-lg object-cover'
            loading='lazy'
            preview={{
              mask: <EyeOutlined style={{ fontSize: 18, color: 'white' }} />,
            }}
          />
          <div>
            <button
              type='button'
              className='text-left text-sm font-semibold text-gray-900 hover:underline'
              onClick={() => openFoodDetail(option.foodId, name)}
            >
              {name}
            </button>
            {serving && (
              <div className='text-xs text-gray-500'>Serving: {serving}</div>
            )}
            {macros && <div className='text-xs text-gray-500'>{macros}</div>}
            {renderCategories(option.food?.categories)}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            size='small'
            onClick={() => openFoodDetail(option.foodId, name)}
          >
            Details
          </Button>
          <Button
            size='small'
            type='primary'
            className='bg-primary text-black'
            onClick={() => onApply(option)}
          >
            Apply
          </Button>
        </div>
      </div>
    );
  };

  const renderMealOption = (option: SwapMealOption, index: number) => {
    const macros = formatMacros(option.nutrition);
    return (
      <div
        key={`meal-option-${index}`}
        className='flex items-start justify-between gap-4 rounded-xl border border-gray-200 p-3 transition-shadow hover:shadow-sm'
      >
        <div className='flex-1'>
          <div className='space-y-2'>
            {option.items.map((item, itemIndex) => (
              <div
                key={`${item.foodId}-${itemIndex}`}
                className='flex items-start gap-3'
              >
                <Image
                  src={item.food?.imgUrls?.[0] || FALLBACK_FOOD_IMAGE}
                  alt={item.food?.name || item.foodId}
                  className='h-10 w-10 rounded-lg object-cover'
                  loading='lazy'
                  preview={{
                    mask: (
                      <EyeOutlined style={{ fontSize: 16, color: 'white' }} />
                    ),
                  }}
                />
                <div className='min-w-0'>
                  <button
                    type='button'
                    className='text-left text-sm font-semibold text-gray-900 hover:underline'
                    onClick={() =>
                      openFoodDetail(
                        item.foodId,
                        item.food?.name || item.foodId,
                      )
                    }
                  >
                    {item.food?.name || item.foodId}
                  </button>
                  {formatServing(item) ? (
                    <div className='text-xs text-gray-500'>
                      {formatServing(item)}
                    </div>
                  ) : null}
                  {renderCategories(item.food?.categories)}
                </div>
              </div>
            ))}
          </div>
          {macros && <div className='mt-2 text-xs text-gray-500'>{macros}</div>}
        </div>
        <Button
          size='small'
          type='primary'
          className='bg-primary text-black'
          onClick={() => onApply(option)}
        >
          Apply
        </Button>
      </div>
    );
  };

  const categoryOptions = useMemo(
    () => FOOD_CATEGORIES.map((c) => ({ label: c.label, value: c.value })),
    [],
  );

  const normalizedFilters: SwapModalFilters = filters ?? {};
  const searchText = (normalizedFilters.q ?? '').trim().toLowerCase();
  const categoryIds = normalizedFilters.categoryIds ?? [];
  const dishType = normalizedFilters.dishType;

  const filteredOptions = useMemo(() => {
    if (!data) return [];
    const base = data.options ?? [];

    const matchesText = (value?: string) => {
      if (!searchText) return true;
      if (!value) return false;
      return value.toLowerCase().includes(searchText);
    };

    const matchesCategories = (categories?: number[]) => {
      if (!categoryIds.length) return true;
      if (!categories?.length) return false;
      return categories.some((c) => categoryIds.includes(c));
    };

    if (data.swapType === 'meal') {
      return (base as SwapMealOption[]).filter((option) =>
        option.items.some((item) => {
          const name = item.food?.name || item.foodId;
          return matchesText(name) && matchesCategories(item.food?.categories);
        }),
      );
    }

    return (base as SwapFoodOption[]).filter((option) => {
      const name = option.food?.name || option.foodId;
      const okText = matchesText(name);
      const okCategories = matchesCategories(option.food?.categories);

      const prop = option.food?.property;
      const okDishType = (() => {
        if (!dishType) return true;
        // If backend doesn't provide property flags, don't aggressively hide options.
        if (!prop) return true;
        if (dishType === 'main') return prop.mainDish !== false;
        if (dishType === 'side') return prop.sideDish !== false;
        return true;
      })();

      return okText && okCategories && okDishType;
    });
  }, [categoryIds, data, dishType, searchText]);

  const handleSearchChange = (value: string) => {
    if (!onFiltersChange) return;
    const next: SwapModalFilters = { ...normalizedFilters };
    const trimmed = value.trim();
    if (!trimmed) {
      delete next.q;
    } else {
      next.q = value;
    }
    onFiltersChange(next);
  };

  const handleDishTypeChange = (value?: DishType) => {
    if (!onFiltersChange) return;
    const next: SwapModalFilters = { ...normalizedFilters };
    if (!value) {
      delete next.dishType;
    } else {
      next.dishType = value;
    }
    onFiltersChange(next);
  };

  const handleCategoriesChange = (values: number[]) => {
    if (!onFiltersChange) return;
    const next: SwapModalFilters = { ...normalizedFilters };
    if (!values?.length) {
      delete next.categoryIds;
    } else {
      next.categoryIds = values;
    }
    onFiltersChange(next);
  };

  const handleClearFilters = () => {
    onFiltersChange?.({});
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={title}
      width={600}
    >
      <div className='mb-3 space-y-2'>
        <Input
          placeholder='Filter by name...'
          value={normalizedFilters.q ?? ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          allowClear
          disabled={!onFiltersChange}
        />
        <div className='flex items-center gap-2'>
          <Select
            className='flex-1'
            placeholder='Filter by categories...'
            mode='multiple'
            value={normalizedFilters.categoryIds ?? []}
            options={categoryOptions}
            onChange={handleCategoriesChange}
            disabled={!onFiltersChange}
            maxTagCount='responsive'
          />
          {data?.swapType === 'food' ? (
            <Select
              className='w-[160px]'
              placeholder='Dish type'
              value={normalizedFilters.dishType}
              options={[
                { label: 'Main', value: 'main' },
                { label: 'Side', value: 'side' },
              ]}
              allowClear
              onChange={(value) => handleDishTypeChange(value as DishType)}
              disabled={!onFiltersChange}
            />
          ) : null}
          <Button onClick={handleClearFilters} disabled={!onFiltersChange}>
            Clear
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-8'>
          <Spin />
        </div>
      ) : filteredOptions.length === 0 ? (
        <Empty description='No suggestions available.' />
      ) : (
        <div className='scrollbar-thin max-h-[70vh] space-y-3 overflow-y-auto pr-1'>
          {data?.swapType === 'meal'
            ? (filteredOptions as SwapMealOption[]).map(renderMealOption)
            : (filteredOptions as SwapFoodOption[]).map(renderFoodOption)}
        </div>
      )}
    </Modal>
  );
};

export default SwapOptionsModal;
