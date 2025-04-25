import React from 'react';
import { Skeleton } from 'antd';

const FoodCardCollectionSkeleton: React.FC = () => (
  <div className='flex max-w-[650px] items-center rounded-[5px] border-2 border-transparent bg-white p-[3px_3px] transition-all duration-200 hover:shadow-md'>
    <Skeleton.Avatar
      active
      shape='square'
      size={50}
      className='rounded-[10px]'
    />
    <div className='ml-[10px] flex w-full flex-col justify-center gap-[3px] pr-[10px]'>
      <Skeleton.Input active size='small' style={{ width: '150px' }} />
    </div>
  </div>
);

export default FoodCardCollectionSkeleton;
