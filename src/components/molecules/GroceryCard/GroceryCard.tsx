import React, { useCallback, useEffect, useRef } from 'react';
import {
  HiOutlineArchiveBoxArrowDown,
  HiOutlineShoppingBag,
} from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { EyeOutlined } from '@ant-design/icons';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Image, Popover, Tooltip, Typography } from 'antd';
import invariant from 'tiny-invariant';

import CompactAmountInput from '@/components/atoms/CompactAmountInput/CompactAmountInput';
import {
  CATEGORIES_BY_GROUP,
  FOOD_CATEGORIES,
} from '@/constants/foodCategories';
import { NUTRITION_POPOVER_BODY_STYLE } from '@/constants/popoverStyles';
import { cn } from '@/helpers/helpers';
import {
  setIsModalDetailOpen,
  setViewingDetailFood,
} from '@/redux/slices/food';
import {
  setDraggingCardHeight,
  setIsDragging,
} from '@/redux/slices/pantry/pantrySlice';
import type { MealPlanFood } from '@/types/mealPlan';
import { IngreResponse } from '@/types/mealPlan';
import { roundNumber } from '@/utils/roundNumber';

import { GroceryPopover } from '../GroceryPopover';

const { Link } = Typography;

const FALLBACK_INGREDIENT_IMAGE =
  'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/whuexhkydv7ubiqh5rxe.jpg';

interface MealCardProps {
  data: IngreResponse[];
  pantryIngredientIds?: Set<string>;
  onTogglePantry?: (ingredient: IngreResponse, checked: boolean) => void;
  onAddToNeedBuy?: (ingredient: IngreResponse) => void;
}

const GroceryDraggableItem: React.FC<{
  ingredient: IngreResponse;
  children: React.ReactNode;
}> = ({ ingredient, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const el = ref.current;
    invariant(el, 'GroceryDraggableItem element is not defined');

    // mark element for CSS targeting
    el.dataset.groceryCard = 'true';

    return draggable({
      element: el,
      getInitialData: () => ({
        type: 'grocery',
        ingredientFoodId: ingredient._id,
        name: ingredient.name,
        quantity: ingredient.totalAmount,
        unit: ingredient.unit?.description ?? 'serving',
        height: el.clientHeight,
        imgUrls: ingredient.imgUrls,
        fullData: ingredient, // Pass full data for robust handling
      }),
      onDragStart: () => {
        const height = el.clientHeight;
        dispatch(setDraggingCardHeight({ draggingCardHeight: height }));
        dispatch(setIsDragging({ isDragging: true }));
        el.style.opacity = '0.4';
        el.style.willChange = 'transform, opacity';
      },
      onDrop: () => {
        dispatch(setIsDragging({ isDragging: false }));
        el.style.opacity = '1';
        el.style.willChange = '';
      },
    });
  }, [ingredient, dispatch]);

  // Ensure draggable is explicitly set for browser recognition
  // pdnd handles the event listeners

  return (
    <div
      ref={ref}
      draggable={true}
      className='cursor-grab active:cursor-grabbing'
    >
      {children}
    </div>
  );
};

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

const GroceryCard: React.FC<MealCardProps> = ({
  data,
  pantryIngredientIds,
  onTogglePantry,
  onAddToNeedBuy,
}) => {
  const dispatch = useDispatch();

  const openIngredientDetail = useCallback(
    (ingredient: IngreResponse) => {
      // Use a lightweight MealPlanFood stub so ModalFoodDetail can fetch by id.
      const stub = {
        _id: ingredient._id,
        amount: 1,
        unit: 0,
        foodId: {
          _id: ingredient._id,
          name: ingredient.name,
          imgUrls: ingredient.imgUrls ?? [],
          categories: ingredient.categories,
          defaultUnit: 0,
          property: { prepTime: 0, cookTime: 0 },
          nutrition:
            ingredient.nutrition as unknown as MealPlanFood['foodId']['nutrition'],
          units: ingredient.units ?? [ingredient.unit].filter(Boolean),
        },
      } as MealPlanFood;

      dispatch(setViewingDetailFood(stub));
      dispatch(setIsModalDetailOpen(true));
    },
    [dispatch],
  );

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

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            {items.map((ingredient, index) => (
              <GroceryDraggableItem
                key={(ingredient as unknown as { _id?: string })._id ?? index}
                ingredient={ingredient}
              >
                <div
                  className={cn(
                    'flex items-center rounded-2xl border-2 border-white/70 bg-white/85 p-2',
                    'shadow-[0_6px_14px_-10px_rgba(15,23,42,0.35)] backdrop-blur-sm',
                    'transition-all duration-200 hover:shadow-[0_10px_18px_-12px_rgba(15,23,42,0.35)]',
                  )}
                >
                  {/* Image with preview mask like MealCard */}
                  <Popover
                    mouseEnterDelay={0.5}
                    placement='left'
                    color='white'
                    styles={{
                      body: NUTRITION_POPOVER_BODY_STYLE,
                    }}
                    content={<GroceryPopover data={ingredient} />}
                  >
                    <Image
                      src={ingredient.imgUrls?.[0] || FALLBACK_INGREDIENT_IMAGE}
                      fallback={FALLBACK_INGREDIENT_IMAGE}
                      className='h-[50px] w-[50px] max-w-[50px] rounded-xl border-2 border-white/60 object-cover transition-all duration-200'
                      loading='lazy'
                      preview={{
                        mask: (
                          <EyeOutlined
                            style={{ fontSize: 20, color: 'white' }}
                          />
                        ),
                      }}
                    />
                  </Popover>

                  {/* Name and Amount */}
                  <div className='ml-[10px] flex w-full flex-col justify-center gap-[3px] pr-[10px]'>
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
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          openIngredientDetail(ingredient);
                        }}
                        className='leading-4.5 font-bold text-black transition-all duration-200 hover:underline'
                      >
                        {ingredient.name}
                      </Link>
                    </Popover>
                    <div className='flex items-center'>
                      <CompactAmountInput
                        amount={roundNumber(ingredient.totalAmount, 2)}
                        unit={ingredient.unit?.description ?? 'serving'}
                        unitOptions={
                          ingredient.units?.map((u) => ({
                            value: u.description,
                            label: u.description,
                          })) ?? []
                        }
                        readOnly={true}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {(onTogglePantry || onAddToNeedBuy) && (
                    <div className='flex shrink-0 flex-col items-center gap-1'>
                      {onTogglePantry && (
                        <Tooltip
                          title={
                            pantryIngredientIds?.has(ingredient._id)
                              ? 'Already in pantry'
                              : 'Add to pantry'
                          }
                        >
                          <button
                            type='button'
                            disabled={pantryIngredientIds?.has(ingredient._id)}
                            onClick={() => onTogglePantry(ingredient, true)}
                            className={cn(
                              'inline-flex h-7 w-7 items-center justify-center rounded-full border transition',
                              pantryIngredientIds?.has(ingredient._id)
                                ? 'cursor-not-allowed border-emerald-200 bg-emerald-50 text-emerald-700 opacity-80'
                                : 'border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100',
                            )}
                          >
                            <HiOutlineArchiveBoxArrowDown className='h-3.5 w-3.5' />
                          </button>
                        </Tooltip>
                      )}
                      {onAddToNeedBuy && (
                        <Tooltip title='Add to need to buy'>
                          <button
                            type='button'
                            onClick={() => onAddToNeedBuy(ingredient)}
                            className='inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-800 transition hover:bg-amber-100'
                          >
                            <HiOutlineShoppingBag className='h-3.5 w-3.5' />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  )}
                </div>
              </GroceryDraggableItem>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default GroceryCard;
