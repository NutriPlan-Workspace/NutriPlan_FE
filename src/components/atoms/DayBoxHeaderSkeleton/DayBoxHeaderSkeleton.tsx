import { Skeleton } from 'antd';

const DayBoxHeaderSkeleton = () => (
  <div className='mb-[10px] px-[15px]'>
    <Skeleton.Input active size='small' style={{ width: 80 }} />
    <div className='mt-2 flex justify-between'>
      <Skeleton.Input active size='large' style={{ width: 60, height: 50 }} />
      <Skeleton.Button active size='small' style={{ width: 40 }} />
    </div>
  </div>
);

export default DayBoxHeaderSkeleton;
