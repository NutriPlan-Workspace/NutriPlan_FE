import { FOODS_ENDPOINT } from '@/constants/endpoints';
import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import type { ApiResponse } from '@/types/apiResponse';
import type { DetailedFoodResponse, Food } from '@/types/food';

export type AdminFoodInput = {
  name: string;
  type: 'create' | 'customFood' | 'customRecipe';
  units: { amount: number; description: string }[];
  categories?: number[];
  description?: string;
  imgUrls?: string[];
  defaultUnit?: number;
  nutrition?: Partial<Food['nutrition']>;
  property?: Partial<Food['property']>;
};

export const adminFoodsApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getAdminFoods: builder.query<
      ApiResponse<Food[]>,
      { page?: number; limit?: number; q?: string }
    >({
      query: ({ page = 1, limit = 20, q } = {}) => ({
        url: FOODS_ENDPOINT,
        params: { page, limit, ...(q ? { q } : {}) },
      }),
      providesTags: ['Foods'],
    }),

    getAdminFoodById: builder.query<DetailedFoodResponse, string>({
      query: (id) => ({
        url: `${FOODS_ENDPOINT}/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'Foods', id }],
    }),

    createAdminFood: builder.mutation<ApiResponse<Food>, AdminFoodInput>({
      query: (body) => ({
        url: FOODS_ENDPOINT,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Foods'],
    }),

    updateAdminFood: builder.mutation<
      ApiResponse<Food>,
      { id: string; data: Partial<AdminFoodInput> }
    >({
      query: ({ id, data }) => ({
        url: `${FOODS_ENDPOINT}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        'Foods',
        { type: 'Foods', id: arg.id },
      ],
    }),

    deleteAdminFood: builder.mutation<ApiResponse<unknown>, { id: string }>({
      query: ({ id }) => ({
        url: `${FOODS_ENDPOINT}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Foods'],
    }),
  }),
});

export const {
  useGetAdminFoodsQuery,
  useGetAdminFoodByIdQuery,
  useCreateAdminFoodMutation,
  useUpdateAdminFoodMutation,
  useDeleteAdminFoodMutation,
} = adminFoodsApi;
