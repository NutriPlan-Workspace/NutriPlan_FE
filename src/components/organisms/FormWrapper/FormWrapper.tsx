import React from 'react';
import { Card } from 'antd';

import { cn } from '@/helpers/helpers';

interface FormWrapperProps {
  children: React.ReactNode;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ children }) => (
  <div className='mt-[10vh] flex min-h-[400px] w-[90%] flex-col items-center rounded-lg bg-white p-12 text-center shadow-md md:max-w-[537px]'>
    <Card className='flex h-full w-full flex-col items-center border-none shadow-none'>
      <h2 className={cn('font-display mb-8 text-2xl font-semibold md:px-8')}>
        Welcome back!
      </h2>
      {children}
    </Card>
  </div>
);

export default FormWrapper;
