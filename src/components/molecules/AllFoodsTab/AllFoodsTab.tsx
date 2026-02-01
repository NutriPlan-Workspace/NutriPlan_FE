import React from 'react';

import { categoryKeys } from '@/constants/categoryKeys';
import { CategoryFood } from '@/molecules/CategoryFood';
import { useSearchFoodQuery } from '@/redux/query/apis/food/foodApis';

const categoryTitles = {
  recipe: 'Recipes',
  basicFood: 'Basic Foods',
  customRecipe: 'Custom Recipes',
  customFood: 'Custom Foods',
  collectionFoods: 'Collection Foods',
  favorites: 'Favorites',
} as const;

interface AllFoodsTabProps {
  onViewMore: (categoryKey: string) => void;
  searchText: string;
  hideActions?: boolean;
}

const AllFoodsTab: React.FC<AllFoodsTabProps> = ({
  onViewMore,
  searchText,
  hideActions,
}) => {
  const { data, isLoading } = useSearchFoodQuery({
    q: searchText,
    filters: categoryKeys,
    allSearch: true,
  });

  return (
    <div>
      {categoryKeys.map((key) => (
        <div key={key}>
          <CategoryFood
            isLoading={isLoading}
            isAllCategory={true}
            foods={data?.data?.[key]?.foods || []}
            title={categoryTitles[key]}
            onViewMore={() => onViewMore(key)}
            hideActions={hideActions}
          />
        </div>
      ))}
    </div>
  );
};

export default AllFoodsTab;
