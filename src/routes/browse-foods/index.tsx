import { useEffect, useState } from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { ScaleProvider } from '@/contexts/ScaleContext';
import { ScaleProviderIngre } from '@/contexts/ScaleIngreContext';
import { useGetFoodsQuery } from '@/redux/query/apis/food/foodApis';
import BrowseFoodTemplate from '@/templates/BrowseFoodTemplate/BrowseFoodTemplate';
import type { Food } from '@/types/food';

const BrowseFoodPage = () => {
  const [page, setPage] = useState(1);
  const [foods, setFoods] = useState<Food[]>([]);

  const { data, isFetching } = useGetFoodsQuery({ page, limit: 8 });

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setFoods((prevFoods) => [
        ...prevFoods,
        // eslint-disable-next-line no-unsafe-optional-chaining
        ...(Array.isArray(data?.data) ? data?.data : []),
      ]);
    }
  }, [data]);

  return (
    <ScaleProvider>
      <ScaleProviderIngre>
        <BrowseFoodTemplate
          foods={foods}
          isFetching={isFetching}
          onLoadMore={() => setPage((prev) => prev + 1)}
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
