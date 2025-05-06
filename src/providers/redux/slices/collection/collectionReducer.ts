import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CollectionFoodBrief } from '@/types/collection';

export type CollectionState = {
  favoriteList: CollectionFoodBrief[];
};

export const collectionInitialState: CollectionState = {
  favoriteList: [],
};

const collectionSlice = createSlice({
  name: 'collection',
  initialState: collectionInitialState,
  reducers: {
    setFavoriteList: (state, action: PayloadAction<CollectionFoodBrief[]>) => {
      state.favoriteList = action.payload;
    },
    addToFavoriteList: (state, action: PayloadAction<CollectionFoodBrief>) => {
      state.favoriteList.push(action.payload);
    },
    removeFromFavoriteList: (state, action: PayloadAction<string>) => {
      state.favoriteList = state.favoriteList.filter(
        (item) => item.food !== action.payload,
      );
    },
  },
});

export const { setFavoriteList, addToFavoriteList, removeFromFavoriteList } =
  collectionSlice.actions;
export default collectionSlice.reducer;
