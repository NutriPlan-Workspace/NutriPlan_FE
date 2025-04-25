import React, { useEffect, useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { Button, Typography } from 'antd';

import { DropdownMenuWrapper } from '@/atoms/DropdownMenu';
import { FoodCardCollection } from '@/molecules/FoodCardCollection';
import type { CollectionFood } from '@/types/collection';
import type { MenuItemDropdown } from '@/types/menuItem';

import { AddFoodCollectionModal } from '../AddFoodCollectionModal';

interface FoodsSectionProps {
  dropdownItems: MenuItemDropdown[];
  foods: CollectionFood[];
  onRemoveFood: (foodId: string) => void;
  onAddFood: (foodName: string) => void;
}

const { Title, Paragraph } = Typography;

const FoodsSection: React.FC<FoodsSectionProps> = ({
  dropdownItems,
  foods,
  onRemoveFood,
  onAddFood,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('1');
  const [sortedFoods, setSortedFoods] = useState<CollectionFood[]>(foods);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (selectedKey === '1') {
      setSortedFoods(
        [...foods].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      );
    } else if (selectedKey === '2') {
      setSortedFoods(
        [...foods].sort((a, b) => a.food.name.localeCompare(b.food.name)),
      );
    }
  }, [selectedKey, foods]);

  const handleSelect = (key: string) => {
    setSelectedKey(key);
  };

  const handleAddFood = (foodName: string) => {
    onAddFood(foodName);
    setModalVisible(false);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex max-w-[650px] items-center justify-between'>
        <Title level={4} className='m-0 font-thin'>
          Foods
        </Title>
        <div className='flex items-center gap-2'>
          <label>Sort By: </label>
          <DropdownMenuWrapper
            items={dropdownItems}
            defaultSelectedKey={selectedKey}
            onSelect={handleSelect}
          />
        </div>
      </div>
      {sortedFoods.length ? (
        <div className='flex flex-col gap-4'>
          {sortedFoods.map((food) => (
            <FoodCardCollection
              key={food?._id}
              food={food?.food}
              onRemoveFood={onRemoveFood}
            />
          ))}
        </div>
      ) : (
        <Paragraph className='font-thin'>
          There are no items in this collection. Add some foods to get started!
        </Paragraph>
      )}
      <Button
        className='flex w-[150px] items-center gap-2'
        onClick={() => setModalVisible(true)}
      >
        <IoMdAddCircleOutline />
        <Paragraph className='m-0'>Add Food</Paragraph>
      </Button>
      <AddFoodCollectionModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAddFood={handleAddFood}
      />
    </div>
  );
};

export default FoodsSection;
