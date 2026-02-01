import {
  PANTRY_CONSUME_ENDPOINT,
  PANTRY_ENDPOINT,
  PANTRY_SUGGEST_ENDPOINT,
} from '@/constants/endpoints';
import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import type { ApiResponse } from '@/types/apiResponse';
import type { PantryItem, PantrySuggestion } from '@/types/pantry';

export const pantryApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getPantryItems: builder.query<
      ApiResponse<PantryItem[]>,
      { q?: string; status?: 'in_pantry' | 'need_buy' }
    >({
      query: (params) => ({
        url: PANTRY_ENDPOINT,
        params,
      }),
      providesTags: ['Pantry'],
    }),
    upsertPantryItem: builder.mutation<
      ApiResponse<PantryItem>,
      {
        ingredientFoodId?: string;
        name: string;
        quantity: number;
        unit?: string;
        status?: 'in_pantry' | 'need_buy';
        note?: string;
        imgUrl?: string;
      }
    >({
      query: (body) => ({
        url: PANTRY_ENDPOINT,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Pantry'],
    }),
    updatePantryItem: builder.mutation<
      ApiResponse<PantryItem>,
      { id: string; data: Partial<PantryItem> }
    >({
      query: ({ id, data }) => ({
        url: `${PANTRY_ENDPOINT}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Pantry'],
    }),
    deletePantryItem: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `${PANTRY_ENDPOINT}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Pantry'],
    }),
    consumePantryItems: builder.mutation<
      ApiResponse<null>,
      {
        items: {
          ingredientFoodId?: string;
          name: string;
          quantity: number;
          unit?: string;
        }[];
      }
    >({
      query: (body) => ({
        url: PANTRY_CONSUME_ENDPOINT,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Pantry'],
    }),
    getPantrySuggestions: builder.query<
      ApiResponse<PantrySuggestion[]>,
      { limit?: number }
    >({
      query: (params) => ({
        url: PANTRY_SUGGEST_ENDPOINT,
        params,
      }),
      providesTags: ['Pantry'],
    }),
  }),
});

export const {
  useGetPantryItemsQuery,
  useUpsertPantryItemMutation,
  useUpdatePantryItemMutation,
  useDeletePantryItemMutation,
  useConsumePantryItemsMutation,
  useGetPantrySuggestionsQuery,
} = pantryApi;
