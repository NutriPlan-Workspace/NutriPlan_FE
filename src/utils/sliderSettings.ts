import React from 'react';

import { PLAN_TYPES } from '@/constants/plans';

export const getSliderSettings = (
  selectedPlan: string,
  handleBeforeChange: (current: number, next: number) => void,
  prevArrow: React.ReactElement,
  nextArrow: React.ReactElement,
) => ({
  initialSlide: 3,
  dots: false,
  speed: 200,
  slidesToShow: (() => {
    switch (selectedPlan) {
      case PLAN_TYPES.SINGLE_DAY:
        return 1;
      case PLAN_TYPES.MULTI_DAY:
        return 3;
      default:
        return 1;
    }
  })(),
  arrows: true,
  prevArrow,
  nextArrow,
  infinite: true,
  swipe: false,
  touchMove: false,
  centerMode: true,
  centerPadding: '30px',
  responsive:
    selectedPlan === PLAN_TYPES.MULTI_DAY
      ? [
          {
            breakpoint: 1250,
            settings: { slidesToShow: 2, slidesToScroll: 1 },
          },
          { breakpoint: 850, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ]
      : [],
  beforeChange: handleBeforeChange,
});
