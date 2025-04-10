import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

import { HTTP_STATUS } from '@/constants/httpStatus';
import { PATH } from '@/constants/path';
import {
  authApi,
  useLogoutRequestMutation,
} from '@/redux/query/apis/auth/authApi';
import { removeUser } from '@/redux/slices/user';
import { showToastError } from '@/utils/toastUtils';

import { collapsedMenuItems, fullMenuItems } from './SidebarItems';

interface SidebarMenuProps {
  isCollapsed: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
  const [logout, { isLoading }] = useLogoutRequestMutation();

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const handleMenuClick: MenuProps['onClick'] = async (e) => {
    if (e.key === PATH.LOGOUT) {
      try {
        const response = await logout().unwrap();
        if (response.code === HTTP_STATUS.OK) {
          dispatch(authApi.util.resetApiState());
          dispatch(removeUser());
          navigate({ to: PATH.HOME });
        }
      } catch {
        showToastError('Logout failed. Please try again.');
      }
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
      disabled={isLoading}
    />
  );
};

export default SidebarMenu;
