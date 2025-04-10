import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { ADJUST_DISTANCE, NUM_OF_SLIDES } from '@/constants/mealPlan';
import {
  useGetMealPlanDayRangeQuery,
  useLazyGetMealPlanSingleDayQuery,
} from '@/redux/query/apis/mealPlan/mealPlanApi';
import {
  mealPlanSelector,
  updateViewingMealPlanByIndex,
} from '@/redux/slices/mealPlan';
import { getMealDate, isSameDay } from '@/utils/dateUtils';

export const useMealTrack = (selectedDate: Date | undefined) => {
  const isMounted = useRef(false);
  const dispatch = useDispatch();
  const viewingMealPlans = useSelector(mealPlanSelector).viewingMealPlans;
  const cacheMealPlans = useSelector(mealPlanSelector).cacheMealPlans;
  const [isLoadingList, setIsLoadingList] = useState<boolean[]>(
    Array(NUM_OF_SLIDES).fill(true),
  );
  const [getMealPlanSingleDay] = useLazyGetMealPlanSingleDayQuery();

  // Define day range for the selected date
  const { from, to } = useMemo(() => {
    if (!selectedDate) return {};
    const from = new Date(selectedDate);
    from.setDate(from.getDate() - ADJUST_DISTANCE);
    const to = new Date(selectedDate);
    to.setDate(to.getDate() + ADJUST_DISTANCE);
    return {
      from: getMealDate(from),
      to: getMealDate(to),
    };
  }, [selectedDate]);

  // Fetch meal plan data for the selected date range
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

  // Update loading state when fetching meal plans
  useEffect(() => {
    setIsLoadingList(Array(NUM_OF_SLIDES).fill(isFetchingViewingMealPlans));
  }, [isFetchingViewingMealPlans]);

  const updateLastElement = useCallback(
    (current: number, next: number, isForward: boolean) => {
      const mod = (n: number, m: number) => ((n % m) + m) % m;
      const preAdjustingIndex = isForward
        ? mod(current + ADJUST_DISTANCE, NUM_OF_SLIDES)
        : mod(current - ADJUST_DISTANCE, NUM_OF_SLIDES);
      const adjustingIndex = isForward
        ? mod(next + ADJUST_DISTANCE, NUM_OF_SLIDES)
        : mod(next - ADJUST_DISTANCE, NUM_OF_SLIDES);

      const adjustingDay = new Date(
        viewingMealPlans[preAdjustingIndex].mealDate,
      );
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
        const mealPlan = await getMealPlanSingleDay({
          date: viewingMealPlans[getDataIndex].mealDate,
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
        toast.error(`Error while fetching Meal Plan: ${error}`);
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
      // if (!isMounted.current) return;
      const isForward = (current + 1) % NUM_OF_SLIDES === next;

      updateLastElement(current, next, isForward);
      await updateNextToElement(next, isForward);
    },
    [isMounted, updateLastElement, updateNextToElement],
  );

  // TODO: Implement handleCreateBlank and handleCopyPreviousDay
  const handleCreateBlank = useCallback(async (mealDate: string) => {
    console.log('Create Blank', mealDate);
  }, []);

  const handleCopyPreviousDay = useCallback(async (mealDate: string) => {
    console.log('Copy Previous Day', mealDate);
  }, []);

  return {
    isLoadingList,
    viewingMealPlans,
    handleBeforeChange,
    handleCreateBlank,
    handleCopyPreviousDay,
  };
};
