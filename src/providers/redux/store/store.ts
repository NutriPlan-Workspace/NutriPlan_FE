import { configureStore } from '@reduxjs/toolkit';

import { authMiddleware } from '@/redux/middlewares/authMiddleware';
import { baseApi } from '@/redux/query/apis/baseApi';
import { cloudinaryApi } from '@/redux/query/apis/cloudinary/cloudinaryApi';
import { foodReducer } from '@/redux/slices/food';
import { userReducer } from '@/redux/slices/user';

import { mealPlanReducer } from '../slices/mealPlan';

export const store = configureStore({
  reducer: {
    user: userReducer,
    food: foodReducer,
    mealPlan: mealPlanReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [cloudinaryApi.reducerPath]: cloudinaryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      cloudinaryApi.middleware,
      authMiddleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
