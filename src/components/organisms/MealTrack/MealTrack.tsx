import React, { useEffect, useMemo, useRef, useState } from 'react';
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

const MealTrack: React.FC = () => {
  const { selectedPlan, selectedDate } = useDate();
  const parentRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<Slider | null>(null);
  const [parentWidth, setParentWidth] = useState(0);

  useEffect(() => {
    if (!parentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setParentWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(parentRef.current);

    return () => resizeObserver.disconnect();
  }, []);

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
  } = useMealTrack(selectedDate, sliderRef);
  useMealTrackDragDrop();

  const settings = getSliderSettings(
    selectedPlan,
    handleBeforeChange,
    <SlideArrow direction='prev' />,
    <SlideArrow direction='next' />,
    parentWidth,
  );

  return (
    <div ref={parentRef} className='w-full'>
      <div className='w-full overflow-x-hidden'>
        <Slider ref={sliderRef} {...settings} className='w-full'>
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
      </div>
    </div>
  );
};

export default MealTrack;
