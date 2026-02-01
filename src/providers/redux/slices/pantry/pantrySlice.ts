import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PantryState {
  isDragging: boolean;
  draggingCardHeight: number;
}

const initialState: PantryState = {
  isDragging: false,
  draggingCardHeight: 0,
};

export const pantrySlice = createSlice({
  name: 'pantry',
  initialState,
  reducers: {
    setIsDragging: (state, action: PayloadAction<{ isDragging: boolean }>) => {
      state.isDragging = action.payload.isDragging;
    },
    setDraggingCardHeight: (
      state,
      action: PayloadAction<{ draggingCardHeight: number }>,
    ) => {
      state.draggingCardHeight = action.payload.draggingCardHeight;
    },
  },
});

export const { setIsDragging, setDraggingCardHeight } = pantrySlice.actions;

export const pantrySelector = (state: { pantry: PantryState }) => state.pantry;

export const pantryReducer = pantrySlice.reducer;
