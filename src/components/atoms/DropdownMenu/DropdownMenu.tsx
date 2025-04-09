import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';
import { cn } from 'helpers/helpers';

import { PLAN_TYPES } from '@/constants/plans';
import { MenuItemDropdown } from '@/types/menuItem';

interface DropdownMenuProps {
  items: MenuItemDropdown[];
  className?: string;
  onSelect?: (selectedKey: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  className,
  onSelect,
}) => {
  const [selectedItem, setSelectedItem] = useState<string>(
    items[0].label ?? '',
  );

  const handleMenuClick = (e: { key: string }) => {
    const selected = items.find((item) => item.key === e.key);
    if (selected) {
      setSelectedItem(selected.label);
      onSelect?.(selected.key);
    }
  };

  return (
    <div
      className={cn(
        'h-[40px] rounded-sm border border-[#ced4da] px-2 leading-[1.5] text-[#495057]',
        className,
      )}
    >
      <Dropdown
        menu={{
          items,
          selectable: true,
          defaultSelectedKeys: [PLAN_TYPES.SINGLE_DAY],
          onClick: handleMenuClick,
        }}
        className='flex h-[40px] items-center text-black'
        trigger={['click']}
      >
        <Typography.Link className='flex h-full items-center'>
          <Space>
            {selectedItem}
            <DownOutlined />
          </Space>
        </Typography.Link>
      </Dropdown>
    </div>
  );
};

export default DropdownMenu;
