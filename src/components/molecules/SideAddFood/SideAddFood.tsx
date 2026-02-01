import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Input as AntdInput, Tabs } from 'antd';

import { Button } from '@/atoms/Button';
import { TabActionMenu } from '@/atoms/TabActionMenu';
import { PLAN_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { cn } from '@/helpers/helpers';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useSearchFoodQuery } from '@/redux/query/apis/food/foodApis';
import { setDockSearchQuery } from '@/redux/slices/mealPlan/mealPlanReducer';
import { RootState } from '@/redux/store';
import { useDebounceValue } from '@/utils/debounce';
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
  const dispatch = useDispatch();
  const reduxSearchText = useSelector(
    (state: RootState) => state.mealPlan.dockSearchQuery,
  );
  // specific local state for input to allow debounce
  const [localSearchText, setLocalSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const { selectedPlan } = useDate();

  useEffect(() => {
    // Sync local state when redux changes (e.g. from Chatbot)
    if (reduxSearchText !== localSearchText) {
      setLocalSearchText(reduxSearchText);
      setDebouncedSearch(reduxSearchText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxSearchText]);

  useEffect(() => {
    // When local input changes, debounce and update both local debounced and redux (if user typing)
    // We only update redux on debounce to avoid too many dispatches, or we can update redux immediately?
    // Let's update redux immediately on change so other components (like header) know?
    // Actually best to keep redux as source of truth.
    // But for input we need local state to not lag.
    // Logic:
    // User types -> localSearchText updates -> debounce -> setDebouncedSearch -> update Redux?
    // Chatbot updates Redux -> localSearchText updates.
    // Simplified:
    // User types -> setLocalSearchText -> debounce -> setDebouncedSearch AND dispatch(setDockSearchQuery)
  }, []);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearchText(val);
    // Debounce dispatching to redux to avoid jitter if used elsewhere,
    // OR dispatch immediately if we want instant feedback?
    // Let's debounce the redux update or just update it.
    // For now, let's just make the input controlled by local state, and sync to/from Redux.
  };

  useDebounceValue(localSearchText, 500, (val) => {
    setDebouncedSearch(val);
    // Only dispatch if different to avoid loop
    if (val !== reduxSearchText) {
      dispatch(setDockSearchQuery(val));
    }
  });

  useClickOutside(() => {
    setMenuItem(false);
  }, [menuRef, dropDownRef]);

  const { data: dataFavorite, isFetching: isFetchingFavorites } =
    useSearchFoodQuery({
      q: debouncedSearch,
      filters: ['favorites'],
      allSearch: false,
    });

  const { data: dataCollection, isFetching: isFetchingCollection } =
    useSearchFoodQuery({
      q: debouncedSearch,
      filters: ['collectionFoods'],
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
    dataCollection: dataCollection?.data,
    isFetchingCollection,
    data: data?.data,
    isFetching,
    hideActions: variant === 'dock',
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
          onChange={onSearchChange}
          value={localSearchText}
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
          'side-add-scroll flex w-full flex-col gap-2 overflow-x-hidden overflow-y-auto pr-0',
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
