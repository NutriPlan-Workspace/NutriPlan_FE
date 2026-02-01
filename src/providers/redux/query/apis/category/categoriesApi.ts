import { CATEGORIES_ENDPOINT } from '@/constants/endpoints';
import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import type { ApiResponse } from '@/types/apiResponse';
import type { Category } from '@/types/category';

export const categoriesApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => ({
        url: CATEGORIES_ENDPOINT,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
