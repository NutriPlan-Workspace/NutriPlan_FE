import React, { useEffect, useMemo, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { Typography } from 'antd';

import { Button } from '@/atoms/Button';
import { SearchAndFilter } from '@/organisms/CustomRecipe';
import FoodGrid from '@/organisms/FoodGrid/FoodGrid';
import { useGetFoodsQuery } from '@/redux/query/apis/food/foodApis';
import type { Food } from '@/types/food';
import { debounceValue } from '@/utils/debounce';

const { Title, Paragraph } = Typography;

const CustomeRecipe: React.FC = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'foods' | 'recipes' | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const { data, isFetching, refetch } = useGetFoodsQuery({
    page: 1,
    limit: 20,
    filters: ['customFood', 'customRecipe'],
  });

  useEffect(() => {
    refetch();
  }, [router, refetch]);

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

  return (
    <div className='flex flex-col gap-4 p-5'>
      <div>
        <Title level={3} className='m-0 font-thin'>
          Custom Foods & Recipes
        </Title>
        <Paragraph className='font-thin text-gray-400'>
          Can&apos;t find your home-made meal? Create one below or use our{' '}
        </Paragraph>
      </div>

      <div className='flex items-center gap-2'>
        <Button className='bg-primary flex items-center gap-2 border-transparent p-5 hover:border-transparent'>
          <FaPlus className='text-white' />
          <Paragraph className='m-0 font-thin text-white'>
            Create Custom Food
          </Paragraph>
        </Button>
        <Button
          className='bg-primary flex items-center gap-2 border-transparent p-5 hover:border-transparent'
          onClick={handleCreateRecipeClick}
        >
          <FaPlus className='text-white' />
          <Paragraph className='m-0 font-thin text-white'>
            Create Custom Recipe
          </Paragraph>
        </Button>
      </div>

      <div className='mt-5'>
        <SearchAndFilter
          activeTab={activeTab}
          searchValue={searchValue}
          sortOption={sortOption}
          setActiveTab={setActiveTab}
          handleInputChange={handleInputChange}
          handleSortChange={handleSortChange}
        />
        <div className='mt-10 mb-30 flex-1'>
          <FoodGrid
            foods={filteredAndSortedFoods}
            isFetching={isFetching || loading}
            showPopover={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomeRecipe;
