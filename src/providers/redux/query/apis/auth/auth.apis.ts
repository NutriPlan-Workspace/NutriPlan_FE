import { baseApi } from '@/redux/query/apis/base.api';
import { AuthResponse } from '@/types/auth.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // TODO: Refine this endpoint in Login task
    loginRequest: builder.mutation<
      AuthResponse,
      { email: string; password: string }
    >({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    getUser: builder.query<AuthResponse, void>({
      query: () => ({
        url: '/auth/me',
      }),
      keepUnusedDataFor: 15, // Cache 15s
    }),
    logoutRequest: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
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
