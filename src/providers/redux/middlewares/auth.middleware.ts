import { Middleware } from '@reduxjs/toolkit';

import { authApi } from '@/redux/query/apis/auth/auth.apis';
import { setUser, userInitialState } from '@/redux/slices/user';

export const authMiddleware: Middleware =
  (storeAPI) => (next) => async (action) => {
    if (authApi.endpoints.getUser.matchFulfilled(action)) {
      try {
        storeAPI.dispatch(setUser(action.payload.data));
      } catch {
        storeAPI.dispatch(setUser(userInitialState));
      }
    }
    return next(action);
  };
