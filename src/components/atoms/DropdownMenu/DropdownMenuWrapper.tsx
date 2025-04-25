import React, { useEffect, useState } from 'react';

import { cn } from '@/helpers/helpers';
import type { MenuItemDropdown } from '@/types/menuItem';

import DropdownMenu from './DropdownMenu';

const DropdownMenuWrapper: React.FC<{
  items: MenuItemDropdown[];
  defaultSelectedKey: string;
  onSelect: (selectedKey: string) => void;
  className?: string;
}> = ({ items, defaultSelectedKey, onSelect, className }) => {
  const [, setSelectedKey] = useState<string>(defaultSelectedKey);

  useEffect(() => {
    setSelectedKey(defaultSelectedKey);
  }, [defaultSelectedKey]);

  const handleSelect = (key: string) => {
    setSelectedKey(key);
    onSelect(key);
  };

  return (
    <DropdownMenu
      items={items}
      onSelect={handleSelect}
      className={cn('min-w-[120px]', className)}
    />
  );
};

export default DropdownMenuWrapper;
