import React from 'react';

import { PLAN_TYPES } from '@/constants/plans';

export const getSliderSettings = (
  selectedPlan: string,
  handleBeforeChange: (current: number, next: number) => void,
  prevArrow: React.ReactElement,
  nextArrow: React.ReactElement,
  parentWidth: number,
) => {
  const slidesToShow = (() => {
    if (selectedPlan === PLAN_TYPES.SINGLE_DAY) return 1;
    if (selectedPlan === PLAN_TYPES.MULTI_DAY) {
      if (parentWidth > 1150) return 3;
      if (parentWidth > 700) return 2;
    }
    return 1;
  })();

  return {
    initialSlide: 3,
    dots: false,
    speed: 200,
    slidesToShow,
    arrows: true,
    prevArrow,
    nextArrow,
    infinite: true,
    swipe: false,
    touchMove: false,
    centerMode: true,
    centerPadding: '30px',
    adaptiveHeight: false,
    beforeChange: handleBeforeChange,
  };
};
