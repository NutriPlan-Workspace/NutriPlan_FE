import {
  AUTH_ME_ENDPOINT,
  CHANGE_PASSWORD_ENDPOINT,
  LOGIN_ENDPOINT,
  LOGOUT_ENDPOINT,
  REGISTER_ENDPOINT,
} from '@/constants/endpoints';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { baseApi } from '@/redux/query/apis/baseApi';
import { setUser } from '@/redux/slices/user';
import type { ChangePasswordSchemaType } from '@/schemas/passwordSchema';
import type { ApiResponse } from '@/types/apiResponse';
import type { LoginData, LogoutResponse, RegisterData } from '@/types/auth';
import type { AuthResponse } from '@/types/auth';
import { UserResponse } from '@/types/user';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginRequest: builder.mutation<AuthResponse, LoginData>({
      query: (data) => ({
        url: LOGIN_ENDPOINT,
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (data?.code === HTTP_STATUS.OK) {
          dispatch(setUser(data.data.payload));
        }
      },
    }),
    registerRequest: builder.mutation<AuthResponse, RegisterData>({
      query: (data) => ({
        url: REGISTER_ENDPOINT,
        method: 'POST',
        body: data,
      }),
    }),
    getUser: builder.query<UserResponse, void>({
      query: () => ({
        url: AUTH_ME_ENDPOINT,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (data?.code === HTTP_STATUS.OK) {
          dispatch(setUser(data.data));
        }
      },
    }),

    logoutRequest: builder.mutation<LogoutResponse, void>({
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
        method: 'PUT',
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
