import { ADMIN_USERS_ENDPOINT } from '@/constants/endpoints';
import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import type { AdminListResponse, AdminUser } from '@/types/admin';
import type { ApiResponse } from '@/types/apiResponse';

export const adminUsersApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<
      ApiResponse<AdminListResponse<AdminUser>>,
      { page?: number; limit?: number; q?: string }
    >({
      query: ({ page = 1, limit = 10, q } = {}) => ({
        url: ADMIN_USERS_ENDPOINT,
        params: { page, limit, ...(q ? { q } : {}) },
      }),
      providesTags: ['Users'],
    }),

    updateAdminUserRole: builder.mutation<
      ApiResponse<AdminUser>,
      { id: string; role: string }
    >({
      query: ({ id, role }) => ({
        url: `${ADMIN_USERS_ENDPOINT}/${id}`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: (_result, _error, arg) => [
        'Users',
        { type: 'Users', id: arg.id },
      ],
    }),

    deleteAdminUser: builder.mutation<ApiResponse<unknown>, { id: string }>({
      query: ({ id }) => ({
        url: `${ADMIN_USERS_ENDPOINT}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useUpdateAdminUserRoleMutation,
  useDeleteAdminUserMutation,
} = adminUsersApi;
