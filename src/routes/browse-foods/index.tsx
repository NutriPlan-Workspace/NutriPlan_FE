import { useEffect, useState } from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { ScaleProvider } from '@/contexts/ScaleContext';
import { ScaleProviderIngre } from '@/contexts/ScaleIngreContext';
import { useGetFoodsQuery } from '@/redux/query/apis/food/foodApis';
import BrowseFoodTemplate from '@/templates/BrowseFoodTemplate/BrowseFoodTemplate';
import type { Food } from '@/types/food';
import type { FoodFilterQuery } from '@/types/foodFilterQuery';

const BrowseFoodPage = () => {
  const [page, setPage] = useState(1);
  const [foods, setFoods] = useState<Food[]>([]);
  const [filters, setFilters] = useState<Partial<FoodFilterQuery>>({});
  const [isUpdatingFilters, setIsUpdatingFilters] = useState(false);
  const { data, isFetching } = useGetFoodsQuery({ page, limit: 8, ...filters });
  const isLastPage = (data && data.data?.length < 8) || false;

  const handleFilterChange = (
    updatedFilter: Partial<FoodFilterQuery>,
    keysToRemove: (keyof FoodFilterQuery)[] = [],
  ) => {
    setFilters(() => {
      const cleaned = { ...updatedFilter };
      keysToRemove.forEach((key) => {
        delete cleaned[key];
      });
      return cleaned;
    });
    setIsUpdatingFilters(true);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    setIsUpdatingFilters(true);
  };

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setFoods((prevFoods) => [
        ...prevFoods,
        // eslint-disable-next-line no-unsafe-optional-chaining
        ...(Array.isArray(data?.data) ? data?.data : []),
      ]);
    }
    setIsUpdatingFilters(false);
  }, [data]);

  return (
    <ScaleProvider>
      <ScaleProviderIngre>
        <BrowseFoodTemplate
          foods={foods}
          isFetching={isUpdatingFilters || isFetching}
          onLoadMore={handleLoadMore}
          onFilterChange={(newFilters, keysToRemove = []) => {
            setFoods([]);
            setPage(1);
            handleFilterChange(newFilters, keysToRemove);
          }}
          isLastPage={isLastPage}
        />
      </ScaleProviderIngre>
    </ScaleProvider>
  );
};

export const Route = createFileRoute(
  PATH.BROWSE_FOODS as keyof FileRoutesByPath,
)({
  component: BrowseFoodPage,
});
