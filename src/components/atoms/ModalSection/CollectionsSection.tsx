import React, { useEffect, useState } from 'react';
import { Checkbox, Typography } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import { useGetListCollectionQuery } from '@/redux/query/apis/collection/collectionApi';

const { Paragraph } = Typography;

interface CollectionsSectionProps {
  onFilterChange: (collectionIds: string[]) => void;
  resetTrigger: boolean;
  setSearchCollections: (value: boolean) => void;
}

const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  onFilterChange,
  resetTrigger,
  setSearchCollections,
}) => {
  const { data, isLoading, isError } = useGetListCollectionQuery({
    page: 1,
    limit: 10,
  });

  const collections = data?.data || [];

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (collections.length > 0) {
      const initialState: Record<string, boolean> = {};
      collections.forEach((col) => {
        initialState[col._id] = false;
      });
      setCheckedItems(initialState);
    }
  }, [collections]);

  useEffect(() => {
    if (resetTrigger) {
      setIsResetting(true);
      const resetState: Record<string, boolean> = {};
      collections.forEach((col) => {
        resetState[col._id] = false;
      });
      setCheckedItems(resetState);
      setSelectAll(false);
    }
  }, [resetTrigger, collections]);

  useEffect(() => {
    if (isResetting) {
      onFilterChange([]);
      setIsResetting(false);
      return;
    }

    const selectedCollectionIds = Object.keys(checkedItems).filter(
      (key) => checkedItems[key],
    );

    const isSearchAll = selectAll;

    onFilterChange(isSearchAll ? [] : selectedCollectionIds);
  }, [checkedItems, selectAll, onFilterChange, isResetting]);

  const handleSingleCheckboxChange = (id: string, checked: boolean) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: checked,
    }));

    if (!checked) {
      setSelectAll(false);
    }
  };

  const handleSelectAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    const newState: Record<string, boolean> = {};
    collections.forEach((col) => {
      newState[col._id] = checked;
    });

    setCheckedItems(newState);
    setSearchCollections(checked);
  };

  return (
    <>
      <Checkbox
        checked={selectAll}
        onChange={handleSelectAllChange}
        className='mb-2'
      >
        <Paragraph className='m-0'>Search all collections</Paragraph>
      </Checkbox>

      <Paragraph className='m-0 font-thin'>Your Collections</Paragraph>

      {isLoading && <Paragraph>Loading...</Paragraph>}
      {isError && (
        <Paragraph className='text-red-500'>
          Failed to load collections
        </Paragraph>
      )}

      <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
        {collections.map((collection) => (
          <Checkbox
            key={collection._id}
            checked={checkedItems[collection._id] || false}
            onChange={(e) =>
              handleSingleCheckboxChange(collection._id, e.target.checked)
            }
          >
            {collection.title}
          </Checkbox>
        ))}
      </div>
    </>
  );
};

export default CollectionsSection;
