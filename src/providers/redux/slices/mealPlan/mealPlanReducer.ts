import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { DishType } from '@/constants/foodFilter';
import type { MealPlanWithDate } from '@/types/mealPlan';
import type { MealType, SwapOptionsResponse } from '@/types/mealSwap';
import { isSameDay } from '@/utils/dateUtils';

export type SwapModalFilters = {
  q?: string;
  dishType?: DishType;
  categoryIds?: number[];
};

export type SwapModalState = {
  open: boolean;
  loading: boolean;
  data: SwapOptionsResponse | null;
  swapType: 'food' | 'meal' | null;
  mealPlanId?: string;
  mealDate?: string;
  mealType?: MealType;
  targetItemId?: string;
  targetFoodId?: string;
  filters: SwapModalFilters;
  generationMode: 'percentage' | 'remaining';
  targetItemCount?: number;
  targetRatio?: number;
};

export type MealPlanState = {
  cacheMealPlans: MealPlanWithDate[];
  viewingMealPlans: MealPlanWithDate[];
  draggingCardHeight: number;
  isDragging: boolean;
  flashMealCardIds: string[];
  swapModal: SwapModalState;
  dockSearchQuery: string;
  isDockExpanded: boolean;
};

export const mealPlanInitialState: MealPlanState = {
  cacheMealPlans: [],
  viewingMealPlans: [],
  draggingCardHeight: 0,
  isDragging: false,
  flashMealCardIds: [],
  swapModal: {
    open: false,
    loading: false,
    data: null,
    swapType: null,
    filters: {},
    generationMode: 'percentage',
    targetItemCount: undefined,
    targetRatio: undefined,
  },
  dockSearchQuery: '',
  isDockExpanded: false,
};

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState: mealPlanInitialState,
  reducers: {
    setViewingMealPlans: (
      state,
      action: PayloadAction<{ mealPlanWithDates: MealPlanWithDate[] }>,
    ) => {
      state.viewingMealPlans = action.payload.mealPlanWithDates;
    },
    updateViewingMealPlanByIndex: (
      state,
      action: PayloadAction<{
        mealPlanWithDate: MealPlanWithDate;
        index: number;
      }>,
    ) => {
      state.viewingMealPlans = state.viewingMealPlans.map((item, idx) =>
        idx === action.payload.index
          ? { ...action.payload.mealPlanWithDate }
          : item,
      );
    },
    updateViewingMealPlanByDate: (
      state,
      action: PayloadAction<{ mealPlanWithDate: MealPlanWithDate }>,
    ) => {
      state.viewingMealPlans = state.viewingMealPlans.map((mealPlan) =>
        isSameDay(
          new Date(mealPlan.mealDate),
          new Date(action.payload.mealPlanWithDate.mealDate),
        )
          ? { ...action.payload.mealPlanWithDate }
          : mealPlan,
      );
    },
    updateViewingMealPlanByDates: (
      state,
      action: PayloadAction<{ mealPlanWithDates: MealPlanWithDate[] }>,
    ) => {
      action.payload.mealPlanWithDates.forEach((mealPlan) => {
        const index = state.viewingMealPlans.findIndex((viewingMealPlan) =>
          isSameDay(
            new Date(viewingMealPlan.mealDate),
            new Date(mealPlan.mealDate),
          ),
        );
        state.viewingMealPlans[index] = mealPlan;
      });
    },
    addCacheMealPlans: (
      state,
      action: PayloadAction<{
        mealPlanWithDates: MealPlanWithDate[];
      }>,
    ) => {
      state.cacheMealPlans.push(...action.payload.mealPlanWithDates);
    },
    updateCacheMealPlanByDate: (
      state,
      action: PayloadAction<{ mealPlanWithDate: MealPlanWithDate }>,
    ) => {
      const index = state.cacheMealPlans.findIndex((mealPlan) =>
        isSameDay(
          new Date(mealPlan.mealDate),
          new Date(action.payload.mealPlanWithDate.mealDate),
        ),
      );
      state.cacheMealPlans[index] = action.payload.mealPlanWithDate;
    },
    setDraggingCardHeight: (
      state,
      action: PayloadAction<{ draggingCardHeight: number }>,
    ) => {
      state.draggingCardHeight = action.payload.draggingCardHeight;
    },
    setIsDragging: (state, action: PayloadAction<{ isDragging: boolean }>) => {
      state.isDragging = action.payload.isDragging;
    },
    setFlashMealCardIds: (
      state,
      action: PayloadAction<{ mealCardIds: string[] }>,
    ) => {
      state.flashMealCardIds = action.payload.mealCardIds;
    },

    openSwapModal: (
      state,
      action: PayloadAction<{
        swapType: 'food' | 'meal';
        mealPlanId: string;
        mealType: MealType;
        mealDate?: string;
        targetItemId?: string;
        targetFoodId?: string;
        filters?: SwapModalFilters;
      }>,
    ) => {
      state.swapModal = {
        open: true,
        loading: false,
        data: null,
        swapType: action.payload.swapType,
        mealPlanId: action.payload.mealPlanId,
        mealDate: action.payload.mealDate,
        mealType: action.payload.mealType,
        targetItemId: action.payload.targetItemId,
        targetFoodId: action.payload.targetFoodId,
        filters: action.payload.filters ?? {},
        generationMode: 'percentage',
        targetItemCount: undefined,
        targetRatio: undefined,
      };
    },

    closeSwapModal: (state) => {
      state.swapModal.open = false;
      state.swapModal.loading = false;
      state.swapModal.data = null;
      state.swapModal.swapType = null;
      state.swapModal.mealPlanId = undefined;
      state.swapModal.mealDate = undefined;
      state.swapModal.mealType = undefined;
      state.swapModal.targetItemId = undefined;
      state.swapModal.targetFoodId = undefined;
      state.swapModal.filters = {};
      state.swapModal.generationMode = 'percentage';
      state.swapModal.targetItemCount = undefined;
      state.swapModal.targetRatio = undefined;
    },

    setSwapModalLoading: (
      state,
      action: PayloadAction<{ loading: boolean }>,
    ) => {
      state.swapModal.loading = action.payload.loading;
    },

    setSwapModalData: (
      state,
      action: PayloadAction<{ data: SwapOptionsResponse | null }>,
    ) => {
      state.swapModal.data = action.payload.data;
    },

    setSwapModalFilters: (
      state,
      action: PayloadAction<{ filters: SwapModalFilters }>,
    ) => {
      state.swapModal.filters = action.payload.filters;
    },
    setSwapModalGenerationMode: (
      state,
      action: PayloadAction<{ mode: 'percentage' | 'remaining' }>,
    ) => {
      state.swapModal.generationMode = action.payload.mode;
    },
    setSwapModalTargetItemCount: (
      state,
      action: PayloadAction<{ count?: number }>,
    ) => {
      state.swapModal.targetItemCount = action.payload.count;
    },
    setSwapModalTargetRatio: (
      state,
      action: PayloadAction<{ ratio?: number }>,
    ) => {
      state.swapModal.targetRatio = action.payload.ratio;
    },
    setDockSearchQuery: (state, action: PayloadAction<string>) => {
      state.dockSearchQuery = action.payload;
    },
    setIsDockExpanded: (state, action: PayloadAction<boolean>) => {
      state.isDockExpanded = action.payload;
    },
  },
});

export const {
  setViewingMealPlans,
  updateViewingMealPlanByIndex,
  updateViewingMealPlanByDate,
  updateViewingMealPlanByDates,
  addCacheMealPlans,
  updateCacheMealPlanByDate,
  setDraggingCardHeight,
  setIsDragging,
  setFlashMealCardIds,
  openSwapModal,
  closeSwapModal,
  setSwapModalLoading,
  setSwapModalData,
  setSwapModalFilters,
  setSwapModalGenerationMode,
  setSwapModalTargetItemCount,
  setSwapModalTargetRatio,
  setDockSearchQuery,
  setIsDockExpanded,
} = mealPlanSlice.actions;
export default mealPlanSlice.reducer;
