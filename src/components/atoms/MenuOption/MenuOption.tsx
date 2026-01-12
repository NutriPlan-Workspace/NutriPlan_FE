import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';

import { cn } from '@/helpers/helpers';
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
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_12px_28px_-24px_rgba(16,24,40,0.3)]',
        className,
      )}
    >
      <Menu
        selectedKeys={[selectedItem]}
        onClick={handleMenuClick}
        className='w-full border-0'
        items={items}
      />
    </div>
  );
};

export default MenuOption;
