import React from 'react';
import { Col, Row } from 'antd';

import { Button } from '@/atoms/Button';
import { FoodCardSkeleton } from '@/atoms/FoodCardSkeleton';
import { cn } from '@/helpers/helpers';
import FoodCard from '@/molecules/BrowseFoodContent/FoodCard';
import type { Food } from '@/types/food';

interface FoodGridProps {
  foods: Food[];
  isFetching: boolean;
  onLoadMore?: () => void;
  showPopover?: boolean;
  isLastPage?: boolean;
}

const FoodGrid: React.FC<FoodGridProps> = ({
  foods,
  isFetching,
  onLoadMore,
  isLastPage,
  showPopover = true,
}) => {
  const noResults = !isFetching && foods.length === 0;

  const renderContent = () => {
    const renderedFoods = foods.map((food) => (
      <Col key={food._id} xs={24} sm={12} md={8} lg={6} xl={6}>
        <FoodCard foodItem={food} showPopover={showPopover} />
      </Col>
    ));

    const skeletons = isFetching
      ? Array.from({ length: 8 }).map((_, index) => (
          <Col key={`skeleton-${index}`} xs={24} sm={12} md={8} lg={6} xl={6}>
            <FoodCardSkeleton />
          </Col>
        ))
      : [];

    return [...renderedFoods, ...skeletons];
  };

  return (
    <div>
      <Row gutter={[30, 40]} className={cn('justify-center p-4')}>
        {renderContent()}
      </Row>
      {showPopover && (
        <div className='flex justify-center pt-10 pb-5'>
          {noResults ? (
            <p className='text-lg text-gray-500 italic'>
              No food items found matching your filters.
            </p>
          ) : !isLastPage ? (
            <Button
              className='border-none bg-[#ffc84e] px-7 py-6 text-[16px] font-bold text-black hover:bg-[#ffb81c] hover:underline'
              onClick={onLoadMore}
              disabled={isFetching}
            >
              View More
            </Button>
          ) : (
            !isFetching &&
            showPopover && (
              <p className='text-base text-gray-500'>
                You&apos;ve reached the end of the list.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default FoodGrid;
