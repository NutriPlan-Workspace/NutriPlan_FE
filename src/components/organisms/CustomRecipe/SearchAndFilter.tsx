import React from 'react';
import { IoSearch } from 'react-icons/io5';
import { Input as AntdInput } from 'antd';

import { Button } from '@/atoms/Button';
import { DropdownMenuWrapper } from '@/atoms/DropdownMenu';
import { cn } from '@/helpers/helpers';
import type { MenuItemDropdown } from '@/types/menuItem';

interface SearchAndFilterProps {
  activeTab: 'foods' | 'recipes' | null;
  searchValue: string;
  sortOption: string;
  setActiveTab: (tab: 'foods' | 'recipes' | null) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSortChange: (key: string) => void;
}

const item: MenuItemDropdown[] = [
  { key: '1', label: 'Name' },
  { key: '2', label: 'Recent' },
];

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  activeTab,
  searchValue,
  sortOption,
  setActiveTab,
  handleInputChange,
  handleSortChange,
}) => (
  <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
      <div className='inline-flex overflow-hidden rounded-2xl border border-gray-200 bg-white/70 shadow-[0_10px_26px_-22px_rgba(16,24,40,0.25)]'>
        <Button
          className={cn(
            'h-11 rounded-none border-0 px-4 text-sm font-semibold',
            activeTab === 'foods'
              ? '!bg-primary !text-white'
              : '!bg-transparent !text-gray-700 hover:!bg-white',
          )}
          onClick={() => setActiveTab(activeTab === 'foods' ? null : 'foods')}
        >
          Foods
        </Button>

        <div className='w-px bg-gray-200' />

        <Button
          className={cn(
            'h-11 rounded-none border-0 px-4 text-sm font-semibold',
            activeTab === 'recipes'
              ? '!bg-primary !text-white'
              : '!bg-transparent !text-gray-700 hover:!bg-white',
          )}
          onClick={() =>
            setActiveTab(activeTab === 'recipes' ? null : 'recipes')
          }
        >
          Recipes
        </Button>
      </div>

      <AntdInput
        placeholder='Search your custom items...'
        suffix={<IoSearch className='h-5 w-5 text-gray-500' />}
        className='h-11 w-full rounded-2xl border border-gray-200 bg-white/70 px-4 py-1 sm:w-[420px]'
        value={searchValue}
        onChange={handleInputChange}
      />
    </div>

    <div className='flex items-center gap-2 text-sm text-gray-700'>
      <span className='font-medium'>Sort</span>
      <DropdownMenuWrapper
        items={item}
        defaultSelectedKey={sortOption}
        onSelect={handleSortChange}
        className='min-w-[90px]'
      />
    </div>
  </div>
);

export default SearchAndFilter;
