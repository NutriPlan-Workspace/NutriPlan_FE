import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';
import { Input as AntdInput, Tabs } from 'antd';

import { Button } from '@/atoms/Button';
import { TabActionMenu } from '@/atoms/TabActionMenu';
import { PLAN_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { cn } from '@/helpers/helpers';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useSearchFoodQuery } from '@/redux/query/apis/food/foodApis';
import { debounceValue } from '@/utils/debounce';
import { getItemsSelected } from '@/utils/foodCategory';

import getItems from './CategoryItem';

interface SideAddFoodProps {
  setFilterFood: (value: boolean) => void;
}

const SideAddFood: React.FC<SideAddFoodProps> = ({ setFilterFood }) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuItem, setMenuItem] = useState(false);
  const [selectedTabLabel, setSelectedTabLabel] = useState('Recent Foods');
  const [filter, setFilter] = useState<string>('recent');
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const { selectedPlan } = useDate();

  const isWeekly = useMemo(
    () => selectedPlan === PLAN_TYPES.WEEKLY_VIEW,
    [selectedPlan],
  );

  useEffect(() => {
    const handler = debounceValue(searchText, 500, setDebouncedSearch);
    handler();
  }, [searchText]);

  useClickOutside(() => {
    setMenuItem(false);
  }, [menuRef, dropDownRef]);

  const { data: dataFavorite, isFetching: isFetchingFavorites } =
    useSearchFoodQuery({
      q: debouncedSearch,
      filters: ['favorites'],
      allSearch: false,
    });

  const { data, isFetching } = useSearchFoodQuery({
    q: debouncedSearch,
    filters: [filter],
    allSearch: false,
  });

  const handleViewMore = (selectedKey: string) => {
    const item = getItemsSelected(selectedKey);
    if (!item) return;
    setSelectedTabLabel(item.label);
    setActiveTabKey('3');
    setFilter(item.filter);
  };

  const items = getItems({
    debouncedSearch,
    handleViewMore,
    selectedTabLabel,
    filter,
    dataFavorite: dataFavorite?.data,
    isFetchingFavorites,
    data: data?.data,
    isFetching,
  });

  const handleMenuSelect = (selectedKey: string) => {
    const existingTab = items.find((item) => item.key === selectedKey);
    if (existingTab) {
      setActiveTabKey(selectedKey);
    } else {
      const item = getItemsSelected(selectedKey);
      if (!item) return;
      setSelectedTabLabel(item.label);
      setActiveTabKey('3');
      setFilter(item.filter);
    }
    setTimeout(() => setMenuItem(false), 0);
  };

  return (
    <div
      className={cn('w-full flex-col gap-2 rounded-sm py-1 pl-2', {
        'sticky top-10 left-0': isWeekly,
      })}
    >
      <div className='flex w-full items-center justify-between gap-2 p-1'>
        <AntdInput
          placeholder='Search Foods...'
          suffix={<IoSearch className='h-5 w-5 text-gray-500' />}
          className='h-[45px] w-[300px] rounded-full border border-black px-4 py-1'
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
        <Button
          className='hover:bg-primary-100 rounded-md border-none py-5 text-black'
          onClick={() => setFilterFood(false)}
        >
          <IoClose className='h-5 w-5' />
        </Button>
      </div>
      <div className='scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-transparent ml-2 flex h-full max-h-[calc(100vh-180px)] max-w-[285px] min-w-[150px] flex-col gap-2 overflow-y-scroll rounded-sm pr-1'>
        <div className='relative flex w-full items-start gap-2'>
          <Tabs
            activeKey={activeTabKey}
            items={items}
            onChange={(key: string) => setActiveTabKey(key)}
            className='w-full'
            tabBarExtraContent={
              <TabActionMenu
                dropDownRef={dropDownRef}
                menuRef={menuRef}
                menuItem={menuItem}
                setMenuItem={setMenuItem}
                selectedTabLabel={selectedTabLabel}
                onSelect={handleMenuSelect}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SideAddFood;
