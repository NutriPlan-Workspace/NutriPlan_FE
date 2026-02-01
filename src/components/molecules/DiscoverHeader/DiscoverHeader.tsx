import React, { useState } from 'react';
import { GiMeal } from 'react-icons/gi';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

import { Button } from '@/atoms/Button';
import { cn } from '@/helpers/helpers';
import { useFilterModal } from '@/hooks/useFilterModal';
import { ModalFilter } from '@/molecules/ModalFilter';
import { FoodFilterQuery } from '@/types/foodFilterQuery';
import { useDebounceValue } from '@/utils/debounce';

interface DiscoverHeaderProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  onFilterChange?: (
    newFilters: Partial<FoodFilterQuery>,
    keysToRemove?: (keyof FoodFilterQuery)[],
  ) => void;
}

const DiscoverHeader: React.FC<DiscoverHeaderProps> = ({
  openModal,
  setOpenModal,
  onFilterChange,
}) => {
  const [hasFilter, setHasFilter] = useState(false);
  const { searchValue, setSearchValue } = useFilterModal();
  const [modalFilters, setModalFilters] = useState<Partial<FoodFilterQuery>>(
    {},
  );
  const debounceDelay = 500;

  const fullFilters = {
    ...modalFilters,
    q: searchValue,
  };

  useDebounceValue(fullFilters, debounceDelay, (filters) => {
    onFilterChange?.(filters, []);
  });

  return (
    <div className='flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between'>
      <Button
        className={cn(
          'flex h-11 items-center gap-2 rounded-2xl border px-4 text-gray-700 shadow-none transition',
          hasFilter
            ? 'border-primary bg-primary-50 text-primary'
            : 'border-gray-200 bg-white/70 hover:bg-white',
        )}
        onClick={() => setOpenModal(true)}
      >
        <GiMeal
          className={cn('h-5 w-5', {
            'text-primary': hasFilter,
            'text-gray-500': !hasFilter,
          })}
        />
        <span className='text-sm font-semibold'>Filters</span>
        {hasFilter && (
          <span className='bg-primary-100 text-primary-700 ml-1 rounded-full px-2 py-0.5 text-xs font-semibold'>
            Active
          </span>
        )}
      </Button>
      <ModalFilter
        open={openModal}
        onClose={() => setOpenModal(false)}
        onFilterChange={setHasFilter}
        onFiltersSubmit={(filters) => {
          setModalFilters(filters);
        }}
      />
      <Input
        placeholder='Search...'
        allowClear
        size='large'
        className='w-full rounded-2xl py-2 sm:w-[420px]'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        prefix={<SearchOutlined />}
      />
    </div>
  );
};

export default DiscoverHeader;
