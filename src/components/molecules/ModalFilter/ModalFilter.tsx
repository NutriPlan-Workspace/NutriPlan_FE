import React, { useState } from 'react';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { Checkbox, Modal, Typography } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/atoms/Button';
import {
  CategoriesSection,
  CollectionsSection,
  MealTypeSection,
  NutritionFocusSection,
  NutritionPerServingSection,
  SectionTitle,
} from '@/atoms/ModalSection';
import { useFilterModal } from '@/hooks/useFilterModal';
import type { FoodFilterQuery } from '@/types/foodFilterQuery';

const { Title, Paragraph } = Typography;

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onFilterChange: (hasFilter: boolean) => void;
  onFiltersSubmit?: (
    newFilters: Partial<FoodFilterQuery>,
    keysToRemove?: (keyof FoodFilterQuery)[],
  ) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  onFilterChange,
  onFiltersSubmit,
}) => {
  const [showNutritionFocus, setShowNutritionFocus] = useState(true);
  const [showMealType, setShowMealType] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [showCollection, setShowCollection] = useState(true);
  const [showNutritionPerServing, setShowNutritionPerServing] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  const {
    user,
    applyExclusions,
    resetTrigger,
    activeOptions,
    dishType,
    preferredFoodTypes,
    selectedCategories,
    setActiveOptions,
    setDishType,
    setPreferredFoodTypes,
    setSelectedCategories,
    setSelectedCollectionIds,
    setSearchCollections,
    setNutritionFilters,
    handleSearch,
    handleReset,
    handleCheckboxChange,
  } = useFilterModal(onClose, onFilterChange, onFiltersSubmit);

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={800}>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-4'>
          <Title level={3} className='m-0'>
            Filters
          </Title>
          <Button
            className='rounded-md border-none text-blue-500 hover:bg-gray-200'
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>

        {user.email && (
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-3'>
              <Checkbox
                onChange={handleCheckboxChange}
                checked={applyExclusions}
              >
                Apply Food Exclusions
              </Checkbox>
              <FaRegQuestionCircle
                className='h-5 w-5 cursor-pointer text-gray-500 hover:text-blue-500'
                onClick={() => setShowInfo((prev) => !prev)}
              />
            </div>
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <Paragraph className='text-sm text-gray-600'>
                    Food will be excluded because it is filtered out by your
                    configured Food Exclusions or it doesn&apos;t fit your
                    Primary Diet.
                  </Paragraph>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <div className='flex flex-col gap-2'>
          <SectionTitle
            title='Nutrition Focus'
            isOpen={showNutritionFocus}
            onToggle={() => setShowNutritionFocus(!showNutritionFocus)}
          />
          {showNutritionFocus && (
            <NutritionFocusSection
              activeOptions={activeOptions}
              setActiveOptions={setActiveOptions}
            />
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <SectionTitle
            title='Meal Type'
            isOpen={showMealType}
            onToggle={() => setShowMealType(!showMealType)}
          />
          {showMealType && (
            <MealTypeSection
              onFilterChange={onFilterChange}
              onDishTypeChange={setDishType}
              onPreferredFoodTypesChange={setPreferredFoodTypes}
              selectedDishType={
                dishType === 'main'
                  ? 'Main Dish'
                  : dishType === 'side'
                    ? 'Side Dish'
                    : null
              }
              activeMealTypes={preferredFoodTypes}
              setSelectedDishType={(dish) =>
                setDishType(
                  dish === 'Main Dish'
                    ? 'main'
                    : dish === 'Side Dish'
                      ? 'side'
                      : null,
                )
              }
              setActiveMealTypes={setPreferredFoodTypes}
            />
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <SectionTitle
            title='Categories'
            isOpen={showCategories}
            onToggle={() => setShowCategories(!showCategories)}
          />
          {showCategories && (
            <CategoriesSection
              onCategoriesChange={setSelectedCategories}
              selectedCategories={selectedCategories}
            />
          )}
        </div>
        {user.email && (
          <div className='flex flex-col gap-2'>
            <SectionTitle
              title='Collections'
              isOpen={showCollection}
              onToggle={() => setShowCollection(!showCollection)}
            />
            {showCollection && (
              <CollectionsSection
                onFilterChange={setSelectedCollectionIds}
                resetTrigger={resetTrigger}
                setSearchCollections={setSearchCollections}
              />
            )}
          </div>
        )}
        <div className='flex flex-col gap-2'>
          <SectionTitle
            title='Nutrition per Serving'
            isOpen={showNutritionPerServing}
            onToggle={() =>
              setShowNutritionPerServing(!showNutritionPerServing)
            }
          />
          {showNutritionPerServing && (
            <NutritionPerServingSection
              onFilterChange={setNutritionFilters}
              resetTrigger={resetTrigger}
            />
          )}
        </div>
        <div className='mt-4 flex justify-center'>
          <Button
            className='bg-primary hover:bg-primary w-[200px] rounded-full border-none py-5 text-black'
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
