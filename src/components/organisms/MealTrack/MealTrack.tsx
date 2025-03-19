import Slider, { LazyLoadTypes } from 'react-slick';
import { MealPlanDays } from 'data/mealPlan';

import { SlideArrow } from '@/atoms/SlideArrow';
import { DayBox } from '@/organisms/DayBox';
import type { MealPlanDay } from '@/types/mealPlan';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const MealTrack = () => {
  const settings = {
    initialSlide: 3,
    dots: false,
    speed: 500,
    slidesToShow: 3,
    lazyLoad: 'demand' as LazyLoadTypes,
    arrows: true,
    infinite: false,
    prevArrow: <SlideArrow direction='prev' />,
    nextArrow: <SlideArrow direction='next' />,
    swipe: false,
    touchMove: false,
    centerMode: true,
    centerPadding: '30px',
    responsive: [
      { breakpoint: 1250, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 850, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <Slider {...settings} className='h-full w-full overflow-hidden'>
      {MealPlanDays.map((mealPlanDay: MealPlanDay, index: number) => (
        <div key={index}>
          <DayBox mealPlanDay={mealPlanDay} isLoading={false} />
        </div>
      ))}
    </Slider>
  );
};

export default MealTrack;
