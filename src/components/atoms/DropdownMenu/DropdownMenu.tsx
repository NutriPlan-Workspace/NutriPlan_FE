import React, { useMemo, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';
import { cn } from 'helpers/helpers';

import { PLAN_TYPES } from '@/constants/plans';
import type { MenuItemDropdown } from '@/types/menuItem';

interface DropdownMenuProps {
  items: MenuItemDropdown[];
  className?: string;
  onSelect?: (selectedKey: string) => void;
  variant?: 'default' | 'icon-only';
  ariaLabel?: string;
  selectedKey?: string;
  defaultSelectedKey?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  className,
  onSelect,
  variant = 'default',
  ariaLabel,
  selectedKey: controlledSelectedKey,
  defaultSelectedKey,
}) => {
  const [uncontrolledSelectedKey, setUncontrolledSelectedKey] =
    useState<string>(defaultSelectedKey ?? items[0]?.key ?? '');

  const selectedKey = controlledSelectedKey ?? uncontrolledSelectedKey;

  const selectedItem = useMemo(
    () => items.find((item) => item.key === selectedKey) ?? items[0],
    [items, selectedKey],
  );

  const handleMenuClick = (e: { key: string }) => {
    const selected = items.find((item) => item.key === e.key);
    if (selected) {
      if (controlledSelectedKey === undefined) {
        setUncontrolledSelectedKey(selected.key);
      }
      onSelect?.(selected.key);
    }
  };

  return (
    <div
      className={cn(
        variant === 'icon-only'
          ? 'flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/55 text-gray-700 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.4)] backdrop-blur-xl transition hover:bg-white/70'
          : 'flex h-10 items-center rounded-2xl border border-gray-200 bg-white/90 px-3 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white',
        className,
      )}
    >
      <Dropdown
        menu={{
          items,
          selectable: true,
          selectedKeys: selectedKey ? [selectedKey] : [PLAN_TYPES.SINGLE_DAY],
          onClick: handleMenuClick,
        }}
        className='flex h-full items-center text-gray-900'
        trigger={['click']}
      >
        <Typography.Link
          aria-label={
            ariaLabel ?? (selectedItem?.label ? selectedItem.label : 'Menu')
          }
          className='flex h-full items-center text-inherit no-underline hover:text-inherit'
        >
          {variant === 'icon-only' ? (
            <span className='flex items-center justify-center'>
              {selectedItem?.icon ?? <DownOutlined className='text-gray-500' />}
            </span>
          ) : (
            <Space>
              {selectedItem?.label ?? ''}
              <DownOutlined className='text-gray-500' />
            </Space>
          )}
        </Typography.Link>
      </Dropdown>
    </div>
  );
};

export default DropdownMenu;
