import { COLLECTIONS_ENDPOINT } from '@/constants/endpoints';
import { baseApi } from '@/redux/query/apis/baseApi';
import type { ApiResponse } from '@/types/apiResponse';
import type {
  BodyCollectionUpdate,
  CollectionDetail,
} from '@/types/collection';

export const collectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCollectionDetail: builder.query<ApiResponse<CollectionDetail>, string>({
      query: (id: string) => ({
        url: `${COLLECTIONS_ENDPOINT}/${id}`,
        method: 'GET',
      }),
    }),
    updateCollection: builder.mutation<
      ApiResponse<CollectionDetail>,
      { id: string; data: Partial<BodyCollectionUpdate> }
    >({
      query: ({ id, data }) => ({
        url: `${COLLECTIONS_ENDPOINT}/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { useGetCollectionDetailQuery, useUpdateCollectionMutation } =
  collectionApi;
