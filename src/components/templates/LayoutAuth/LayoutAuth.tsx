import React from 'react';

import { AuthHeader } from '@/molecules/AuthHeader';

interface LayoutAuthProps {
  children: React.ReactNode;
}

const LayoutAuth: React.FC<LayoutAuthProps> = ({ children }) => (
  <div className='flex min-h-screen flex-col bg-gray-100'>
    <AuthHeader />
    <main className='flex flex-1 items-start justify-center'>{children}</main>
  </div>
);

export default LayoutAuth;
