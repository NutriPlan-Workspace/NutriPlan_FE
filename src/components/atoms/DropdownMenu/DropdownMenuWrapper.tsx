import React, { useEffect, useState } from 'react';

import type { MenuItemDropdown } from '@/types/menuItem';

import DropdownMenu from './DropdownMenu';

const DropdownMenuWrapper: React.FC<{
  items: MenuItemDropdown[];
  defaultSelectedKey: string;
  onSelect: (selectedKey: string) => void;
}> = ({ items, defaultSelectedKey, onSelect }) => {
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
      className='min-w-[120px]'
    />
  );
};

export default DropdownMenuWrapper;
