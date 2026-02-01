import React, { useEffect, useState } from 'react';
import { FaRegPlusSquare, FaSearch } from 'react-icons/fa';
import { useNavigate } from '@tanstack/react-router';
import { Input } from 'antd';

import { Button } from '@/atoms/Button';
import { CollectionPageSkeleton } from '@/atoms/CollectionPageSkeleton';
import { DropdownMenuWrapper } from '@/atoms/DropdownMenu';
import { PATH } from '@/constants/path';
import { CollectionList } from '@/molecules/CollectionList';
import { useGetListCollectionQuery } from '@/redux/query/apis/collection/collectionApi';
import HubPageShell from '@/templates/HubPageShell';
import type { Collection as CollectionType } from '@/types/collection';
import type { MenuItemDropdown } from '@/types/menuItem';
import { debounceValue } from '@/utils/debounce';

const dropdownItems: MenuItemDropdown[] = [
  { key: '1', label: 'Date Added' },
  { key: '2', label: 'Name' },
];

const Collection: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('1');
  const { data, isLoading, refetch } = useGetListCollectionQuery({
    page: 1,
    limit: 10,
  });
  const [sortedCollections, setSortedCollections] = useState<CollectionType[]>(
    [],
  );
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!data?.data) return;

    const debounced = debounceValue(searchValue, 300, (debouncedValue) => {
      let filtered = data.data.filter((item) =>
        item.title.toLowerCase().includes(debouncedValue.toLowerCase()),
      );

      const prioritizeDefaults = (item: CollectionType) =>
        item.isFavorites ? 2 : item.isExclusions ? 1 : 0;

      if (selectedKey === '1') {
        filtered.sort((a, b) => {
          const priority = prioritizeDefaults(b) - prioritizeDefaults(a);
          if (priority !== 0) return priority;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      } else if (selectedKey === '2') {
        filtered.sort((a, b) => {
          const priority = prioritizeDefaults(b) - prioritizeDefaults(a);
          if (priority !== 0) return priority;
          return a.title.localeCompare(b.title);
        });
      }

      setSortedCollections(filtered);
    });

    debounced();
  }, [searchValue, selectedKey, data]);

  const handleSelect = (key: string) => {
    setSelectedKey(key);
  };

  return (
    <HubPageShell
      title='Collections'
      description='Organize foods and recipes into reusable collections.'
      maxWidthClassName='max-w-7xl'
      actions={
        <Button
          onClick={() => navigate({ to: PATH.CREATE_COLLECTION })}
          className='bg-secondary-100 text-secondary-800 hover:!bg-secondary-200 h-11 rounded-2xl border-none px-4 font-semibold'
        >
          <span className='flex items-center gap-2'>
            <FaRegPlusSquare />
            Create collection
          </span>
        </Button>
      }
    >
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <Input
            size='large'
            placeholder='Search collections...'
            prefix={<FaSearch />}
            className='w-full max-w-[420px] rounded-2xl'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className='flex items-center gap-2 text-sm text-gray-700'>
            <span className='font-medium'>Sort</span>
            <DropdownMenuWrapper
              items={dropdownItems}
              defaultSelectedKey={selectedKey}
              onSelect={handleSelect}
            />
          </div>
        </div>

        <div className='h-px bg-black/5' />

        {isLoading ? (
          <CollectionPageSkeleton />
        ) : (
          <CollectionList collections={sortedCollections} />
        )}
      </div>
    </HubPageShell>
  );
};
export default Collection;
