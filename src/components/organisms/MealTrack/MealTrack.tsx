import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import { toast } from 'react-toastify';

import { SlideArrow } from '@/atoms/SlideArrow';
import { DayBox } from '@/organisms/DayBox';
import { useGetMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import { MealPlanState, setMealPlan } from '@/redux/slices/mealPlan';
import { UserState } from '@/redux/slices/user';
import type { MealPlanDay } from '@/types/mealPlan';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const MealTrack = () => {
  const dispatch = useDispatch();
  const userMealPlan = useSelector((state: MealPlanState) => state.mealPlan);
  const userId = useSelector((state: UserState) => state.id);
  const [getMealPlan, { isLoading }] = useGetMealPlanMutation();

  const getUserMealPlan = useCallback(async () => {
    try {
      const response = await getMealPlan(userId).unwrap();
      dispatch(setMealPlan(response?.data?.length ? response.data : []));
    } catch (error) {
      toast.error(`Failed to fetch meal plan:${error}`);
    }
  }, [getMealPlan, userId, dispatch]);

  useEffect(() => {
    getUserMealPlan();
  }, [getUserMealPlan]);

  const settings = {
    initialSlide: 3,
    dots: false,
    speed: 500,
    slidesToShow: 3,
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
      {userMealPlan.map((mealPlanDay: MealPlanDay, index: number) => (
        <div key={index}>
          <DayBox mealPlanDay={mealPlanDay} isLoading={isLoading} />
        </div>
      ))}
    </Slider>
  );
};

export default MealTrack;
