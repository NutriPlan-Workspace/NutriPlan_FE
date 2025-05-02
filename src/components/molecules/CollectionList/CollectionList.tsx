import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Col, Image, Row, Typography } from 'antd';

import defaultImage from '@/assets/default_img.svg';
import type { Collection } from '@/types/collection';

const { Paragraph } = Typography;

interface CollectionListProps {
  collections: Collection[];
}

const CollectionList: React.FC<CollectionListProps> = ({ collections }) => {
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate({
      to: '/collections/$id',
      params: { id },
    });
  };

  return (
    <Row gutter={[12, 12]} className='w-full'>
      {collections.map((collection) => (
        <Col
          key={collection._id}
          span={4}
          className='w-full cursor-pointer rounded-md hover:bg-gray-100'
          onClick={() => handleClick(collection._id)}
        >
          <div className='flex min-w-[160px] flex-col gap-2 p-2'>
            <Image
              src={collection.img || defaultImage}
              className='h-auto w-full min-w-[160px] rounded-md object-cover'
              preview={false}
            />
            <Paragraph className='m-0 min-w-[160px]'>
              {collection.title}
            </Paragraph>
            <Paragraph className='m-0 min-w-[160px] text-sm font-thin text-gray-400'>
              {collection.description}
            </Paragraph>
            <Paragraph className='m-0 min-w-[160px] text-sm font-thin text-gray-400'>
              {collection.foods.length} Item
              {collection.foods.length !== 1 ? 's' : ''}
            </Paragraph>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default CollectionList;
