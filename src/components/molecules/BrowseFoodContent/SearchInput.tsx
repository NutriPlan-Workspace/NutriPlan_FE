import React, { useEffect, useRef, useState } from 'react';
import { GiMeal } from 'react-icons/gi';
import { IoSearch } from 'react-icons/io5';
import { Input as AntdInput } from 'antd';

import { Button } from '@/atoms/Button';
import { cn } from '@/helpers/helpers';
import { useFilterModal } from '@/hooks/useFilterModal';
import { ModalFilter } from '@/molecules/ModalFilter';
import type { FoodFilterQuery } from '@/types/foodFilterQuery';

interface SearchInputProps {
  onFilterChange?: (
    newFilters: Partial<FoodFilterQuery>,
    keysToRemove?: (keyof FoodFilterQuery)[],
  ) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onFilterChange }) => {
  const [openModal, setOpenModal] = useState(false);
  const [hasFilter, setHasFilter] = useState(false);
  const { searchValue, setSearchValue } = useFilterModal();
  const [debouncedValue, setDebouncedValue] = useState('');
  const lastSentValue = useRef('');
  const [modalFilters, setModalFilters] = useState<Partial<FoodFilterQuery>>(
    {},
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    const fullFilters = {
      ...modalFilters,
      q: debouncedValue,
    };

    const serialized = JSON.stringify(fullFilters);
    if (serialized !== lastSentValue.current) {
      lastSentValue.current = serialized;
      onFilterChange?.(fullFilters, []);
    }
  }, [debouncedValue, modalFilters, onFilterChange]);

  return (
    <div className='flex w-full justify-center'>
      <div className='flex items-center gap-4'>
        <Button
          className={cn(
            'flex h-[45px] items-center gap-2 border border-black text-gray-600',
            { 'border-primary text-primary': hasFilter },
          )}
          onClick={() => setOpenModal(true)}
        >
          <GiMeal
            className={cn('h-6 w-6 text-gray-500', {
              'text-primary': hasFilter,
            })}
          />
          Filters
        </Button>

        <AntdInput
          placeholder='Search Foods...'
          suffix={<IoSearch className='h-5 w-5 text-gray-500' />}
          className='h-[45px] w-[350px] rounded-full border border-black px-4 py-1 italic'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <ModalFilter
          open={openModal}
          onClose={() => setOpenModal(false)}
          onFilterChange={setHasFilter}
          onFiltersSubmit={(filters) => {
            setModalFilters(filters);
          }}
        />
      </div>
    </div>
  );
};

export default SearchInput;
