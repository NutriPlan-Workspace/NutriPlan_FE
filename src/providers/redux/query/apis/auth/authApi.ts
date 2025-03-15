import {
  AUTH_ME_ENDPOINT,
  LOGIN_ENDPOINT,
  LOGOUT_ENDPOINT,
} from '@/constants/endpoints';
import { baseApi } from '@/redux/query/apis/baseApi';
import type { LoginData } from '@/types/auth';
import type { AuthResponse } from '@/types/auth';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginRequest: builder.mutation<AuthResponse, LoginData>({
      query: (data) => ({
        url: LOGIN_ENDPOINT,
        method: 'POST',
        body: data,
      }),
    }),
    getUser: builder.query<AuthResponse, void>({
      query: () => ({
        url: AUTH_ME_ENDPOINT,
      }),
      keepUnusedDataFor: 15,
    }),
    logoutRequest: builder.mutation<void, void>({
      query: () => ({
        url: LOGOUT_ENDPOINT,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginRequestMutation,
  useGetUserQuery,
  useLogoutRequestMutation,
} = authApi;
