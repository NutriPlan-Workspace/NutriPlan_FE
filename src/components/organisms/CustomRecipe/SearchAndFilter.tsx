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
  <div className='flex items-center justify-between'>
    <div className='flex items-center'>
      <Button
        className={cn(
          'rounded-r-none border-r border-gray-300 bg-white p-5 text-gray-500',
          activeTab === 'foods' && 'bg-primary border-transparent text-white',
        )}
        onClick={() => setActiveTab(activeTab === 'foods' ? null : 'foods')}
      >
        Foods
      </Button>

      <Button
        className={cn(
          'rounded-l-none border-gray-300 bg-white p-5 text-gray-500',
          activeTab === 'recipes' && 'bg-primary border-transparent text-white',
        )}
        onClick={() => setActiveTab(activeTab === 'recipes' ? null : 'recipes')}
      >
        Recipes
      </Button>

      <AntdInput
        placeholder='Search Foods...'
        suffix={<IoSearch className='h-5 w-5 text-gray-500' />}
        className='ml-4 h-[42px] w-[350px] rounded-full border border-gray-300 px-4 py-1'
        value={searchValue}
        onChange={handleInputChange}
      />
    </div>
    <div className='mr-20'>
      <DropdownMenuWrapper
        items={item}
        defaultSelectedKey={sortOption}
        onSelect={handleSortChange}
        className='min-w-[80px]'
      />
    </div>
  </div>
);

export default SearchAndFilter;
