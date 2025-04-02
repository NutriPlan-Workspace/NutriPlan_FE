import React from 'react';
import { Col, Row } from 'antd';

import { Button } from '@/atoms/Button';
import FoodCard from '@/molecules/BrowseFoodContent/FoodCard';
import type { Food } from '@/types/food';

interface FoodGridProps {
  foods: Food[];
  isFetching: boolean;
  onLoadMore: () => void;
}

const FoodGrid: React.FC<FoodGridProps> = ({
  foods,
  isFetching,
  onLoadMore,
}) => (
  <div>
    <Row gutter={[20, 80]} className='justify-center p-4'>
      {foods.map((food) => (
        <Col key={food._id} xs={24} sm={12} md={8} lg={6} xl={6}>
          <FoodCard foodItem={food} />
        </Col>
      ))}
    </Row>

    <div className='flex justify-center pt-10 pb-5'>
      <Button
        className='border-none bg-[#ffc84e] px-7 py-6 text-[16px] font-bold text-black hover:bg-[#ffb81c] hover:underline'
        onClick={onLoadMore}
        disabled={isFetching}
      >
        View More
      </Button>
    </div>
  </div>
);

export default FoodGrid;
