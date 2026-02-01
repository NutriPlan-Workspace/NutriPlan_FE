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
    <div className='flex w-full flex-col items-center gap-4 md:flex-row md:justify-center'>
      <Button
        className={cn(
          'flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 shadow-sm',
          { 'border-emerald-300 text-emerald-600': hasFilter },
        )}
        onClick={() => setOpenModal(true)}
      >
        <GiMeal
          className={cn('h-5 w-5 text-gray-500', {
            'text-emerald-500': hasFilter,
          })}
        />
        Filters
      </Button>

      <AntdInput
        placeholder='Search foods, cuisines, ingredients...'
        suffix={<IoSearch className='h-5 w-5 text-gray-500' />}
        className='h-11 w-full max-w-xl rounded-full border border-gray-200 px-4 py-1 text-sm'
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
  );
};

export default SearchInput;
