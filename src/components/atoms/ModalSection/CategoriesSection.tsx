import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';

import { ValidFilter } from '@/constants/foodFilter';

const categoriesOptions = [
  'Foods',
  'My Custom Foods',
  'Recipes',
  'My Custom Recipes',
  // 'Branded Foods',
  // 'Restautaurant Foods',
];

export const CATEGORY_TO_FILTER_MAP = {
  Foods: 'basicFood',
  'My Custom Foods': 'customFood',
  Recipes: 'recipe',
  'My Custom Recipes': 'customRecipe',
  // TODO: update this in later
  // 'Branded Foods': 'brandedFood',
  // 'Restaurant Foods' : 'restaurantFood',
};

interface CategoriesSectionProps {
  onCategoriesChange: (selectedCategories: ValidFilter[]) => void;
  selectedCategories: ValidFilter[];
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onCategoriesChange,
  selectedCategories,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newCheckedItems: Record<string, boolean> = {};

    categoriesOptions.forEach((option) => {
      const mapped =
        CATEGORY_TO_FILTER_MAP[option as keyof typeof CATEGORY_TO_FILTER_MAP];
      newCheckedItems[option] = selectedCategories.includes(
        mapped as ValidFilter,
      );
    });

    setCheckedItems(newCheckedItems);
  }, [selectedCategories]);

  const handleChange = (key: string, checked: boolean) => {
    const updatedCheckedItems = {
      ...checkedItems,
      [key]: checked,
    };
    setCheckedItems(updatedCheckedItems);

    const selected = Object.keys(updatedCheckedItems)
      .filter((key) => updatedCheckedItems[key])
      .map(
        (key) =>
          CATEGORY_TO_FILTER_MAP[key as keyof typeof CATEGORY_TO_FILTER_MAP],
      ) as ValidFilter[];

    onCategoriesChange(selected);
  };

  return (
    <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
      {categoriesOptions.map((option) => (
        <Checkbox
          key={option}
          checked={checkedItems[option] || false}
          onChange={(e) => handleChange(option, e.target.checked)}
        >
          {option}
        </Checkbox>
      ))}
    </div>
  );
};

export default CategoriesSection;
