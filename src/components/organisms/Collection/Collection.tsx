import React, { useEffect, useState } from 'react';
import { FaRegPlusSquare, FaSearch } from 'react-icons/fa';
import { useNavigate } from '@tanstack/react-router';
import { Input, Typography } from 'antd';

import { Button } from '@/atoms/Button';
import { CollectionPageSkeleton } from '@/atoms/CollectionPageSkeleton';
import { DropdownMenuWrapper } from '@/atoms/DropdownMenu';
import { PATH } from '@/constants/path';
import { CollectionList } from '@/molecules/CollectionList';
import { useGetListCollectionQuery } from '@/redux/query/apis/collection/collectionApi';
import type { Collection as CollectionType } from '@/types/collection';
import type { MenuItemDropdown } from '@/types/menuItem';
import { debounceValue } from '@/utils/debounce';

const { Title, Paragraph } = Typography;

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
  }, []);

  useEffect(() => {
    if (!data?.data) return;

    const debounced = debounceValue(searchValue, 300, (debouncedValue) => {
      let filtered = data.data.filter((item) =>
        item.title.toLowerCase().includes(debouncedValue.toLowerCase()),
      );

      if (selectedKey === '1') {
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      } else if (selectedKey === '2') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }

      setSortedCollections(filtered);
    });

    debounced();
  }, [searchValue, selectedKey, data]);

  const handleSelect = (key: string) => {
    setSelectedKey(key);
  };

  return (
    <div className='flex flex-col gap-4 p-5'>
      <Title level={3} className='font-thin'>
        Collections
      </Title>
      <Button
        className='hover:border-primary flex max-w-[200px] items-center justify-center gap-4 py-4 hover:text-black'
        onClick={() => navigate({ to: PATH.CREATE_COLLECTION })}
      >
        <FaRegPlusSquare />
        <Paragraph className='m-0'>Create collection</Paragraph>
      </Button>
      <div className='flex max-w-[800px] items-center justify-between'>
        <Input
          size='large'
          placeholder='Search...'
          prefix={<FaSearch />}
          className='max-w-[250px]'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className='flex items-center gap-2'>
          <label>Sort By: </label>
          <DropdownMenuWrapper
            items={dropdownItems}
            defaultSelectedKey={selectedKey}
            onSelect={handleSelect}
          />
        </div>
      </div>
      <Title level={3} className='mt-4 mb-0 font-thin'>
        My Collections
      </Title>
      {isLoading ? (
        <CollectionPageSkeleton />
      ) : (
        <div className='flex w-full items-center gap-4'>
          <CollectionList collections={sortedCollections} />
        </div>
      )}
    </div>
  );
};
export default Collection;
