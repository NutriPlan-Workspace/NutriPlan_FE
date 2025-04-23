import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';

import type { MenuItemDropdown } from '@/types/menuItem';

interface MenuOptionProps {
  selectedOption?: string;
  items: MenuItemDropdown[];
  className?: string;
  onSelect?: (selectedKey: string) => void;
}

const MenuOption: React.FC<MenuOptionProps> = ({
  items,
  className,
  onSelect,
  selectedOption,
}) => {
  const [selectedItem, setSelectedItem] = useState<string>(
    selectedOption ?? items[0]?.key ?? 0,
  );

  useEffect(() => {
    if (selectedOption !== undefined) {
      setSelectedItem(selectedOption);
    }
  }, [selectedOption]);

  const handleMenuClick = (e: { key: string }) => {
    setSelectedItem(e.key);
    onSelect?.(e.key);
  };

  return (
    <div className={`border-none bg-white shadow-md ${className}`}>
      <Menu
        selectedKeys={[selectedItem]}
        onClick={handleMenuClick}
        className='w-full'
        items={items}
      />
    </div>
  );
};

export default MenuOption;
