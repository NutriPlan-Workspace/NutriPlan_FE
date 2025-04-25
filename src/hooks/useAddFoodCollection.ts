import React, { useCallback, useEffect, useState } from 'react';

import { useGetFoodsQuery } from '@/redux/query/apis/food/foodApis';
import type { Food } from '@/types/food';
import type { FoodFilterQuery } from '@/types/foodFilterQuery';
import { debounceValue } from '@/utils/debounce';

export const useAddFoodCollection = () => {
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [foods, setFoods] = useState<Food[]>([]);
  const [filters, setFilters] = useState<Partial<FoodFilterQuery>>({});
  const { data, isFetching } = useGetFoodsQuery({
    page,
    limit: 20,
    ...filters,
  });
  const [showNoFoods, setShowNoFoods] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!isFetching && foods.length === 0) {
      timeout = setTimeout(() => {
        setShowNoFoods(true);
      }, 500);
    } else {
      setShowNoFoods(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isFetching, foods.length]);

  useEffect(() => {
    if (data?.data?.length) {
      setFoods((prevFoods) => [...prevFoods, ...data.data]);
    }
  }, [data]);

  const debounceSearch = debounceValue<string>(
    searchValue,
    500,
    (debouncedValue) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        q: debouncedValue,
      }));
      setPage(1);
      setFoods([]);
    },
  );

  useEffect(() => {
    debounceSearch();
  }, [searchValue]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 50 && !isFetching) {
      if (data?.data?.length === 20) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  const handleFiltersSubmit = useCallback(
    (
      newFilters: Partial<FoodFilterQuery>,
      keysToRemove?: (keyof FoodFilterQuery)[],
    ) => {
      setFilters((prevFilters) => {
        const updatedFilters = { ...newFilters };
        if (keysToRemove) {
          keysToRemove.forEach((key) => {
            delete updatedFilters[key];
          });
        }
        if (JSON.stringify(prevFilters) !== JSON.stringify(updatedFilters)) {
          setPage(1);
          setFoods([]);
          return updatedFilters;
        }
        return prevFilters;
      });
    },
    [],
  );

  return {
    searchValue,
    setSearchValue,
    page,
    setPage,
    foods,
    setFoods,
    filters,
    setFilters,
    isFetching,
    showNoFoods,
    handleScroll,
    handleFiltersSubmit,
  };
};
