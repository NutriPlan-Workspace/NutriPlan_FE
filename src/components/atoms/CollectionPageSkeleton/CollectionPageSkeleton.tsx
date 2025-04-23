import React from 'react';
import { Col, Row, Skeleton } from 'antd';

const CollectionPageSkeleton: React.FC = () => {
  const placeholderCount = 8;

  return (
    <div className='flex flex-col gap-4'>
      <Row gutter={[12, 12]}>
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <Col key={index} span={4}>
            <div className='rounded-md p-2 hover:bg-gray-100'>
              <Skeleton.Image style={{ width: 150, height: 120 }} active />
              <Skeleton active title={false} paragraph={{ rows: 2 }} />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CollectionPageSkeleton;
