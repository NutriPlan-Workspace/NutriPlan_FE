import { MenuProps } from 'antd';

import { MenuItem } from '@/types/menuItem';

export const getMealMenuItems = (
  menuItemsRef: MenuItem[],
): MenuProps['items'] =>
  menuItemsRef.map((item, index) => {
    if (item.type === 'divider') return { type: 'divider' };

    const button = (
      <button
        className='flex cursor-pointer items-center gap-2'
        onClick={item.onClick}
      >
        {item.icon && <item.icon className='text-xl' />}
        <span>{item.label}</span>
      </button>
    );

    return {
      key: String(index),
      label: typeof item.wrapper === 'function' ? item.wrapper(button) : button,
    };
  });
