import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Col, Image, Row, Typography } from 'antd';

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
              src={
                collection.img ||
                (collection.isFavorites
                  ? 'https://img.freepik.com/free-photo/chicken-fajita-chicken-fillet-fried-with-bell-pepper-lavash-with-bread-slices-white-plate_114579-174.jpg?t=st=1746506112~exp=1746509712~hmac=8bddd99a63709df09e8e40e0d7855c1584bcc4c86310d2e1b79ec6e9ae1f4f82&w=740'
                  : 'https://st.depositphotos.com/1809906/1375/v/950/depositphotos_13755635-stock-illustration-food-collection.jpg')
              }
              className='aspect-square min-w-[160px] rounded-md object-cover'
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
