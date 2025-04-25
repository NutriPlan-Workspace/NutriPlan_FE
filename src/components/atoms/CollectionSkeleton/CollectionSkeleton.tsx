import React from 'react';
import { FaArrowLeft, FaPencil } from 'react-icons/fa6';
import { MdDelete, MdOutlinePushPin } from 'react-icons/md';
import { Skeleton } from 'antd';

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
        <div className='mt-8 flex items-center gap-2'>
          <div className='flex items-center gap-2'>
            <Skeleton.Button active size='small' style={{ width: 100 }} />
            <FaPencil />
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton.Button active size='small' style={{ width: 150 }} />
            <MdOutlinePushPin />
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton.Button active size='small' style={{ width: 100 }} />
            <MdDelete />
          </div>
        </div>
      </div>
    </div>
    <Skeleton active paragraph={{ rows: 3 }} />
  </div>
);

export default CollectionSkeleton;
