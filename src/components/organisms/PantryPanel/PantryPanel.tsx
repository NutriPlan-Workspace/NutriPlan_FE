import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  HiOutlineArchiveBoxArrowDown,
  HiOutlineArrowDownTray,
  // HiOutlineMagnifyingGlass,
  // HiOutlinePlus,
  // HiOutlineShoppingBag,
  // HiOutlineTrash,
} from 'react-icons/hi2';
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineShoppingBag,
  HiOutlineTrash,
} from 'react-icons/hi2'; // Splitting just for lint clarity if needed
import { useSelector } from 'react-redux';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import {
  AutoComplete,
  Button,
  Input,
  Popover,
  Select,
  Spin,
  Tooltip,
} from 'antd'; // Removed Input, added AutoComplete, Spin
import { jsPDF } from 'jspdf';

import CompactAmountInput from '@/components/atoms/CompactAmountInput/CompactAmountInput';
import DropIndicator from '@/components/atoms/DropIndicator/DropIndicator';
import GroceryPopover from '@/components/molecules/GroceryPopover/GroceryPopover';
import { NUTRITION_POPOVER_BODY_STYLE } from '@/constants/popoverStyles';
import { cn } from '@/helpers/helpers';
import { useDebounce } from '@/hooks/useDebounce';
import { usePantryCardDrag } from '@/hooks/usePantryCardDrag';
import { useLazySearchFoodsQuery } from '@/redux/query/apis/mealPlan/mealPlanApi';
import {
  useDeletePantryItemMutation,
  useGetPantryItemsQuery,
  useUpdatePantryItemMutation,
  useUpsertPantryItemMutation,
} from '@/redux/query/apis/pantry/pantryApi';
import { pantrySelector } from '@/redux/slices/pantry/pantrySlice';
import type { DragData } from '@/types/dragDrop';
import { type IngreResponse } from '@/types/mealPlan';
import type { SearchResponse, UpsertPantryItemPayload } from '@/types/pantry';
import type { PantryItem, PantryStatus } from '@/types/pantry';
import { roundNumber } from '@/utils/roundNumber';

const FALLBACK_INGREDIENT_IMAGE =
  'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/whuexhkydv7ubiqh5rxe.jpg';

interface PantryPanelProps {
  groceries?: IngreResponse[];
  foodImgById: Record<string, string>;
}

// Connected Drop Indicator that subscribes to Redux height
const ConnectedDropIndicator: React.FC<{
  edge: 'top' | 'bottom';
  variant: 'primary' | 'warning';
}> = ({ edge, variant }) => {
  const { draggingCardHeight } = useSelector(pantrySelector);
  return (
    <DropIndicator
      edge={edge}
      mealCardHeight={draggingCardHeight || 50}
      variant={variant}
    />
  );
};

// Sub-component for individual draggable pantry items
interface PantryDraggableItemProps {
  item: PantryItem;
  index: number;
  status: PantryStatus;
  grocery?: IngreResponse;
  foodImg?: string;
  onToggleStatus: (item: PantryItem, targetStatus?: PantryStatus) => void;
  onDeleteItem: (id: string) => void;
  onQuantityChange: (item: PantryItem, value: number | null) => void;
  onUnitChange: (item: PantryItem, value: string) => void;
}

const PantryDraggableItem = memo(
  ({
    item,
    index,
    status,
    grocery,
    foodImg,
    onToggleStatus,
    onDeleteItem,
    onQuantityChange,
    onUnitChange,
  }: PantryDraggableItemProps) => {
    const { pantryCardRef, closestEdge, dragState } = usePantryCardDrag({
      cardId: item._id,
      status,
      index,
    });

    // Determine image source with fallback priority: item.imgUrl -> grocery img -> foodImg -> fallback
    const imgSrc =
      item.imgUrl ??
      (item.ingredientFoodId
        ? (grocery?.imgUrls?.[0] ?? foodImg)
        : undefined) ??
      FALLBACK_INGREDIENT_IMAGE;

    return (
      <>
        {closestEdge === 'top' && (
          <ConnectedDropIndicator
            edge='top'
            variant={status === 'need_buy' ? 'warning' : 'primary'}
          />
        )}
        <div
          ref={pantryCardRef}
          className={cn(
            'flex items-center justify-between gap-3 rounded-2xl border-2 p-3 backdrop-blur-sm transition-all duration-200',
            status === 'need_buy'
              ? 'border-amber-200/70 bg-amber-50/60 hover:shadow-[0_10px_18px_-12px_rgba(15,23,42,0.35)]'
              : 'border-white/70 bg-white/85 shadow-[0_6px_14px_-10px_rgba(15,23,42,0.35)] hover:shadow-[0_10px_18px_-12px_rgba(15,23,42,0.35)]',
            dragState ? 'opacity-40' : 'opacity-100',
          )}
        >
          <div className='flex min-w-0 flex-1 items-center gap-3'>
            <div className='h-12 w-12 overflow-hidden rounded-xl border border-white/60 bg-gray-100'>
              <img
                src={imgSrc}
                alt={item.name}
                className='h-full w-full object-cover'
                loading='lazy'
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_INGREDIENT_IMAGE;
                }}
              />
            </div>
            <div className='min-w-0 flex-1'>
              {item.ingredientFoodId && grocery ? (
                <Popover
                  mouseEnterDelay={0.35}
                  placement='rightTop'
                  color='white'
                  styles={{ body: NUTRITION_POPOVER_BODY_STYLE }}
                  content={<GroceryPopover data={grocery} />}
                >
                  <p className='hover:text-primary-700 truncate text-sm font-semibold text-gray-900'>
                    {item.name}
                  </p>
                </Popover>
              ) : (
                <p className='truncate text-sm font-semibold text-gray-900'>
                  {item.name}
                </p>
              )}
              <div className='mt-2 overflow-hidden'>
                <CompactAmountInput
                  amount={item.quantity}
                  unit={item.unit}
                  onAmountChange={(val) => onQuantityChange(item, val)}
                  onUnitChange={(val) => onUnitChange(item, val)}
                  inputReadOnly={true}
                  unitOptions={[
                    { value: 'serving', label: 'serving' },
                    { value: 'gram', label: 'gram' },
                    { value: 'ml', label: 'ml' },
                    { value: 'pcs', label: 'pcs' },
                    { value: 'tbsp', label: 'tbsp' },
                    { value: 'cup', label: 'cup' },
                    { value: 'cup, chopped', label: 'cup, chopped' },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className='flex flex-col items-center gap-1'>
            {status === 'in_pantry' ? (
              <Tooltip title='Move to need to buy'>
                <button
                  type='button'
                  onClick={() => onToggleStatus(item)}
                  className='inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-800 transition hover:bg-amber-100'
                >
                  <HiOutlineShoppingBag className='h-3.5 w-3.5' />
                </button>
              </Tooltip>
            ) : (
              <Tooltip title='Mark as bought (move to pantry)'>
                <button
                  type='button'
                  onClick={() => onToggleStatus(item, 'in_pantry')}
                  className='inline-flex h-7 w-7 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-800 transition hover:bg-sky-100'
                >
                  <HiOutlineArchiveBoxArrowDown className='h-3.5 w-3.5' />
                </button>
              </Tooltip>
            )}
            <Tooltip title='Remove item'>
              <button
                type='button'
                onClick={() => onDeleteItem(item._id)}
                className='inline-flex h-7 w-7 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100'
              >
                <HiOutlineTrash className='h-3.5 w-3.5' />
              </button>
            </Tooltip>
          </div>
        </div>
        {closestEdge === 'bottom' && (
          <ConnectedDropIndicator
            edge='bottom'
            variant={status === 'need_buy' ? 'warning' : 'primary'}
          />
        )}
      </>
    );
  },
);

PantryDraggableItem.displayName = 'PantryDraggableItem';

export default function PantryPanel({
  groceries = [],
  foodImgById = {},
}: PantryPanelProps) {
  const { data: pantryItemsResponse } = useGetPantryItemsQuery({});
  const pantryItems = useMemo(
    () => pantryItemsResponse?.data ?? [],
    [pantryItemsResponse],
  );
  const [upsertPantryItem] = useUpsertPantryItemMutation();
  const [deletePantryItem] = useDeletePantryItemMutation();
  const [updatePantryItem] = useUpdatePantryItemMutation();

  const [triggerSearch, { data: searchResults, isFetching: isSearching }] =
    useLazySearchFoodsQuery();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('serving');
  const [status, setStatus] = useState<PantryStatus>('in_pantry');
  const [ingredientFoodId, setIngredientFoodId] = useState<string | undefined>(
    undefined,
  );
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Optimistic ordering map: status -> array of IDs
  const [orders, setOrders] = useState<Record<PantryStatus, string[]>>({
    in_pantry: [],
    need_buy: [],
  });

  const groceryById = useMemo(
    () => new Map(groceries.map((g) => [g._id, g])),
    [groceries],
  );

  const inPantryDropRef = useRef<HTMLDivElement | null>(null);
  const needBuyDropRef = useRef<HTMLDivElement | null>(null);
  const [dropTarget, setDropTarget] = useState<PantryStatus | null>(null);

  // Initialize orders when data loads
  useEffect(() => {
    if (!pantryItems.length) return;
    setOrders((prev) => {
      const existingIds = new Set([...prev.in_pantry, ...prev.need_buy]);
      const newInPantry = pantryItems
        .filter((i) => i.status === 'in_pantry' && !existingIds.has(i._id))
        .map((i) => i._id);
      const newNeedBuy = pantryItems
        .filter((i) => i.status === 'need_buy' && !existingIds.has(i._id))
        .map((i) => i._id);

      // Clean up deleted items from state
      const currentIds = new Set(pantryItems.map((i) => i._id));
      const filteredInPantry = prev.in_pantry.filter(
        (id) =>
          currentIds.has(id) &&
          pantryItems.find((i) => i._id === id)?.status === 'in_pantry',
      );
      const filteredNeedBuy = prev.need_buy.filter(
        (id) =>
          currentIds.has(id) &&
          pantryItems.find((i) => i._id === id)?.status === 'need_buy',
      );

      return {
        in_pantry: [...filteredInPantry, ...newInPantry],
        need_buy: [...filteredNeedBuy, ...newNeedBuy],
      };
    });
  }, [pantryItems]);

  const itemsById = useMemo(
    () => new Map(pantryItems.map((item) => [item._id, item])),
    [pantryItems],
  );

  const grouped = {
    inPantry: orders.in_pantry
      .map((id) => itemsById.get(id))
      .filter((i): i is PantryItem => !!i),
    needBuy: orders.need_buy
      .map((id) => itemsById.get(id))
      .filter((i): i is PantryItem => !!i),
  };

  const debouncedSearch = useDebounce((value: string) => {
    if (value.trim()) {
      triggerSearch({
        q: value,
        allSearch: false,
        filters: ['basicFood'],
      });
    }
  }, 500);

  const handleSelect = (_: string, option: unknown) => {
    // option.value is the display text (name)
    const opt = option as {
      value: string;
      key: string;
      imgUrl?: string;
      unit?: string;
    };
    setName(opt.value);
    setIngredientFoodId(opt.key);
    setImgUrl(opt.imgUrl);
    if (opt.unit) {
      setUnit(opt.unit);
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await upsertPantryItem({
        name,
        quantity,
        unit,
        status,
        ingredientFoodId,
        imgUrl,
      }).unwrap();
      setName('');
      setQuantity(1);
      setUnit('serving');
      setIngredientFoodId(undefined);
      setImgUrl(undefined);
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = (id: string) => {
    deletePantryItem(id);
    setOrders((prev) => ({
      in_pantry: prev.in_pantry.filter((i) => i !== id),
      need_buy: prev.need_buy.filter((i) => i !== id),
    }));
  };

  const updateQuantity = useDebounce(
    (item: PantryItem, newQuantity: number) => {
      updatePantryItem({ id: item._id, data: { quantity: newQuantity } });
    },
    600,
  );

  const handleQuantityChange = (item: PantryItem, value: number | null) => {
    const newQuantity = value || 0;
    updateQuantity(item, newQuantity);
  };

  const handleUnitChange = (item: PantryItem, newUnit: string) => {
    let newQuantity = item.quantity;

    if (item.ingredientFoodId) {
      const grocery = groceryById.get(item.ingredientFoodId);
      if (grocery && grocery.units) {
        // Find conversion factors
        const currentUnitData =
          grocery.units.find((u) => u.description === item.unit) ||
          (grocery.unit.description === item.unit ? grocery.unit : null);

        const newUnitData =
          grocery.units.find((u) => u.description === newUnit) ||
          (grocery.unit.description === newUnit ? grocery.unit : null);

        if (currentUnitData && newUnitData) {
          // Calculate new quantity: current * (currentFactor / newFactor)
          // factor is "amount" in the unit object
          const factor = currentUnitData.amount / newUnitData.amount;
          newQuantity = item.quantity * factor;
        }
      }
    }

    // Round the result
    const roundedQuantity = roundNumber(newQuantity, 2);

    updatePantryItem({
      id: item._id,
      data: { unit: newUnit, quantity: roundedQuantity },
    });
  };

  const toggleStatus = async (
    item: PantryItem,
    targetStatus?: PantryStatus,
  ) => {
    const newStatus =
      targetStatus ?? (item.status === 'in_pantry' ? 'need_buy' : 'in_pantry');

    // Remove from old list
    const oldStatus = item.status;

    setOrders((prev) => ({
      ...prev,
      [oldStatus]: prev[oldStatus].filter((id) => id !== item._id),
      [newStatus]: [item._id, ...prev[newStatus]],
    }));

    await updatePantryItem({
      id: item._id,
      data: { status: newStatus },
    });
  };

  const setOrderForStatus = (status: PantryStatus, newOrder: string[]) => {
    setOrders((prev) => ({
      ...prev,
      [status]: newOrder,
    }));
  };

  // Monitor Drop Logic
  useEffect(() => {
    const inPantryEl = inPantryDropRef.current;
    const needBuyEl = needBuyDropRef.current;
    if (!inPantryEl || !needBuyEl) return;

    // Monitor for drops relevant to PantryPanel
    const monitorConfig = monitorForElements({
      onDrop: ({ source, location }) => {
        // Only process drop types relevant to PantryPanel
        const sourceType = source.data.type;
        if (
          sourceType !== 'grocery' &&
          sourceType !== 'pantry' &&
          sourceType !== 'foodCardSideAdd'
        ) {
          return; // Ignore unrelated drag types
        }

        const destination = location.current.dropTargets[0];
        if (!destination) {
          // This can happen when item is dropped outside valid targets - not an error
          return;
        }

        const droppedData = source.data;
        const targetData = destination.data;
        const targetStatus = targetData.status as PantryStatus;

        if (!targetStatus) {
          return;
        }

        if (
          droppedData.type === 'grocery' ||
          droppedData.type === 'foodCardSideAdd'
        ) {
          const isFoodCard = droppedData.type === 'foodCardSideAdd';

          const ingredientFoodId = isFoodCard
            ? (droppedData as DragData).food?._id
            : (droppedData.ingredientFoodId as string | undefined);

          const performUpsert = async (payload: UpsertPantryItemPayload) => {
            try {
              await upsertPantryItem(payload).unwrap();
            } catch {
              // ignore
            }
          };

          if (typeof ingredientFoodId === 'string') {
            const ingredient = groceryById.get(ingredientFoodId);
            // If it's a food card, we might not have it in groceryMap, but we have the food object
            const foodData = isFoodCard
              ? (
                  droppedData as {
                    food: { name: string; imgUrls?: string[]; _id: string };
                  }
                ).food
              : null;

            // Extract image from dropped data as a fallback to ensure we get something
            const safeDroppedData = droppedData as {
              imgUrls?: string[];
              imgUrl?: string;
            };
            const fallbackImgUrl =
              safeDroppedData.imgUrls?.[0] || safeDroppedData.imgUrl;

            if (ingredient) {
              performUpsert({
                name: ingredient.name,
                quantity: roundNumber(ingredient.totalAmount, 2),
                unit: ingredient.unit?.description ?? 'serving',
                status: targetStatus,
                imgUrl: ingredient.imgUrls?.[0] ?? fallbackImgUrl,
                ingredientFoodId: ingredient._id,
              });
            } else if (foodData) {
              // Map Food (Recipe) to Pantry Item
              performUpsert({
                name: foodData.name,
                quantity: 1, // Default to 1 serving, no need to round static 1
                unit: 'serving',
                status: targetStatus,
                imgUrl: foodData.imgUrls?.[0] ?? fallbackImgUrl,
                ingredientFoodId: foodData._id,
              });
            } else {
              // Fallback: use drag data directly if not found in groceryById
              // console.warn('[PantryPanel] Ingredient not found in map, using fallback data', droppedData);
              performUpsert({
                name: droppedData.name as string,
                quantity: roundNumber(droppedData.quantity as number, 2),
                unit: (droppedData.unit as string) ?? 'serving',
                status: targetStatus,
                ingredientFoodId,
                imgUrl: fallbackImgUrl, // Ensure image is passed
              });
            }
          } else {
            // Super fallback if ingredientFoodId is missing
            // console.warn('[PantryPanel] No ingredientFoodId, using raw fallback', droppedData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const safeData = droppedData as any;
            performUpsert({
              name: droppedData.name as string,
              quantity: roundNumber(droppedData.quantity as number, 2),
              unit: (droppedData.unit as string) ?? 'serving',
              status: targetStatus,
              imgUrl: safeData.imgUrls?.[0] ?? safeData.imgUrl,
            });
          }
          return;
        }

        // Handle Pantry Reorder / Move
        if (droppedData.type === 'pantry') {
          const sourceId = droppedData.id as string;
          if (sourceId === targetData.id) return; // Dropped on self

          const sourceItem = itemsById.get(sourceId);
          if (!sourceItem) return;

          // Move between lists
          if (sourceItem.status !== targetStatus) {
            let newTargetList = [...orders[targetStatus]];
            const newSourceList = orders[sourceItem.status].filter(
              (id) => id !== sourceId,
            );

            if (targetData.type === 'pantry') {
              // Dropped on an item
              const targetId = targetData.id as string;
              const targetIndex = newTargetList.indexOf(targetId);
              const edge = extractClosestEdge(targetData); // from dropTarget data attachClosestEdge

              const insertIndex =
                edge === 'top' ? targetIndex : targetIndex + 1;
              newTargetList.splice(insertIndex, 0, sourceId);
            } else {
              // Dropped on container
              newTargetList.push(sourceId);
            }

            setOrders((prev) => ({
              ...prev,
              [sourceItem.status]: newSourceList,
              [targetStatus]: newTargetList,
            }));
            updatePantryItem({ id: sourceId, data: { status: targetStatus } });
          } else {
            // Reorder same list
            const newOrder = [...orders[targetStatus]];
            const sourceIndex = newOrder.indexOf(sourceId);
            if (sourceIndex > -1) newOrder.splice(sourceIndex, 1);

            if (targetData.type === 'pantry') {
              // Dropped on item
              const targetId = targetData.id as string;
              const edge = extractClosestEdge(targetData);

              const targetIndex = newOrder.indexOf(targetId);
              const insertIndex =
                edge === 'top' ? targetIndex : targetIndex + 1;
              newOrder.splice(insertIndex, 0, sourceId);
            } else {
              // Dropped on container -> move to end
              newOrder.push(sourceId);
            }

            setOrderForStatus(targetStatus, newOrder);
          }
        }
      },
    });

    // Container drop targets
    const containerConfig = combine(
      dropTargetForElements({
        element: inPantryEl,
        getData: () => ({ status: 'in_pantry' }),
        onDragEnter: () => setDropTarget('in_pantry'),
        onDragLeave: () => setDropTarget(null),
        onDrop: () => setDropTarget(null),
        canDrop: ({ source }) =>
          source.data.type === 'grocery' ||
          source.data.type === 'pantry' ||
          source.data.type === 'foodCardSideAdd',
      }),
      dropTargetForElements({
        element: needBuyEl,
        getData: () => ({ status: 'need_buy' }),
        onDragEnter: () => setDropTarget('need_buy'),
        onDragLeave: () => setDropTarget(null),
        onDrop: () => setDropTarget(null),
        canDrop: ({ source }) =>
          source.data.type === 'grocery' ||
          source.data.type === 'pantry' ||
          source.data.type === 'foodCardSideAdd',
      }),
    );

    return combine(monitorConfig, containerConfig);
  }, [itemsById, groceryById, orders, upsertPantryItem, updatePantryItem]);

  const handleExportNeedBuyPdf = () => {
    const itemsToBuy = grouped.needBuy;
    if (!itemsToBuy.length) return;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const left = 40;
    const right = 40;
    const maxTextWidth = pageWidth - left - right;

    let y = 52;
    doc.setFontSize(16);
    doc.text('Need to buy', left, y);
    y += 18;

    itemsToBuy.forEach((item) => {
      doc.setFontSize(12);
      const text = `- ${item.name}: ${item.quantity} ${item.unit}`;
      const lines = doc.splitTextToSize(text, maxTextWidth);
      doc.text(lines, left, y);
      y += 14 * lines.length;
    });

    doc.save('shopping_list.pdf');
  };

  const options =
    (searchResults as SearchResponse)?.data?.basicFood?.foods?.map(
      (food: unknown) => {
        const f = food as {
          name: string;
          imgUrls?: string[];
          _id: string;
          unit?: { description: string };
        };
        return {
          value: f.name, // Display text
          label: (
            <div className='flex items-center gap-2'>
              <img
                src={f.imgUrls?.[0] || FALLBACK_INGREDIENT_IMAGE}
                alt={f.name}
                className='h-6 w-6 rounded object-cover'
              />
              <span>{f.name}</span>
            </div>
          ),
          key: f._id,
          imgUrl: f.imgUrls?.[0],
          unit: f.unit?.description,
        };
      },
    ) || [];

  return (
    <div className='flex h-[82vh] flex-col gap-6'>
      <div className='flex items-end gap-3 rounded-2xl border border-white/60 bg-white/40 p-3 shadow-sm backdrop-blur-md'>
        <div className='flex-1 space-y-2'>
          <div className='relative w-full'>
            <AutoComplete
              value={name}
              onChange={(val) => {
                setName(val);
                // Clear ID/Img if user modifies text after selection to avoid mismatch
                setIngredientFoodId(undefined);
                setImgUrl(undefined);
                debouncedSearch(val);
              }}
              onSelect={handleSelect}
              options={options}
              placeholder='Search groceries...'
              className='w-full'
              backfill
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdd();
                }
              }}
            >
              <Input
                suffix={
                  isSearching ? (
                    <Spin size='small' />
                  ) : (
                    <HiOutlineMagnifyingGlass className='text-gray-400' />
                  )
                }
              />
            </AutoComplete>
          </div>
          <div className='flex items-center gap-2'>
            <CompactAmountInput
              amount={quantity}
              unit={unit}
              onAmountChange={(val) => setQuantity(val ?? 0)}
              onUnitChange={(val) => setUnit(val)}
              unitOptions={[
                { value: 'serving', label: 'serving' },
                { value: 'gram', label: 'gram' },
                { value: 'ml', label: 'ml' },
                { value: 'pcs', label: 'pcs' },
                { value: 'tbsp', label: 'tbsp' },
                { value: 'cup', label: 'cup' },
                { value: 'cup, chopped', label: 'cup, chopped' },
              ]}
              min={0}
            />
            <Select
              value={status}
              onChange={(value) => setStatus(value)}
              className='min-w-[130px]'
              options={[
                { value: 'in_pantry', label: 'In pantry' },
                { value: 'need_buy', label: 'Need to buy' },
              ]}
            />
          </div>
        </div>
        <Button
          onClick={handleAdd}
          disabled={isSaving}
          className='bg-primary hover:bg-primary-400 flex items-center justify-center border-none text-black'
          icon={<HiOutlinePlus className='h-5 w-5 text-white' />}
          type='text'
        />
      </div>

      <div className='flex min-h-0 flex-1 flex-col gap-4'>
        <div className='flex min-h-0 flex-1 flex-col'>
          <p className='text-xs font-semibold tracking-[0.22em] text-gray-400 uppercase'>
            In pantry
          </p>
          <div
            ref={inPantryDropRef}
            className={cn(
              'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 mt-2 flex-1 space-y-3 overflow-y-auto rounded-2xl p-2 transition-colors',
              dropTarget === 'in_pantry'
                ? 'border-primary-300 bg-primary-50/40 border-2 border-dashed'
                : '',
            )}
          >
            {grouped.inPantry.map((item, idx) => (
              <PantryDraggableItem
                key={item._id}
                item={item}
                index={idx}
                status='in_pantry'
                grocery={
                  item.ingredientFoodId
                    ? groceryById.get(item.ingredientFoodId)
                    : undefined
                }
                foodImg={
                  item.ingredientFoodId && foodImgById
                    ? foodImgById[item.ingredientFoodId]
                    : undefined
                }
                onToggleStatus={toggleStatus}
                onDeleteItem={deleteItem}
                onQuantityChange={handleQuantityChange}
                onUnitChange={handleUnitChange}
              />
            ))}
            {grouped.inPantry.length === 0 && (
              <p className='text-xs text-gray-500'>No pantry items yet.</p>
            )}
          </div>
        </div>

        <div className='flex min-h-0 flex-1 flex-col'>
          <div className='flex items-center justify-between gap-3'>
            <p className='text-xs font-semibold tracking-[0.22em] text-gray-400 uppercase'>
              Need to buy
            </p>
            <button
              type='button'
              onClick={handleExportNeedBuyPdf}
              disabled={grouped.needBuy.length === 0}
              className='inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <HiOutlineArrowDownTray className='h-4 w-4' />
              Export PDF
            </button>
          </div>
          <div
            ref={needBuyDropRef}
            className={cn(
              'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-amber-200 mt-2 flex-1 overflow-y-auto rounded-2xl p-2 transition-colors',
              dropTarget === 'need_buy'
                ? 'border-2 border-dashed border-amber-300 bg-amber-50/60'
                : '',
            )}
          >
            {grouped.needBuy.map((item, idx) => (
              <PantryDraggableItem
                key={item._id}
                item={item}
                index={idx}
                status='need_buy'
                grocery={
                  item.ingredientFoodId
                    ? groceryById.get(item.ingredientFoodId)
                    : undefined
                }
                foodImg={
                  item.ingredientFoodId && foodImgById
                    ? foodImgById[item.ingredientFoodId]
                    : undefined
                }
                onToggleStatus={toggleStatus}
                onDeleteItem={deleteItem}
                onQuantityChange={handleQuantityChange}
                onUnitChange={handleUnitChange}
              />
            ))}
            {grouped.needBuy.length === 0 && (
              <p className='text-xs text-gray-500'>No items to buy.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
