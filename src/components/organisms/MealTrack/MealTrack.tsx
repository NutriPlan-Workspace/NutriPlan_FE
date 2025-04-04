import React, { useMemo } from 'react';
import Slider from 'react-slick';

import { SlideArrow } from '@/atoms/SlideArrow';
import { PLAN_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { useMealTrack } from '@/hooks/useMealTrack';
import { useMealTrackDragDrop } from '@/hooks/useMealTrackDragDrop';
import { DayBox } from '@/organisms/DayBox';
import { getSliderSettings } from '@/utils/sliderSettings';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface MealTrackProps {
  selectedDate: Date;
}

const MealTrack: React.FC<MealTrackProps> = ({ selectedDate }) => {
  const { selectedPlan } = useDate();
  const isSingleDay = useMemo(
    () => selectedPlan === PLAN_TYPES.SINGLE_DAY,
    [selectedPlan],
  );

  const {
    isLoadingList,
    viewingMealPlans,
    handleBeforeChange,
    handleCreateBlank,
    handleCopyPreviousDay,
  } = useMealTrack(selectedDate);
  useMealTrackDragDrop();

  const settings = getSliderSettings(
    selectedPlan,
    handleBeforeChange,
    <SlideArrow direction='prev' />,
    <SlideArrow direction='next' />,
  );

  return (
    <Slider {...settings} className='relative h-full w-full overflow-auto'>
      {viewingMealPlans.map(({ mealDate, mealPlanDay }, index) => (
        <DayBox
          key={mealDate}
          mealPlanDay={mealPlanDay}
          mealDate={new Date(mealDate)}
          isLoading={isLoadingList[index]}
          isSingleDay={isSingleDay}
          onCreateBlank={handleCreateBlank}
          onCopyPreviousDay={handleCopyPreviousDay}
        />
      ))}
    </Slider>
  );
};

export default MealTrack;
