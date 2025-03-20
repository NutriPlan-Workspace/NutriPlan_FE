import React from 'react';
import { Skeleton } from 'antd';

const MealBoxSkeleton: React.FC = () => (
  <>
    <Skeleton.Node className='flex h-[24px] w-[80px] items-center' active />
    <Skeleton.Node
      className='mt-[5px] flex h-[18px] w-[85px] items-center'
      active
    />
    <div className='mt-3 flex items-center justify-start gap-2.5'>
      <Skeleton.Avatar size={45} active />
      <div className='flex flex-col gap-2'>
        <Skeleton.Node
          className='flex h-[18px] w-[220px] items-center'
          active
        />
        <Skeleton.Node
          className='flex h-[18px] w-[130px] items-center'
          active
        />
      </div>
    </div>
  </>
);

export default MealBoxSkeleton;
