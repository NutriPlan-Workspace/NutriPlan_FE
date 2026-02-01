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
    <Row gutter={[18, 18]} className='w-full'>
      {collections.map((collection) => (
        <Col
          key={collection._id}
          xs={24}
          sm={12}
          md={8}
          lg={6}
          xl={6}
          className='w-full'
          onClick={() => handleClick(collection._id)}
        >
          <div className='group h-full cursor-pointer rounded-3xl border border-gray-200/70 bg-white/65 p-3 shadow-[0_14px_36px_-32px_rgba(16,24,40,0.22)] transition hover:-translate-y-0.5 hover:border-gray-200 hover:bg-white/85 hover:shadow-[0_18px_44px_-34px_rgba(16,24,40,0.28)]'>
            <Image
              src={
                collection.img ||
                (collection.isFavorites
                  ? 'https://img.freepik.com/free-photo/chicken-fajita-chicken-fillet-fried-with-bell-pepper-lavash-with-bread-slices-white-plate_114579-174.jpg?t=st=1746506112~exp=1746509712~hmac=8bddd99a63709df09e8e40e0d7855c1584bcc4c86310d2e1b79ec6e9ae1f4f82&w=740'
                  : collection.isExclusions
                    ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop'
                    : 'https://st.depositphotos.com/1809906/1375/v/950/depositphotos_13755635-stock-illustration-food-collection.jpg')
              }
              className='aspect-square w-full rounded-2xl object-cover'
              preview={false}
            />
            <div className='mt-3 space-y-1 px-1'>
              <Paragraph className='m-0 line-clamp-1 text-sm font-semibold text-gray-900'>
                {collection.title}
              </Paragraph>
              <Paragraph className='m-0 line-clamp-2 text-xs text-gray-600'>
                {collection.description || 'No description'}
              </Paragraph>
              <Paragraph className='m-0 text-xs font-medium text-gray-500'>
                {collection.foods.length} item
                {collection.foods.length !== 1 ? 's' : ''}
              </Paragraph>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default CollectionList;
