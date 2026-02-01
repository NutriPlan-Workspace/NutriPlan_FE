import {
  AUTH_ME_ENDPOINT,
  CHANGE_PASSWORD_ENDPOINT,
  LOGIN_ENDPOINT,
  LOGOUT_ENDPOINT,
  REGISTER_ENDPOINT,
  UPDATE_AVATAR_ENDPOINT,
} from '@/constants/endpoints';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import { setUser } from '@/redux/slices/user';
import type { RootState } from '@/redux/store/store';
import type { ChangePasswordSchemaType } from '@/schemas/passwordSchema';
import type { ApiResponse } from '@/types/apiResponse';
import type { LoginData, LogoutResponse, RegisterData } from '@/types/auth';
import type { AuthResponse } from '@/types/auth';
import type { UserResponse } from '@/types/user';

export const authApi = baseApiWithAuth.injectEndpoints({
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
          // Server now returns tokens in data.data (accessToken, refreshToken)
          const payload = data.data.payload;
          dispatch(setUser(payload));
          try {
            const accessToken = data.data.accessToken;
            const refreshToken = data.data.refreshToken;
            if (accessToken) {
              localStorage.setItem('accessToken', accessToken);
            }
            if (refreshToken) {
              localStorage.setItem('refreshToken', refreshToken);
            }
          } catch {
            // ignore storage errors
          }
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
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // ignore error
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      },
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

    updateAvatarRequest: builder.mutation<
      ApiResponse<{ avatarUrl: string }>,
      { avatarUrl: string }
    >({
      query: (body) => ({
        url: UPDATE_AVATAR_ENDPOINT,
        method: 'PUT',
        body,
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const previousUser = state.user.user;

        dispatch(setUser({ ...previousUser, avatarUrl: arg.avatarUrl }));

        try {
          const { data } = await queryFulfilled;
          if (data?.data?.avatarUrl) {
            dispatch(
              setUser({ ...previousUser, avatarUrl: data.data.avatarUrl }),
            );
          }
        } catch {
          dispatch(setUser(previousUser));
        }
      },
    }),
  }),
});

export const {
  useLoginRequestMutation,
  useGetUserQuery,
  useLogoutRequestMutation,
  useRegisterRequestMutation,
  useChangePasswordRequestMutation,
  useUpdateAvatarRequestMutation,
} = authApi;
