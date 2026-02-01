import React, { useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Modal, Typography } from 'antd';

import { Button } from '@/atoms/Button';
import { cn } from '@/helpers/helpers';
import { useAddFoodCollection } from '@/hooks/useAddFoodCollection';
import { FoodCardCollectionSkeleton } from '@/molecules/FoodCardCollection';
import { Food } from '@/types/food';

import { FoodCardCollection } from '../FoodCardCollection';
import { FilterModalContent } from '../ModalFilter';

import SelectedFoodDetail from './SelectedFoodDetail';

interface AddFoodCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  onAddFood: (foodId: string) => void;
}

const { Paragraph } = Typography;

const AddFoodCollectionModal: React.FC<AddFoodCollectionModalProps> = ({
  visible,
  onClose,
  onAddFood,
}) => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const {
    searchValue,
    setSearchValue,
    foods,
    isFetching,
    showNoFoods,
    handleScroll,
    handleFiltersSubmit,
  } = useAddFoodCollection();

  const handleFoodClick = (food: Food) => {
    setSelectedFood(food);
  };

  return (
    <Modal
      visible={visible}
      centered={true}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <div className='flex h-[80vh] gap-2 p-2'>
        <div
          className='flex h-full flex-1 flex-col gap-2 overflow-y-scroll'
          onScroll={handleScroll}
        >
          <div className='fixed z-50 flex items-center justify-between gap-4 bg-white p-2'>
            <Input
              placeholder='Search...'
              allowClear
              size='large'
              className='w-[300px] rounded-full py-2'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              prefix={<SearchOutlined />}
            />
            <Button
              className={cn(
                'flex w-[100px] items-center gap-3 py-5',
                isFilterActive && 'border-primary text-primary',
              )}
            >
              <CiFilter className='h-5 w-5' />
              <Paragraph className='m-0'>Filter</Paragraph>
            </Button>
          </div>

          <div className='mt-[80px]'>
            {foods.length > 0
              ? foods.map((food) => (
                  <FoodCardCollection
                    key={food._id}
                    food={food}
                    onClick={() => handleFoodClick(food)}
                    variant='list'
                  />
                ))
              : showNoFoods && <Paragraph>No foods found.</Paragraph>}

            {isFetching &&
              Array.from({ length: 8 }).map((_, index) => (
                <FoodCardCollectionSkeleton key={`skeleton-${index}`} />
              ))}
          </div>
        </div>

        <div className='h-full flex-1 overflow-y-scroll'>
          {selectedFood ? (
            <SelectedFoodDetail
              selectedFood={selectedFood}
              onAddFood={onAddFood}
              onBack={() => setSelectedFood(null)}
            />
          ) : (
            <FilterModalContent
              isFilterCollection={true}
              onFilterChange={setIsFilterActive}
              onFiltersSubmit={handleFiltersSubmit}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddFoodCollectionModal;
