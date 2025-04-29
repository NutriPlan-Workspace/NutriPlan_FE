import React, { useEffect, useState } from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { DiscoverHeader } from '@/molecules/DiscoverHeader';
import { DiscoverContent } from '@/organisms/DiscoverContent';
import { useLazyGetFoodsQuery } from '@/redux/query/apis/food/foodApis';
import type { Food } from '@/types/food';
import type { FoodFilterQuery } from '@/types/foodFilterQuery';
import { handleUserRoute } from '@/utils/route';

const DiscoverPageContent: React.FC = () => {
  const [page, setPage] = useState(1);
  const [foods, setFoods] = useState<Food[]>([]);
  const [filters, setFilters] = useState<Partial<FoodFilterQuery>>({});
  const [trigger, { data, isFetching }] = useLazyGetFoodsQuery();
  const [openModal, setOpenModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleFilterChange = (
    updatedFilter: Partial<FoodFilterQuery>,
    keysToRemove: (keyof FoodFilterQuery)[] = [],
  ) => {
    setHasMore(true);
    setFilters(() => {
      const cleaned = { ...updatedFilter };
      keysToRemove.forEach((key) => {
        delete cleaned[key];
      });
      return cleaned;
    });
    setPage(1);
    setFoods([]);
  };

  useEffect(() => {
    if (data?.data) {
      setFoods((prevFoods) => {
        const newFoods = data.data.filter(
          (food) => !prevFoods.some((prevFood) => prevFood._id === food._id),
        );
        if (newFoods.length < 8) {
          setHasMore(false);
        }
        return [...prevFoods, ...newFoods];
      });
    }
  }, [data]);

  useEffect(() => {
    const fetchFoods = () => {
      trigger({ page, limit: 8, ...filters });
    };
    fetchFoods();
  }, [page, filters, trigger]);

  return (
    <div className='flex h-screen flex-col'>
      <div className='flex-shrink-0'>
        <DiscoverHeader
          openModal={openModal}
          setOpenModal={setOpenModal}
          onFilterChange={(newFilters, keysToRemove = []) => {
            handleFilterChange(newFilters, keysToRemove);
          }}
        />
      </div>

      <div className='flex-1 overflow-y-auto'>
        <DiscoverContent
          foods={foods}
          isFetching={isFetching}
          onLoadMore={() => setPage((prevPage) => prevPage + 1)}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
};

const DiscoverPage: React.FC = () => <DiscoverPageContent />;

export const Route = createFileRoute(PATH.DISCOVER as keyof FileRoutesByPath)({
  component: DiscoverPage,
  beforeLoad: handleUserRoute,
});
