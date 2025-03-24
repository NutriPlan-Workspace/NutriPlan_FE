import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { useGetFoodsQuery } from '@/redux/query/apis/food/foodApis';
import BrowseFoodTemplate from '@/templates/BrowseFoodTemplate/BrowseFoodTemplate';
import type { Food } from '@/types/food';

const BrowseFoodPage = () => {
  const [page, setPage] = useState(1);
  const [foods, setFoods] = useState<Food[]>([]);

  const { data, isFetching } = useGetFoodsQuery({ page, limit: 8 });

  useEffect(() => {
    if (data?.data) {
      setFoods((prevFoods) => [...prevFoods, ...data.data]);
    }
  }, [data]);

  return (
    <BrowseFoodTemplate
      foods={foods}
      isFetching={isFetching}
      onLoadMore={() => setPage((prev) => prev + 1)}
    />
  );
};

export const Route = createFileRoute('/browse-foods/')({
  component: BrowseFoodPage,
});
