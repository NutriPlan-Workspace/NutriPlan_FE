import React from 'react';
import { Link } from '@tanstack/react-router';

import { PATH } from '@/constants/path';

const AuthHeader: React.FC = () => (
  <header className='bg-gray-9 mx-auto flex h-[72px] w-full items-center justify-between px-6 md:pr-12'>
    {/* Logo in here */}
    <Link to={PATH.HOME} className='font-display text-2xl font-bold text-white'>
      <img
        src='https://res.cloudinary.com/dtwrwvffl/image/upload/v1746503177/tm52qbgqp7zljjgizukj.png'
        alt='Logo'
        className='w-36 object-cover'
      />
    </Link>
    <div className='flex cursor-pointer items-center'></div>
  </header>
);

export default AuthHeader;
