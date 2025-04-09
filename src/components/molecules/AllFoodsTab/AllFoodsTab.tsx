import React, { useEffect, useState } from 'react';

import { categoryKeys } from '@/constants/categoryKeys';
import { CategoryFood } from '@/molecules/CategoryFood';
import { useSearchFoodQuery } from '@/redux/query/apis/food/foodApis';
import type { Food } from '@/types/food';
import { getRecentFoods } from '@/utils/localStorage';

const categoryTitles = {
  recent: 'Recent Foods',
  recipe: 'Recipes',
  basicFood: 'Basic Foods',
  customRecipe: 'Custom Recipes',
  customFood: 'Custom Foods',
} as const;

interface AllFoodsTabProps {
  onViewMore: (categoryKey: string) => void;
  searchText: string;
}

const AllFoodsTab: React.FC<AllFoodsTabProps> = ({
  onViewMore,
  searchText,
}) => {
  const [recentFoods, setRecentFoods] = useState<Food[]>([]);

  useEffect(() => {
    setRecentFoods(getRecentFoods());
  }, []);

  const { data, isLoading } = useSearchFoodQuery({
    q: searchText,
    filters: categoryKeys,
    allSearch: true,
  });

  return (
    <div>
      <div>
        <CategoryFood
          isRecent={true}
          foods={recentFoods}
          title='Recent Foods'
          isLoading={isLoading}
        />
      </div>

      {categoryKeys.map((key) => (
        <div key={key}>
          <CategoryFood
            isLoading={isLoading}
            isAllCategory={true}
            foods={data?.data?.[key]?.foods || []}
            title={categoryTitles[key]}
            onViewMore={() => onViewMore(key)}
          />
        </div>
      ))}
    </div>
  );
};

export default AllFoodsTab;
