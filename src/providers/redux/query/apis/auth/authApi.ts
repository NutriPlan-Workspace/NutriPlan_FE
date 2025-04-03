import {
  AUTH_ME_ENDPOINT,
  CHANGE_PASSWORD_ENDPOINT,
  LOGIN_ENDPOINT,
  LOGOUT_ENDPOINT,
  REGISTER_ENDPOINT,
} from '@/constants/endpoints';
import { baseApi } from '@/redux/query/apis/baseApi';
import type { ChangePasswordSchemaType } from '@/schemas/passwordSchema';
import type { ApiResponse } from '@/types/apiResponse';
import type { LoginData, RegisterData } from '@/types/auth';
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
    registerRequest: builder.mutation<AuthResponse, RegisterData>({
      query: (data) => ({
        url: REGISTER_ENDPOINT,
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
    changePasswordRequest: builder.mutation<
      ApiResponse<void>,
      ChangePasswordSchemaType
    >({
      query: (body) => ({
        url: CHANGE_PASSWORD_ENDPOINT,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginRequestMutation,
  useGetUserQuery,
  useLogoutRequestMutation,
  useRegisterRequestMutation,
  useChangePasswordRequestMutation,
} = authApi;
