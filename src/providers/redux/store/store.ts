import { configureStore } from '@reduxjs/toolkit';

import { baseApi, baseApiWithAuth } from '@/redux/query/apis/baseApi';
import { cloudinaryApi } from '@/redux/query/apis/cloudinary/cloudinaryApi';
import { foodReducer } from '@/redux/slices/food';
import { userReducer } from '@/redux/slices/user';

import { collectionReducer } from '../slices/collection';
import { mealPlanReducer } from '../slices/mealPlan';
import { pantryReducer } from '../slices/pantry/pantrySlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    food: foodReducer,
    mealPlan: mealPlanReducer,
    pantry: pantryReducer,
    collection: collectionReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [cloudinaryApi.reducerPath]: cloudinaryApi.reducer,
    [baseApiWithAuth.reducerPath]: baseApiWithAuth.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      cloudinaryApi.middleware,
      baseApiWithAuth.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
