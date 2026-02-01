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
  dataCollection: FoodCategory | undefined;
  isFetchingCollection: boolean;
  data: FoodCategory | undefined;
  isFetching: boolean;
  hideActions?: boolean;
}

const getItems = ({
  debouncedSearch,
  handleViewMore,
  selectedTabLabel,
  filter,
  dataFavorite,
  isFetchingFavorites,
  dataCollection,
  isFetchingCollection,
  data,
  isFetching,
  hideActions,
}: ItemsProps) => [
  {
    key: '1',
    label: <span className='text-[13px]'>All</span>,
    children: (
      <AllFoodsTab
        onViewMore={handleViewMore}
        searchText={debouncedSearch}
        hideActions={hideActions}
      />
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
        hideActions={hideActions}
      />
    ),
  },
  {
    key: '4',
    label: <span className='text-[13px]'>Collection</span>,
    children: (
      <CategoryFood
        foods={dataCollection?.['collectionFoods']?.foods || []}
        title='Collection Foods'
        isLoading={isFetchingCollection}
        hideActions={hideActions}
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
        hideActions={hideActions}
      />
    ),
  },
];

export default getItems;
