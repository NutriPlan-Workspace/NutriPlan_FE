import React, { useCallback, useMemo, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { skipToken } from '@reduxjs/toolkit/query';
import { Input, Spin } from 'antd';
import {
  addDays,
  differenceInDays,
  endOfWeek,
  startOfWeek,
  subDays,
} from 'date-fns';

import { RangeDatePicker } from '@/atoms/RangeDatePicker';
import { GroceryCard } from '@/molecules/GroceryCard';
import PantryPanel from '@/organisms/PantryPanel/PantryPanel';
import { useGetGroceriesQuery } from '@/redux/query/apis/mealPlan/mealPlanApi';
import {
  useGetPantryItemsQuery,
  useUpsertPantryItemMutation,
} from '@/redux/query/apis/pantry/pantryApi';
import HubPageShell from '@/templates/HubPageShell';
import { DateRange } from '@/types/date';
import { getMealDate } from '@/utils/dateUtils';

const getWeekRangeForDate = (date: Date): DateRange => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 }); // Sunday
  return { from: start, to: end };
};

const GroceriesContent: React.FC = () => {
  // State for value
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() =>
    getWeekRangeForDate(new Date()),
  );

  // Compute date range for API query
  const { from, to } =
    dateRange?.from && dateRange?.to
      ? { from: getMealDate(dateRange.from), to: getMealDate(dateRange.to) }
      : {};

  const shouldFetchGroceries = Boolean(from && to);

  const { data, isFetching } = useGetGroceriesQuery(
    shouldFetchGroceries ? { from: from!, to: to! } : skipToken,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );
  const { data: pantryData } = useGetPantryItemsQuery({});
  const [upsertPantryItem] = useUpsertPantryItemMutation();
  const [search, setSearch] = useState('');

  // Handle date range selection - Custom Range Logic
  const handleRangeSelect = useCallback((newRange?: DateRange) => {
    setDateRange(newRange);
  }, []);

  // Handlers to navigate logic
  const goToPrevWeek = useCallback(() => {
    setDateRange((prev) => {
      if (!prev?.from) return getWeekRangeForDate(subDays(new Date(), 7));
      const days = prev.to ? differenceInDays(prev.to, prev.from) + 1 : 7;
      return {
        from: subDays(prev.from, days),
        to: prev.to ? subDays(prev.to, days) : undefined,
      };
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    setDateRange((prev) => {
      if (!prev?.from) return getWeekRangeForDate(addDays(new Date(), 7));
      const days = prev.to ? differenceInDays(prev.to, prev.from) + 1 : 7;
      return {
        from: addDays(prev.from, days),
        to: prev.to ? addDays(prev.to, days) : undefined,
      };
    });
  }, []);

  const goToThisWeek = useCallback(() => {
    setDateRange(getWeekRangeForDate(new Date()));
  }, []);

  const pantryIngredientIds = useMemo(
    () =>
      new Set(
        (pantryData?.data ?? [])
          .map((item) => item.ingredientFoodId)
          .filter((id): id is string => Boolean(id)),
      ),
    [pantryData?.data],
  );

  const filteredGroceries = useMemo(() => {
    const list = data?.data ?? [];
    const keyword = search.trim().toLowerCase();
    if (!keyword) return list;
    return list.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [data?.data, search]);

  const todayCoverage = useMemo(() => {
    const pantryItems = pantryData?.data ?? [];
    const groceries = data?.data ?? [];
    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];
    if (!groceries.length) return null;

    let neededCount = 0;
    let coveredCount = 0;

    for (const ingredient of groceries) {
      const todaysAmount = ingredient.foodDetails
        .filter((detail) => detail.date.split('T')[0] === todayKey)
        .reduce((acc, detail) => acc + (detail.amount ?? 0), 0);

      if (!todaysAmount) continue;
      neededCount += 1;
      const pantryItem = pantryItems.find(
        (item) => item.ingredientFoodId === ingredient._id,
      );
      if (!pantryItem) continue;
      if (pantryItem.unit !== ingredient.unit?.description) continue;
      if (pantryItem.quantity >= todaysAmount) {
        coveredCount += 1;
      }
    }

    if (neededCount === 0) return null;
    const percent = Math.round((coveredCount / neededCount) * 100);
    return { coveredCount, neededCount, percent };
  }, [data?.data, pantryData?.data]);

  const buttonClass =
    'flex h-10 items-center justify-center rounded-2xl border border-gray-200 bg-white/90 px-3 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-gray-900 active:bg-gray-50';
  const iconButtonClass = 'w-10 px-0 text-gray-700 hover:bg-gray-50';

  return (
    <HubPageShell
      title='Groceries'
      description='A combined ingredient list for your selected meal plan range.'
      actions={
        <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end'>
          {/* Navigation Controls - Custom Style */}
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={goToPrevWeek}
              className={`${buttonClass} ${iconButtonClass}`}
              title='Previous 7 days'
            >
              <FaAngleLeft className='h-4 w-4' />
            </button>

            <button
              type='button'
              onClick={goToThisWeek}
              className={`${buttonClass} px-4`}
            >
              This Week
            </button>

            {/* Range Picker Input */}
            <RangeDatePicker
              selectedRange={dateRange}
              onSelect={handleRangeSelect}
            />

            <button
              type='button'
              onClick={goToNextWeek}
              className={`${buttonClass} ${iconButtonClass}`}
              title='Next 7 days'
            >
              <FaAngleRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      }
      maxWidthClassName='max-w-[1200px]'
    >
      <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
        <div>
          {!data?.data ? (
            <div className='flex min-h-[420px] items-center justify-center rounded-3xl border border-white/25 bg-white/45 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/35'>
              <Spin size='large' />
            </div>
          ) : (
            <div
              className={`flex h-full flex-col transition-opacity duration-300 ${
                isFetching ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
                <div>
                  <p className='text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase'>
                    Groceries
                  </p>
                  <p className='mt-1 text-sm text-slate-600'>
                    Track ingredients and move items to pantry.
                  </p>
                  {todayCoverage && (
                    <div className='border-primary-100 bg-primary-50 text-primary-700 mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold'>
                      Today covered: {todayCoverage.percent}%
                      <span className='text-primary-600 text-[11px]'>
                        ({todayCoverage.coveredCount}/
                        {todayCoverage.neededCount})
                      </span>
                    </div>
                  )}
                </div>
                <Input
                  placeholder='Search groceries...'
                  allowClear
                  value={search}
                  size='middle'
                  onChange={(event) => setSearch(event.target.value)}
                  className='w-full rounded-l sm:w-[320px]'
                />
              </div>
              <div className='max-h-[72vh] overflow-y-auto pr-2'>
                <GroceryCard
                  data={filteredGroceries}
                  pantryIngredientIds={pantryIngredientIds}
                  onTogglePantry={async (ingredient, checked) => {
                    if (!checked) return;
                    await upsertPantryItem({
                      ingredientFoodId: ingredient._id,
                      name: ingredient.name,
                      quantity: ingredient.totalAmount,
                      unit: ingredient.unit?.description ?? 'serving',
                      status: 'in_pantry',
                      imgUrl: ingredient.imgUrls?.[0],
                    }).unwrap();
                  }}
                  onAddToNeedBuy={async (ingredient) => {
                    await upsertPantryItem({
                      ingredientFoodId: ingredient._id,
                      name: ingredient.name,
                      quantity: ingredient.totalAmount,
                      unit: ingredient.unit?.description ?? 'serving',
                      status: 'need_buy',
                      imgUrl: ingredient.imgUrls?.[0],
                    }).unwrap();
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <PantryPanel groceries={data?.data ?? []} foodImgById={{}} />
      </div>
    </HubPageShell>
  );
};

export default GroceriesContent;
