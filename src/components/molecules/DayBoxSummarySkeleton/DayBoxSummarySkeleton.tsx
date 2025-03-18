import React from 'react';
import { Skeleton } from 'antd';

const DayBoxSummarySkeleton: React.FC = () => (
  <div className='flex items-center justify-start gap-2.5'>
    <Skeleton.Avatar size={25} active />
    <Skeleton.Node className='flex h-[18px] w-[100px] items-center' active />
  </div>
);

export default DayBoxSummarySkeleton;
