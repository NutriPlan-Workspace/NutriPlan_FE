import React from 'react';
import { InputNumber, Popover, Select, Typography } from 'antd';

import {
  CATEGORIES_BY_GROUP,
  FOOD_CATEGORIES,
} from '@/constants/foodCategories';
import { NUTRITION_POPOVER_BODY_STYLE } from '@/constants/popoverStyles';
import { cn } from '@/helpers/helpers';
import { IngreResponse } from '@/types/mealPlan';
import { roundNumber } from '@/utils/roundNumber';

import { GroceryPopover } from '../GroceryPopover';

const { Link } = Typography;

interface MealCardProps {
  data: IngreResponse[];
}

const CATEGORY_LABEL_BY_ID = new Map<number, string>(
  FOOD_CATEGORIES.map((c) => [c.value, c.label]),
);

const CATEGORY_GROUP_BY_ID = new Map<number, string>();
for (const group of CATEGORIES_BY_GROUP) {
  for (const id of group.items) {
    CATEGORY_GROUP_BY_ID.set(id, group.group);
  }
  if (typeof group.mainItem === 'number') {
    CATEGORY_GROUP_BY_ID.set(group.mainItem, group.group);
  }
}

const getPrimaryCategoryLabel = (ingredient: IngreResponse) => {
  const raw = Array.isArray(ingredient.categories)
    ? ingredient.categories.filter((c): c is number => typeof c === 'number')
    : [];

  // Normalize to 1 bucket: pick the first matched group name; otherwise fallback to first category label.
  for (const id of raw) {
    const group = CATEGORY_GROUP_BY_ID.get(id);
    if (group) return group;
  }

  const first = raw[0];
  if (typeof first === 'number') {
    return CATEGORY_LABEL_BY_ID.get(first) ?? 'Others';
  }

  return 'Others';
};

const groupByCategory = (items: IngreResponse[]) => {
  const groups = new Map<string, IngreResponse[]>();
  for (const item of items) {
    const label = getPrimaryCategoryLabel(item);
    const bucket = groups.get(label);
    if (bucket) bucket.push(item);
    else groups.set(label, [item]);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
};

const GroceryCard: React.FC<MealCardProps> = ({ data }) => {
  if (!data.length) {
    return (
      <div className='w-full'>
        <div className='flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-3xl border border-white/25 bg-white/45 p-8 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/35'>
          <img
            className='h-[140px] w-[185px] opacity-90'
            src='https://res.cloudinary.com/dtwrwvffl/image/upload/v1745210117/f7w9ldxl0gs9iyv648av.png'
            alt='Empty'
            loading='lazy'
          />
          <div className='text-center'>
            <div className='text-sm font-semibold text-gray-900'>
              No items yet
            </div>
            <div className='mt-1 text-sm text-gray-600'>
              Pick a date range to generate your grocery list.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const grouped = groupByCategory(data);

  return (
    <div className='w-full space-y-7'>
      {grouped.map(([categoryLabel, items]) => (
        <section key={categoryLabel}>
          <div className='mb-3 flex items-baseline justify-between gap-3'>
            <div className='text-sm font-semibold tracking-tight text-gray-900'>
              {categoryLabel}
            </div>
            <div className='text-xs font-semibold text-gray-500'>
              {items.length} item{items.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {items.map((ingredient, index) => (
              <div
                key={(ingredient as unknown as { _id?: string })._id ?? index}
                className={cn(
                  'group rounded-3xl border border-white/25 bg-white/55 p-3',
                  'shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)]',
                  'saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/40',
                  'transition-[transform,box-shadow,background-color] duration-300 ease-out',
                  'hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-[0_22px_56px_-38px_rgba(16,24,40,0.35)]',
                )}
              >
                <div className='flex gap-3'>
                  <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/35 bg-white/70 shadow-sm'>
                    <img
                      src={ingredient.imgUrls?.[0]}
                      className='h-full w-full object-cover'
                      alt={ingredient.name}
                      loading='lazy'
                    />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <Popover
                      mouseEnterDelay={0.35}
                      placement='rightTop'
                      color='white'
                      styles={{
                        body: NUTRITION_POPOVER_BODY_STYLE,
                      }}
                      content={<GroceryPopover data={ingredient} />}
                    >
                      <Link
                        className={cn(
                          'block truncate text-[15px] font-semibold text-gray-900',
                          'hover:text-primary-700 transition-colors duration-200',
                        )}
                      >
                        {ingredient.name}
                      </Link>
                    </Popover>
                    <div className='mt-0.5 text-xs text-gray-500'>
                      Suggested total for this range
                    </div>

                    <div className='mt-3 flex flex-wrap items-center gap-2'>
                      <InputNumber
                        type='number'
                        value={roundNumber(ingredient.totalAmount, 2)}
                        controls={false}
                        className='w-28'
                        min={0}
                        step={0.1}
                        size='middle'
                      />
                      <Select
                        defaultValue={ingredient.unit?.description}
                        popupMatchSelectWidth={false}
                        className='min-w-[120px]'
                        size='middle'
                      >
                        {ingredient.units?.map((unit) => (
                          <Select.Option
                            key={unit._id}
                            value={unit.description}
                          >
                            {unit.description}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default GroceryCard;
