import { AllFoodsTab } from '@/molecules/AllFoodsTab';
import { CategoryFood } from '@/molecules/CategoryFood';
import type { FoodCategory } from '@/types/food';

interface ItemsProps {
  debouncedSearch: string;
  handleViewMore: (selectedKey: string) => void;
  selectedTabLabel: string;
  filter: string;
  dataFavorite: FoodCategory | undefined;
  isFetchingFavorites: boolean;
  data: FoodCategory | undefined;
  isFetching: boolean;
}

const getItems = ({
  debouncedSearch,
  handleViewMore,
  selectedTabLabel,
  filter,
  dataFavorite,
  isFetchingFavorites,
  data,
  isFetching,
}: ItemsProps) => [
  {
    key: '1',
    label: <span className='text-[13px]'>All</span>,
    children: (
      <AllFoodsTab onViewMore={handleViewMore} searchText={debouncedSearch} />
    ),
  },
  {
    key: '2',
    label: <span className='text-[13px]'>Favorite</span>,
    children: (
      <CategoryFood
        foods={dataFavorite?.['favorites']?.foods || []}
        title='Favorites'
        isLoading={isFetchingFavorites}
      />
    ),
  },
  {
    key: '3',
    label: <span className='text-[13px]'>{selectedTabLabel}</span>,
    children: (
      <CategoryFood
        foods={data?.[filter]?.foods || []}
        title={selectedTabLabel}
        isLoading={isFetching}
      />
    ),
  },
];

export default getItems;
