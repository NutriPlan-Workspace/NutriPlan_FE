import React from 'react';
import { Modal } from 'antd';

import type { FoodFilterQuery } from '@/types/foodFilterQuery';

import FilterModalContent from './FilterModalContent';

interface ModalFilterProps {
  open: boolean;
  onClose: () => void;
  onFilterChange: (hasFilter: boolean) => void;
  onFiltersSubmit?: (
    newFilters: Partial<FoodFilterQuery>,
    keysToRemove?: (keyof FoodFilterQuery)[],
  ) => void;
}

const ModalFilter: React.FC<ModalFilterProps> = ({
  open,
  onClose,
  onFilterChange,
  onFiltersSubmit,
}) => (
  <Modal open={open} onCancel={onClose} footer={null} width={800}>
    <FilterModalContent
      onClose={onClose}
      onFilterChange={onFilterChange}
      onFiltersSubmit={onFiltersSubmit}
    />
  </Modal>
);

export default ModalFilter;
