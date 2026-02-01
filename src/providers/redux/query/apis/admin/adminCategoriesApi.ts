import { ADMIN_CATEGORIES_ENDPOINT } from '@/constants/endpoints';
import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import type { AdminListResponse } from '@/types/admin';
import type { ApiResponse } from '@/types/apiResponse';
import type { Category } from '@/types/category';

export const adminCategoriesApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCategories: builder.query<
      ApiResponse<AdminListResponse<Category>>,
      { page?: number; limit?: number; q?: string }
    >({
      query: ({ page = 1, limit = 20, q } = {}) => ({
        url: ADMIN_CATEGORIES_ENDPOINT,
        params: { page, limit, ...(q ? { q } : {}) },
      }),
      providesTags: ['Categories'],
    }),

    createAdminCategory: builder.mutation<
      ApiResponse<Category>,
      Pick<Category, 'label' | 'value' | 'group' | 'mainItem'>
    >({
      query: (body) => ({
        url: ADMIN_CATEGORIES_ENDPOINT,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),

    updateAdminCategory: builder.mutation<
      ApiResponse<Category>,
      { id: string; data: Partial<Category> }
    >({
      query: ({ id, data }) => ({
        url: `${ADMIN_CATEGORIES_ENDPOINT}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        'Categories',
        { type: 'Categories', id: arg.id },
      ],
    }),

    deleteAdminCategory: builder.mutation<ApiResponse<unknown>, { id: string }>(
      {
        query: ({ id }) => ({
          url: `${ADMIN_CATEGORIES_ENDPOINT}/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Categories'],
      },
    ),
  }),
});

export const {
  useGetAdminCategoriesQuery,
  useCreateAdminCategoryMutation,
  useUpdateAdminCategoryMutation,
  useDeleteAdminCategoryMutation,
} = adminCategoriesApi;
