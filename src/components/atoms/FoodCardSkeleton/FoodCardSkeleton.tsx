import React from 'react';
import { Skeleton } from 'antd';

const FoodCardSkeleton: React.FC = () => (
  <div className='flex cursor-pointer flex-col items-center gap-1 rounded-lg border-none shadow-md'>
    <Skeleton.Image active className='h-[200px] w-full rounded-t-md' />
    <Skeleton.Node active className='h-[14px] w-[140px]' />
    <div className='flex items-center justify-center gap-2 pt-1'>
      <Skeleton.Button active shape='circle' />
      <Skeleton.Node active className='h-[16px] w-[120px]' />
    </div>
  </div>
);

export default FoodCardSkeleton;
