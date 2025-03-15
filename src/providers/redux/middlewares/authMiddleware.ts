import { Middleware } from '@reduxjs/toolkit';

import { authApi } from '@/redux/query/apis/auth/authApi';
import { setUser, userInitialState } from '@/redux/slices/user';

export const authMiddleware: Middleware =
  (storeAPI) => (next) => async (action) => {
    if (authApi.endpoints.getUser.matchFulfilled(action)) {
      try {
        storeAPI.dispatch(setUser(action.payload.data.payload));
      } catch {
        storeAPI.dispatch(setUser(userInitialState));
      }
    }
    return next(action);
  };
