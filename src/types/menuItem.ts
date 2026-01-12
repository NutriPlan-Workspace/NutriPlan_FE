import React from 'react';

export interface MenuItem {
  key?: string;
  label?: string;
  icon?: React.ComponentType<{ className: string }>;
  type?: 'item' | 'divider';
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  wrapper?: (button: React.ReactElement) => React.ReactElement;
}

export interface MenuItemDropdown {
  key: string;
  label: string;
  icon?: React.ReactNode;
}
