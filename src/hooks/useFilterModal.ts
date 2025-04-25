import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { CheckboxChangeEvent } from 'antd';

import type { PreferredFoodType, ValidFilter } from '@/constants/foodFilter';
import { userSelector } from '@/redux/slices/user';
import type { FoodFilterQuery } from '@/types/foodFilterQuery';

const nutritionMap: Record<string, Partial<FoodFilterQuery>> = {
  'High Protein': { minPer100CaloriesProteins: 14 },
  'Low Carb': { maxPer100CaloriesCarbs: 5 },
  'Low Fat': { maxPer100CaloriesFats: 5 },
  'High Fiber': { minPer100CaloriesFiber: 7 },
  'Low Sodium': { maxPer100CaloriesSodium: 5 },
};

export const useFilterModal = (
  onClose?: () => void,
  onFilterChange?: (hasFilter: boolean) => void,
  onFiltersSubmit?: (
    newFilters: Partial<FoodFilterQuery>,
    keysToRemove?: (keyof FoodFilterQuery)[],
  ) => void,
  isFilterCollection?: boolean,
) => {
  const { user } = useSelector(userSelector);
  const [searchValue, setSearchValue] = useState('');
  const [applyExclusions, setApplyExclusions] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [activeOptions, setActiveOptions] = useState<string[]>([]);
  const [dishType, setDishType] = useState<'main' | 'side' | null>(null);
  const [preferredFoodTypes, setPreferredFoodTypes] = useState<
    PreferredFoodType[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<ValidFilter[]>(
    [],
  );
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>(
    [],
  );
  const [searchCollections, setSearchCollections] = useState<boolean>(false);
  const [nutritionFilters, setNutritionFilters] = useState<
    Partial<FoodFilterQuery>
  >({});

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setApplyExclusions(e.target.checked);
    onFilterChange?.(true);
  };

  const handleSearch = () => {
    let combinedFilters: Partial<FoodFilterQuery> = {};
    if (dishType) combinedFilters.dishType = dishType;
    if (preferredFoodTypes.length > 0)
      combinedFilters.preferredFoodTypes = preferredFoodTypes;
    if (selectedCategories.length > 0)
      combinedFilters.filters = selectedCategories;
    if (selectedCollectionIds.length > 0)
      combinedFilters.collectionIds = selectedCollectionIds;
    if (searchCollections) combinedFilters.searchCollections = true;

    Object.assign(combinedFilters, nutritionFilters);

    activeOptions.forEach((option) => {
      Object.assign(combinedFilters, nutritionMap[option]);
    });

    combinedFilters = { applyExclusions, ...combinedFilters };

    const hasOtherFilters = Object.keys(combinedFilters).some(
      (key) => key !== 'applyExclusions',
    );

    if (applyExclusions || hasOtherFilters) {
      onFilterChange?.(true);
    }

    onFiltersSubmit?.(combinedFilters);
    onClose?.();
  };

  const autoSubmitFilters = useCallback(() => {
    if (isFilterCollection && onFiltersSubmit) {
      let combinedFilters: Partial<FoodFilterQuery> = {};
      if (dishType) combinedFilters.dishType = dishType;
      if (preferredFoodTypes.length > 0)
        combinedFilters.preferredFoodTypes = preferredFoodTypes;
      if (selectedCategories.length > 0)
        combinedFilters.filters = selectedCategories;
      if (selectedCollectionIds.length > 0)
        combinedFilters.collectionIds = selectedCollectionIds;
      if (searchCollections) combinedFilters.searchCollections = true;

      Object.assign(combinedFilters, nutritionFilters);

      activeOptions.forEach((option) => {
        Object.assign(combinedFilters, nutritionMap[option]);
      });

      combinedFilters = { applyExclusions, ...combinedFilters };
      onFiltersSubmit(combinedFilters);
    }
  }, [
    isFilterCollection,
    onFiltersSubmit,
    dishType,
    preferredFoodTypes,
    selectedCategories,
    selectedCollectionIds,
    searchCollections,
    nutritionFilters,
    activeOptions,
    applyExclusions,
  ]);

  useEffect(() => {
    autoSubmitFilters();
  }, [
    searchValue,
    applyExclusions,
    activeOptions,
    dishType,
    preferredFoodTypes,
    selectedCategories,
    selectedCollectionIds,
    searchCollections,
    nutritionFilters,
    autoSubmitFilters,
  ]);

  const handleReset = () => {
    setResetTrigger((prev) => !prev);
    setApplyExclusions(false);
    setActiveOptions([]);
    setDishType(null);
    setPreferredFoodTypes([]);
    setSelectedCategories([]);
    setSelectedCollectionIds([]);
    setSearchCollections(false);
    setNutritionFilters({});
    onFilterChange?.(false);
    setSearchValue('');
    if (isFilterCollection) {
      onFiltersSubmit?.({});
    }
  };

  return {
    user,
    applyExclusions,
    resetTrigger,
    activeOptions,
    dishType,
    preferredFoodTypes,
    selectedCategories,
    selectedCollectionIds,
    searchCollections,
    nutritionFilters,
    searchValue,

    setSearchValue,
    setApplyExclusions,
    setActiveOptions,
    setDishType,
    setPreferredFoodTypes,
    setSelectedCategories,
    setSelectedCollectionIds,
    setSearchCollections,
    setNutritionFilters,

    handleSearch,
    handleReset,
    handleCheckboxChange,
  };
};
