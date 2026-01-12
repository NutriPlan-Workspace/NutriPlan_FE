import React, { useEffect, useMemo, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/atoms/Button';
import { SearchAndFilter } from '@/organisms/CustomRecipe';
import FoodGrid from '@/organisms/FoodGrid/FoodGrid';
import { useGetFoodsQuery } from '@/redux/query/apis/food/foodApis';
import HubPageShell from '@/templates/HubPageShell';
import type { Food } from '@/types/food';
import { debounceValue } from '@/utils/debounce';

const CustomeRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'foods' | 'recipes' | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const { data, isFetching } = useGetFoodsQuery({
    page: 1,
    limit: 20,
    filters: ['customFood', 'customRecipe'],
  });

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setFoods((prevFoods) => {
        const newItems = data.data.filter(
          (newItem) =>
            !prevFoods.some((prevItem) => prevItem._id === newItem._id),
        );
        return [...prevFoods, ...newItems];
      });
    }
  }, [data]);

  const debouncedChange = useMemo(
    () => (value: string) => {
      const runDebounced = debounceValue(value, 500, (v) => {
        setDebouncedSearch(v);
      });
      runDebounced();
    },
    [],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedChange(value);
  };
  const handleSortChange = (key: string) => {
    setSortOption(key);
  };

  const filteredAndSortedFoods = useMemo(() => {
    setLoading(true);
    const filteredFoods = foods
      .filter((food) => {
        const matchesSearch = food.name
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());

        const matchesTab =
          activeTab === 'foods'
            ? food.isCustom && !food.isRecipe
            : activeTab === 'recipes'
              ? food.isCustom && food.isRecipe
              : true;

        return matchesSearch && matchesTab;
      })
      .sort((a, b) => {
        if (sortOption === '1') {
          return a.name.localeCompare(b.name);
        } else if (sortOption === '2') {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      });

    setLoading(false);

    return filteredFoods;
  }, [foods, debouncedSearch, sortOption, activeTab]);

  const handleCreateRecipeClick = () => {
    navigate({ to: '/custom-recipes/create-recipe' });
  };

  const handleCustomFoodClick = () => {
    navigate({ to: '/custom-recipes/custom-food' });
  };

  return (
    <HubPageShell
      title='Custom Foods & Recipes'
      description='Create your own foods and recipes, then reuse them in plans and collections.'
      maxWidthClassName='max-w-7xl'
      actions={
        <>
          <Button
            onClick={handleCustomFoodClick}
            className='bg-secondary-100 text-secondary-800 hover:!bg-secondary-200 h-11 rounded-2xl border-none px-4 font-semibold'
          >
            <span className='flex items-center gap-2'>
              <FaPlus />
              Create custom food
            </span>
          </Button>
          <Button
            onClick={handleCreateRecipeClick}
            className='bg-secondary-400 hover:!bg-secondary-500 h-11 rounded-2xl border-none px-4 font-semibold text-white'
          >
            <span className='flex items-center gap-2'>
              <FaPlus className='text-white' />
              Create custom recipe
            </span>
          </Button>
        </>
      }
    >
      <div className='flex flex-col gap-5'>
        <SearchAndFilter
          activeTab={activeTab}
          searchValue={searchValue}
          sortOption={sortOption}
          setActiveTab={setActiveTab}
          handleInputChange={handleInputChange}
          handleSortChange={handleSortChange}
        />
        <div className='h-px bg-black/5' />
        <FoodGrid
          foods={filteredAndSortedFoods}
          isFetching={isFetching || loading}
          showPopover={false}
        />
      </div>
    </HubPageShell>
  );
};

export default CustomeRecipe;
