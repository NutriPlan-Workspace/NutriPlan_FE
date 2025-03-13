import React from 'react';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { Typography } from 'antd';

const { Text } = Typography;

const AuthHeader: React.FC = () => (
  <header className='bg-gray-9 mx-auto flex h-[72px] w-full items-center justify-between px-6 md:pr-12'>
    {/* Logo in here */}
    <div className='font-display text-2xl font-bold text-white'>Nutri Plan</div>
    <div className='flex cursor-pointer items-center'>
      <ChatBubbleOvalLeftEllipsisIcon className='mr-2 h-6 w-6 text-white' />
      <Text className='text-sm text-[14px] text-white'>Need Help?</Text>
    </div>
  </header>
);

export default AuthHeader;
