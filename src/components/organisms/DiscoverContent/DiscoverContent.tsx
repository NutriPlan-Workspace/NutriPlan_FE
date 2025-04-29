import React, { useEffect, useRef } from 'react';
import { Col, Row } from 'antd';

import { FoodCardSkeleton } from '@/atoms/FoodCardSkeleton';
import FoodCard from '@/molecules/BrowseFoodContent/FoodCard';
import type { Food } from '@/types/food';

interface DiscoverContentProps {
  foods: Food[];
  isFetching: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

const DiscoverContent: React.FC<DiscoverContentProps> = ({
  foods,
  isFetching,
  onLoadMore,
  hasMore,
}) => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFoodListFull = foods.length === 8;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.8 },
    );
    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isFetching, onLoadMore, hasMore, isFoodListFull]);

  const renderContent = () => {
    if (isFetching && foods.length === 0) {
      return Array.from({ length: 8 }).map((_, index) => (
        <Col key={`skeleton-${index}`} xs={24} sm={12} md={8} lg={6} xl={6}>
          <FoodCardSkeleton />
        </Col>
      ));
    }

    return foods.map((food) => (
      <Col key={food._id} xs={24} sm={12} md={8} lg={6} xl={6}>
        <FoodCard foodItem={food} />
      </Col>
    ));
  };

  return (
    <div className='overflow-hidden'>
      <Row gutter={[30, 40]} className='justify-center p-4'>
        {renderContent()}
      </Row>

      <div ref={observerRef} className='h-10'></div>

      {isFetching && foods.length > 0 && (
        <Row gutter={[30, 40]} className='justify-center p-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Col
              key={`loading-skeleton-${index}`}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={6}
            >
              <FoodCardSkeleton />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DiscoverContent;
