import React from 'react';
import { Skeleton } from 'antd';

const CategoryFoodSkeleton: React.FC = () => (
  <div className='my-3 flex flex-col gap-2 border-b border-b-black/10 pb-3'>
    <Skeleton.Node className='h-[24px] w-[150px]' active />
    <div className='flex flex-col gap-2'>
      {[...Array(3)].map((_, index) => (
        <div key={index} className='flex items-center gap-2.5'>
          <Skeleton.Avatar size={45} active />
          <div className='flex flex-col gap-2'>
            <Skeleton.Node className='h-[18px] w-[220px]' active />
            <Skeleton.Node className='h-[18px] w-[130px]' active />
          </div>
        </div>
      ))}
    </div>

    <div className='flex items-center justify-end'>
      <Skeleton.Button className='h-[32px] w-[100px]' active />
    </div>
  </div>
);

export default CategoryFoodSkeleton;
