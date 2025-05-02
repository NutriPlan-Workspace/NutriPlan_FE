import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoSearch } from 'react-icons/io5';
import { Input, Modal } from 'antd';

import { cn } from '@/helpers/helpers';
import { SelectedIngredientDetail } from '@/molecules/AddFoodCollectionModal';
import {
  FoodCardCollection,
  FoodCardCollectionSkeleton,
} from '@/molecules/FoodCardCollection';
import { useGetFoodsQuery } from '@/redux/query/apis/food/foodApis';
import { Food } from '@/types/food';
import { IngredientInput } from '@/types/ingredient';

interface AddIngredientModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (ingredient: IngredientInput) => void;
  setIngredient: React.Dispatch<React.SetStateAction<Food[]>>;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  open,
  onClose,
  onAdd,
  setIngredient,
}) => {
  const { reset } = useForm<IngredientInput>({
    defaultValues: {
      ingredientFoodId: '',
      amount: 1,
      unit: 0,
    },
  });

  const [page, setPage] = useState(1);
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [delayedNoFoods, setDelayedNoFoods] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  const { data, isFetching } = useGetFoodsQuery({
    page,
    limit: 20,
    filters: ['basicFood'],
    ...(debouncedValue ? { q: debouncedValue } : {}),
  });

  const handleAdd = (data: IngredientInput) => {
    onAdd(data);
    setIngredient((prev) => [...prev, selectedFood!]);
    reset();
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      setPage(1);
      setFoods([]);
      setDebouncedValue(searchValue.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    const shouldShow = !isFetching && foods.length < 20 && debouncedValue;

    if (shouldShow) {
      const timer = setTimeout(() => {
        setDelayedNoFoods(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setDelayedNoFoods(false);
    }
  }, [foods.length, isFetching, debouncedValue]);

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setFoods((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
    }
  }, [data]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 100;

    if (nearBottom && !isFetching && data?.data?.length === 20) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered={true}
      footer={null}
      width={800}
      bodyStyle={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}
    >
      <div className='flex gap-5'>
        <div className='flex flex-1 flex-col'>
          <div className='sticky top-0 z-50 flex items-center justify-between gap-4 bg-white p-2'>
            <Input
              placeholder='Search...'
              allowClear
              size='large'
              className='w-[300px] rounded-full py-2'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              prefix={<IoSearch />}
            />
          </div>

          <div
            className={cn(
              'max-h-[800px] min-h-[600px] flex-1 overflow-y-scroll px-2',
              isFetching && foods.length === 0 && 'min-h-[600px]',
            )}
            onScroll={handleScroll}
            ref={scrollContainerRef}
          >
            {foods.map((food) => (
              <FoodCardCollection
                key={food._id}
                food={food}
                onClick={() => setSelectedFood(food)}
              />
            ))}

            {isFetching &&
              Array.from({ length: 10 }).map((_, index) => (
                <FoodCardCollectionSkeleton key={`skeleton-${index}`} />
              ))}

            {delayedNoFoods && (
              <p className='mt-4 text-center text-gray-500'>No foods found.</p>
            )}
          </div>
        </div>

        <div className='flex-1 pl-4'>
          {selectedFood ? (
            <SelectedIngredientDetail
              selectedFood={selectedFood}
              onAddFood={handleAdd}
              onBack={() => setSelectedFood(null)}
            />
          ) : (
            <p className='text-gray-400 italic'>
              Select a food to view details.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddIngredientModal;
