import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';

import { SlideArrow } from '@/atoms/SlideArrow';
import { PLAN_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { useToast } from '@/contexts/ToastContext';
import { DayBox } from '@/organisms/DayBox';
import { useGetMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import { MealPlanState, setMealPlan } from '@/redux/slices/mealPlan';
import { UserState } from '@/redux/slices/user';
import type { MealPlanDay } from '@/types/mealPlan';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const MealTrack = () => {
  const dispatch = useDispatch();
  const { selectedPlan } = useDate();
  const userMealPlan = useSelector((state: MealPlanState) => state.mealPlan);
  const { showToastError } = useToast();
  const userId = useSelector((state: UserState) => state.id);
  const [getMealPlan, { isLoading }] = useGetMealPlanMutation();

  const getUserMealPlan = useCallback(async () => {
    try {
      const response = await getMealPlan(userId).unwrap();
      dispatch(setMealPlan(response?.data?.length ? response.data : []));
    } catch (error) {
      showToastError(`Failed to fetch meal plan:${error}`);
    }
  }, [getMealPlan, userId, dispatch]);

  useEffect(() => {
    getUserMealPlan();
  }, [getUserMealPlan]);

  const isSingleDay = useMemo(
    () => selectedPlan === PLAN_TYPES.SINGLE_DAY,
    [selectedPlan],
  );

  const slidesToShow = useMemo(() => {
    switch (selectedPlan) {
      case PLAN_TYPES.SINGLE_DAY:
        return 1;
      case PLAN_TYPES.MULTI_DAY:
        return 3;
      default:
        return 1;
    }
  }, [selectedPlan]);

  const responsiveSettings = useMemo(
    () =>
      selectedPlan === PLAN_TYPES.MULTI_DAY
        ? [
            {
              breakpoint: 1250,
              settings: { slidesToShow: 2, slidesToScroll: 1 },
            },
            {
              breakpoint: 850,
              settings: { slidesToShow: 1, slidesToScroll: 1 },
            },
          ]
        : [],
    [selectedPlan],
  );

  const settings = {
    initialSlide: 3,
    dots: false,
    speed: 500,
    slidesToShow: slidesToShow,
    arrows: true,
    infinite: false,
    prevArrow: <SlideArrow direction='prev' />,
    nextArrow: <SlideArrow direction='next' />,
    swipe: false,
    touchMove: false,
    centerMode: true,
    centerPadding: '30px',
    responsive: responsiveSettings,
  };

  return (
    <Slider {...settings} className='h-full w-full'>
      {userMealPlan.map((mealPlanDay: MealPlanDay, index: number) => (
        <div key={index}>
          <DayBox
            mealPlanDay={mealPlanDay}
            isLoading={isLoading}
            isSingleDay={isSingleDay}
          />
        </div>
      ))}
    </Slider>
  );
};

export default MealTrack;
