import React from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { Skeleton } from 'antd';

import { ActionButtons } from '@/molecules/ActionButtons';

const CollectionSkeleton: React.FC = () => (
  <div className='m-4 flex flex-col gap-4'>
    <div className='flex items-center gap-4'>
      <FaArrowLeft />
      <Skeleton.Button active size='large' style={{ width: 200 }} />
    </div>
    <div className='flex items-start gap-6'>
      <div className='flex flex-col gap-2'>
        <Skeleton.Image active style={{ width: 200, height: 200 }} />
        <Skeleton.Button active size='small' style={{ width: 120 }} />
      </div>
      <div className='mt-4 flex flex-col justify-between gap-14'>
        <Skeleton active paragraph={{ rows: 2 }} />
        <ActionButtons />
      </div>
    </div>
    <Skeleton active paragraph={{ rows: 3 }} />
  </div>
);

export default CollectionSkeleton;
