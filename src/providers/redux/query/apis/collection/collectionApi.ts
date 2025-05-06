import { COLLECTIONS_ENDPOINT } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/apiResponse';
import type {
  Collection,
  CollectionDetail,
  CollectionFoodBrief,
} from '@/types/collection';

import { baseApi } from '../baseApi';

export const collectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getListCollection: builder.query<
      ApiResponse<Collection[]>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: COLLECTIONS_ENDPOINT,
        params: { page, limit },
        method: 'GET',
      }),
    }),
    getCollectionDetail: builder.query<ApiResponse<CollectionDetail>, string>({
      query: (id: string) => ({
        url: `${COLLECTIONS_ENDPOINT}/${id}`,
        method: 'GET',
      }),
      providesTags: ['Favorites'],
    }),
    createCollection: builder.mutation<
      ApiResponse<Collection>,
      Partial<Collection>
    >({
      query: (data) => ({
        url: COLLECTIONS_ENDPOINT,
        method: 'POST',
        body: data,
      }),
    }),
    updateCollection: builder.mutation<
      ApiResponse<CollectionDetail>,
      { id: string; data: Partial<Collection> }
    >({
      query: ({ id, data }) => ({
        url: `${COLLECTIONS_ENDPOINT}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Favorites'],
    }),
    deleteCollection: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `${COLLECTIONS_ENDPOINT}/${id}`,
        method: 'DELETE',
      }),
    }),
    getFavoriteFoods: builder.query<ApiResponse<CollectionFoodBrief[]>, void>({
      query: () => ({
        url: `${COLLECTIONS_ENDPOINT}/favorites`,
        method: 'GET',
      }),
      providesTags: ['Favorites'],
    }),
    updateFavoriteFoods: builder.mutation<
      ApiResponse<CollectionFoodBrief[]>,
      { data: CollectionFoodBrief[] }
    >({
      query: ({ data }) => ({
        url: `${COLLECTIONS_ENDPOINT}/favorites`,
        method: 'PUT',
        body: { foods: data },
      }),
      invalidatesTags: ['Favorites'],
    }),
  }),
});

export const {
  useGetListCollectionQuery,
  useGetCollectionDetailQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useGetFavoriteFoodsQuery,
  useUpdateFavoriteFoodsMutation,
} = collectionApi;
