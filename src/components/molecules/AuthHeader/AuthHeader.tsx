import React from 'react';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { Link } from '@tanstack/react-router';
import { Typography } from 'antd';

import { PATH } from '@/constants/path';

const { Text } = Typography;

const AuthHeader: React.FC = () => (
  <header className='bg-gray-9 mx-auto flex h-[72px] w-full items-center justify-between px-6 md:pr-12'>
    {/* Logo in here */}
    <Link to={PATH.HOME} className='font-display text-2xl font-bold text-white'>
      Nutri Plan
    </Link>
    <div className='flex cursor-pointer items-center'>
      <IoChatbubbleEllipsesOutline className='mr-2 h-6 w-6 text-white' />
      <Text className='text-sm text-[14px] text-white'>Need Help?</Text>
    </div>
  </header>
);

export default AuthHeader;
