import { configureStore } from '@reduxjs/toolkit';

import { authMiddleware } from '@/redux/middlewares/auth.middleware';
import { baseApi } from '@/redux/query/apis/base.api';
import { userReducer } from '@/redux/slices/user';

export const store = configureStore({
  reducer: {
    user: userReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
