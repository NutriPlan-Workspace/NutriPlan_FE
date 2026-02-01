import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import { toast } from 'react-toastify';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { ADJUST_DISTANCE, NUM_OF_SLIDES } from '@/constants/mealPlan';
import { useGetFavoriteFoodsQuery } from '@/redux/query/apis/collection/collectionApi';
import {
  useGetMealPlanDayRangeQuery,
  useLazyGetMealPlanSingleDayQuery,
} from '@/redux/query/apis/mealPlan/mealPlanApi';
import { setFavoriteList } from '@/redux/slices/collection';
import {
  mealPlanSelector,
  updateViewingMealPlanByIndex,
} from '@/redux/slices/mealPlan';
import {
  getDiffDays,
  getMealDate,
  isSameDay,
  shiftDate,
} from '@/utils/dateUtils';

export const useMealTrack = (
  selectedDate: Date,
  sliderRef?: React.RefObject<Slider | null>,
) => {
  const dispatch = useDispatch();
  const viewingMealPlans = useSelector(mealPlanSelector).viewingMealPlans;
  const cacheMealPlans = useSelector(mealPlanSelector).cacheMealPlans;
  const [isLoadingList, setIsLoadingList] = useState<boolean[]>(
    Array(NUM_OF_SLIDES).fill(true),
  );
  const [currentSlide, setCurrentSlide] = useState(3);
  const isTooFarJumpRef = useRef(false);
  const [getMealPlanSingleDay] = useLazyGetMealPlanSingleDayQuery();
  const prevSelectedDateForJumpRef = useRef<Date | null>(null);
  const prevDateRef = useRef<Date | null>(null);

  const { data: favoriteFoods } = useGetFavoriteFoodsQuery();

  useEffect(() => {
    if (favoriteFoods?.data) {
      dispatch(setFavoriteList(favoriteFoods.data));
    }
  }, [favoriteFoods, dispatch]);

  const { from, to } = useMemo(() => {
    if (!selectedDate) return {};
    if (!prevDateRef.current) {
      prevDateRef.current = selectedDate;
      const from = new Date(selectedDate);
      from.setDate(from.getDate() - ADJUST_DISTANCE);
      const to = new Date(selectedDate);
      to.setDate(to.getDate() + ADJUST_DISTANCE);
      return {
        from: getMealDate(from),
        to: getMealDate(to),
      };
    }
    const prevDate = prevDateRef.current;
    const nextDate = shiftDate(prevDate, 1);
    const prevDateShifted = shiftDate(prevDate, -1);
    if (isSameDay(selectedDate, nextDate)) {
      const nextIndex = (currentSlide + 1) % NUM_OF_SLIDES;
      setCurrentSlide(nextIndex);
      sliderRef?.current?.slickNext();
      prevDateRef.current = selectedDate;
      return {};
    }
    if (isSameDay(selectedDate, prevDateShifted)) {
      const prevIndex = (currentSlide - 1 + NUM_OF_SLIDES) % NUM_OF_SLIDES;
      setCurrentSlide(prevIndex);
      sliderRef?.current?.slickPrev();
      prevDateRef.current = selectedDate;
      return {};
    }
    prevDateRef.current = selectedDate;
    const from = new Date(selectedDate);
    from.setDate(from.getDate() - ADJUST_DISTANCE);
    const to = new Date(selectedDate);
    to.setDate(to.getDate() + ADJUST_DISTANCE);
    sliderRef?.current?.slickGoTo(3);
    setCurrentSlide(3);
    return {
      from: getMealDate(from),
      to: getMealDate(to),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const dayRangeArgs = from && to ? { from, to } : skipToken;

  const {
    refetch: refetchViewingMealPlans,
    isFetching: isFetchingViewingMealPlans,
  } = useGetMealPlanDayRangeQuery(dayRangeArgs);

  useEffect(() => {
    if (from && to) {
      refetchViewingMealPlans();
    }
  }, [from, to, refetchViewingMealPlans]);

  useEffect(() => {
    setIsLoadingList(Array(NUM_OF_SLIDES).fill(isFetchingViewingMealPlans));
  }, [isFetchingViewingMealPlans]);

  useEffect(() => {
    if (!selectedDate) return;

    if (!prevSelectedDateForJumpRef.current) {
      prevSelectedDateForJumpRef.current = selectedDate;
      isTooFarJumpRef.current = false;
      return;
    }

    const diffDays = getDiffDays(
      selectedDate,
      prevSelectedDateForJumpRef.current,
    );

    prevSelectedDateForJumpRef.current = selectedDate;
    const tooFar = diffDays >= 2;
    isTooFarJumpRef.current = tooFar;
  }, [selectedDate]);

  const updateLastElement = useCallback(
    (current: number, next: number, isForward: boolean) => {
      const mod = (n: number, m: number) => ((n % m) + m) % m;
      const preAdjustingIndex = isForward
        ? mod(current + ADJUST_DISTANCE, NUM_OF_SLIDES)
        : mod(current - ADJUST_DISTANCE, NUM_OF_SLIDES);
      const adjustingIndex = isForward
        ? mod(next + ADJUST_DISTANCE, NUM_OF_SLIDES)
        : mod(next - ADJUST_DISTANCE, NUM_OF_SLIDES);
      const item = viewingMealPlans[preAdjustingIndex];
      if (!item) return;

      const adjustingDay = new Date(item.mealDate);
      adjustingDay.setDate(adjustingDay.getDate() + (isForward ? 1 : -1));

      const mealPlanWithDate = cacheMealPlans.find((mealPlanWithDate) =>
        isSameDay(new Date(mealPlanWithDate.mealDate), adjustingDay),
      );

      if (mealPlanWithDate) {
        dispatch(
          updateViewingMealPlanByIndex({
            mealPlanWithDate,
            index: adjustingIndex,
          }),
        );
        setIsLoadingList((prev) => {
          const newLoading = [...prev];
          newLoading[adjustingIndex] = false;
          return newLoading;
        });
      } else {
        dispatch(
          updateViewingMealPlanByIndex({
            mealPlanWithDate: {
              mealDate: getMealDate(adjustingDay),
              mealPlanDay: undefined,
            },
            index: adjustingIndex,
          }),
        );
      }

      setIsLoadingList((prev) => {
        const newLoading = [...prev];
        newLoading[adjustingIndex] = !mealPlanWithDate;
        return newLoading;
      });
    },
    [cacheMealPlans, dispatch, viewingMealPlans],
  );

  const updateNextToElement = useCallback(
    async (next: number, isForward: boolean) => {
      const getDataIndex =
        ((isForward ? next + 1 : next - 1) + NUM_OF_SLIDES) % NUM_OF_SLIDES;

      if (!isLoadingList[getDataIndex]) return;

      try {
        const item = viewingMealPlans[getDataIndex];
        if (!item) return;

        const mealPlan = await getMealPlanSingleDay({
          date: item.mealDate,
        });
        if (mealPlan.data) {
          dispatch(
            updateViewingMealPlanByIndex({
              mealPlanWithDate: {
                mealDate: viewingMealPlans[getDataIndex].mealDate,
                mealPlanDay: mealPlan.data.data[0],
              },
              index: getDataIndex,
            }),
          );
        }
        setIsLoadingList((prev) => {
          const newLoading = [...prev];
          newLoading[getDataIndex] = false;
          return newLoading;
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        toast.error(`Error while fetching Meal Plan: ${message}`);
        setIsLoadingList((prev) => {
          const newLoading = [...prev];
          newLoading[getDataIndex] = false;
          return newLoading;
        });
      }
    },
    [getMealPlanSingleDay, isLoadingList, viewingMealPlans, dispatch],
  );

  const handleBeforeChange = useCallback(
    async (current: number, next: number) => {
      if (isTooFarJumpRef.current) return;

      const isForward = (current + 1) % NUM_OF_SLIDES === next;

      updateLastElement(current, next, isForward);
      await updateNextToElement(next, isForward);
    },
    [updateLastElement, updateNextToElement],
  );

  return {
    isLoadingList,
    viewingMealPlans,
    handleBeforeChange,
  };
};
