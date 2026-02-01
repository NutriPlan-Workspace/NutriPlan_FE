import { useEffect, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { useGetCuratedCollectionsQuery } from '@/redux/query/apis/collection/collectionApi';
import { useGetFoodsQuery } from '@/redux/query/apis/food/foodApis';
import BrowseFoodTemplate from '@/templates/BrowseFoodTemplate/BrowseFoodTemplate';
import type { Collection } from '@/types/collection';
import type { Food } from '@/types/food';
import type { FoodFilterQuery } from '@/types/foodFilterQuery';
import { handlePublicRoute } from '@/utils/route';

const BrowseFoodPage = () => {
  const [activeTab, setActiveTab] = useState<'foods' | 'collections'>('foods');
  const [page, setPage] = useState(1);
  const [foods, setFoods] = useState<Food[]>([]);
  const [filters, setFilters] = useState<Partial<FoodFilterQuery>>({});
  const [isUpdatingFilters, setIsUpdatingFilters] = useState(false);
  const { data, isFetching } = useGetFoodsQuery({ page, limit: 8, ...filters });
  const isLastPage = (data && data.data?.length < 8) || false;

  // Collection State
  const [curatedPage, setCuratedPage] = useState(1);
  const [curatedCollections, setCuratedCollections] = useState<Collection[]>(
    [],
  );
  const [hasMoreCurated, setHasMoreCurated] = useState(true);

  // Skip query if not active tab (or always fetch? efficient to skip)
  // Ensure we import skipToken if needed, or just control with 'skip' option if API supports it,
  // or just pass fetched data only when active.
  // Actually standard pattern: fetch if activeTab is collections.
  const { data: curatedData, isFetching: isFetchingCurated } =
    useGetCuratedCollectionsQuery(
      activeTab === 'collections' ? { page: curatedPage, limit: 6 } : skipToken,
    );

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

  // Handle Curated Data
  useEffect(() => {
    if (!curatedData?.data?.items) return;
    setCuratedCollections((prev) => {
      // Filter duplicates if any
      const newItems = curatedData.data.items.filter(
        (collection) => !prev.some((item) => item._id === collection._id),
      );
      if (newItems.length < 6) {
        setHasMoreCurated(false);
      }
      return [...prev, ...newItems];
    });
  }, [curatedData]);

  return (
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
      activeTab={activeTab}
      onTabChange={setActiveTab}
      curatedCollections={curatedCollections}
      isFetchingCurated={isFetchingCurated}
      onLoadMoreCurated={() => setCuratedPage((p) => p + 1)}
      hasMoreCurated={hasMoreCurated}
    />
  );
};

export const Route = createFileRoute(
  PATH.BROWSE_FOODS as keyof FileRoutesByPath,
)({
  component: BrowseFoodPage,
  beforeLoad: handlePublicRoute,
});
