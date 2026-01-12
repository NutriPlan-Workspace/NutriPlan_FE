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
  setFilterFood?: (value: boolean) => void;
  onClose?: () => void;
  className?: string;
  variant?: 'sidebar' | 'dock';
  showClose?: boolean;
}

const SideAddFood: React.FC<SideAddFoodProps> = ({
  setFilterFood,
  onClose,
  className,
  variant = 'sidebar',
  showClose,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuItem, setMenuItem] = useState(false);
  const [selectedTabLabel, setSelectedTabLabel] = useState('Collection Foods');
  const [filter, setFilter] = useState<string>('collectionFoods');
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const { selectedPlan } = useDate();

  const handleClose = () => {
    onClose?.();
    setFilterFood?.(false);
  };

  const shouldShowClose = useMemo(() => {
    if (typeof showClose === 'boolean') return showClose;
    return variant === 'sidebar';
  }, [showClose, variant]);

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
      className={cn(
        'flex w-full flex-col gap-2',
        variant === 'sidebar' && 'rounded-sm py-1 pl-2',
        variant === 'dock' && 'rounded-2xl p-2',
        {
          'sticky top-10 left-0': variant === 'sidebar' && isWeekly,
        },
        className,
      )}
    >
      <div
        className={cn(
          'flex w-full items-center justify-between gap-2',
          variant === 'dock' ? 'p-0' : 'p-1',
        )}
      >
        <AntdInput
          placeholder='Search Foods...'
          suffix={
            <IoSearch
              className={cn(
                'text-gray-500',
                variant === 'dock' ? 'h-4 w-4' : 'h-5 w-5',
              )}
            />
          }
          className={cn(
            'rounded-full border border-gray-200 bg-white px-4 py-1 text-sm',
            variant === 'dock' ? 'h-[38px] w-full' : 'h-[45px] w-[300px]',
          )}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />

        {shouldShowClose && (
          <Button
            className={cn(
              'rounded-full border-none text-gray-700 hover:bg-gray-100',
              variant === 'dock' ? 'h-[38px] w-[38px] p-0' : 'py-5',
            )}
            onClick={handleClose}
          >
            <IoClose
              className={cn(variant === 'dock' ? 'h-4 w-4' : 'h-5 w-5')}
            />
          </Button>
        )}
      </div>

      <div
        className={cn(
          'side-add-scroll flex w-full flex-col gap-2 overflow-y-auto pr-0',
          variant === 'sidebar'
            ? 'ml-2 h-full max-h-[calc(100vh-180px)] max-w-[285px] min-w-[150px] rounded-sm'
            : 'max-h-full',
        )}
      >
        <div className='relative flex w-full items-start gap-2'>
          <Tabs
            activeKey={activeTabKey}
            items={items}
            onChange={(key: string) => setActiveTabKey(key)}
            className='side-add-tabs w-full'
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
