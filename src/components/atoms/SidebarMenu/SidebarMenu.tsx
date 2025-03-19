import React, { useEffect, useState } from 'react';
import { useLocation } from '@tanstack/react-router';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

import { PATH } from '@/constants/path';

import { collapsedMenuItems, fullMenuItems } from './SidebarItems';

interface SidebarMenuProps {
  isCollapsed: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === PATH.LOGOUT) {
      // TODO : handle logout
      return;
    }
    setSelectedKey(e.key);
  };

  return (
    <Menu
      defaultSelectedKeys={['planner']}
      selectedKeys={[selectedKey]}
      defaultOpenKeys={['planner']}
      onClick={handleMenuClick}
      mode='inline'
      items={isCollapsed ? collapsedMenuItems : fullMenuItems}
      className='w-[95%] border-none text-[15px]'
    />
  );
};

export default SidebarMenu;
