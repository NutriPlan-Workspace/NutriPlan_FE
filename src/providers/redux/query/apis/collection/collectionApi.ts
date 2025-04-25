import { COLLECTIONS_ENDPOINT } from '@/constants/endpoints';
import { baseApi } from '@/redux/query/apis/baseApi';
import type { ApiResponse } from '@/types/apiResponse';
import type { Collection, CollectionDetail } from '@/types/collection';

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
    }),
    deleteCollection: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `${COLLECTIONS_ENDPOINT}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetListCollectionQuery,
  useGetCollectionDetailQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionApi;
