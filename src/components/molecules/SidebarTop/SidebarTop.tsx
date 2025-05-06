import React from 'react';
import { IoMenu } from 'react-icons/io5';
import { useSelector } from 'react-redux';

import { Button } from '@/atoms/Button';
import { cn } from '@/helpers/helpers';
import { userSelector } from '@/redux/slices/user';

interface SidebarTopProps {
  onClickMenu: () => void;
  onClickAvatar?: () => void;
  isCollapsed: boolean;
}

const SidebarTop: React.FC<SidebarTopProps> = ({
  onClickMenu,
  onClickAvatar,
  isCollapsed,
}) => {
  const user = useSelector(userSelector).user;

  return (
    <div
      className={cn('w-full', {
        'flex flex-col items-center justify-center': isCollapsed,
      })}
    >
      <div className='mb-4 flex h-[40px] items-center justify-between'>
        <Button
          onClick={onClickMenu}
          className='border-secondary hover:bg-secondary-50 flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full border p-2'
        >
          <IoMenu className='text-secondary h-10 w-10' />
        </Button>
      </div>

      {!isCollapsed && (
        <div className='flex items-center gap-2'>
          <Button
            onClick={onClickAvatar}
            className='h-[40px] w-[40px] rounded-full border-none p-0 outline-none'
          >
            <img
              src='https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510622/wlqbqzxb5uqvlm9zvugw.png'
              alt=''
              className='h-full w-full rounded-full'
            />
          </Button>
          <div className='flex flex-col gap-0.5'>
            <p className='font-display font-semibold'>{user.fullName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarTop;
