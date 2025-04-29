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
    <div className='flex items-center gap-4 p-4'>
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
        className='w-[350px] rounded-full py-3'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        prefix={<SearchOutlined />}
      />
    </div>
  );
};

export default DiscoverHeader;
