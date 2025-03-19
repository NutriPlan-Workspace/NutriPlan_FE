import React from 'react';
import { Link } from '@tanstack/react-router';

import { Button } from '@/atoms/Button';
import { SidebarMenu } from '@/atoms/SidebarMenu';
import { PATH } from '@/constants/path';
import { SidebarTop } from '@/molecules/SidebarTop';

interface SidebarProps {
  onClickMenu: () => void;
  onClickAvatar?: () => void;
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  onClickMenu,
  onClickAvatar,
  isCollapsed,
}) => (
  <div className='scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-transparent flex h-full max-h-screen w-full flex-col gap-4 overflow-y-auto bg-white pt-4 shadow-md'>
    <div className='px-5'>
      <SidebarTop
        isCollapsed={isCollapsed}
        onClickMenu={onClickMenu}
        onClickAvatar={onClickAvatar}
      />
    </div>

    <div className='flex w-full justify-center'>
      <SidebarMenu isCollapsed={isCollapsed} />
    </div>

    {!isCollapsed && (
      <div className='mb-4 flex items-center justify-center'>
        {/* Logo in here */}
        <Button className='h-[40px] w-[90%] cursor-pointer rounded-2xl border-none hover:bg-gray-300 hover:text-black'>
          <Link to={PATH.MEAL_PLAN}>Nutri Plan</Link>
        </Button>
      </div>
    )}
  </div>
);

export default Sidebar;
