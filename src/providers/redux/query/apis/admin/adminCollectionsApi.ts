import { ADMIN_COLLECTIONS_ENDPOINT } from '@/constants/endpoints';
import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import type { AdminListResponse } from '@/types/admin';
import type { ApiResponse } from '@/types/apiResponse';
import type { Collection, CollectionDetail } from '@/types/collection';

export const adminCollectionsApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCollectionDetail: builder.query<
      ApiResponse<CollectionDetail>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `${ADMIN_COLLECTIONS_ENDPOINT}/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, arg) => [
        { type: 'Collections', id: arg.id },
      ],
    }),

    getAdminCollections: builder.query<
      ApiResponse<AdminListResponse<Collection>>,
      {
        page?: number;
        limit?: number;
        q?: string;
        userId?: string;
        isCurated?: boolean;
      }
    >({
      query: ({ page = 1, limit = 10, q, userId, isCurated } = {}) => ({
        url: ADMIN_COLLECTIONS_ENDPOINT,
        params: {
          page,
          limit,
          ...(q ? { q } : {}),
          ...(userId ? { userId } : {}),
          ...(typeof isCurated === 'boolean' ? { isCurated } : {}),
        },
      }),
      providesTags: ['Collections'],
    }),

    createAdminCollection: builder.mutation<
      ApiResponse<Collection>,
      Partial<Collection> & { userId?: string }
    >({
      query: (body) => ({
        url: ADMIN_COLLECTIONS_ENDPOINT,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Collections'],
    }),

    updateAdminCollection: builder.mutation<
      ApiResponse<CollectionDetail>,
      { id: string; data: Partial<Collection> }
    >({
      query: ({ id, data }) => ({
        url: `${ADMIN_COLLECTIONS_ENDPOINT}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        'Collections',
        { type: 'Collections', id: arg.id },
      ],
    }),

    deleteAdminCollection: builder.mutation<
      ApiResponse<unknown>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `${ADMIN_COLLECTIONS_ENDPOINT}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Collections'],
    }),
  }),
});

export const {
  useGetAdminCollectionDetailQuery,
  useGetAdminCollectionsQuery,
  useCreateAdminCollectionMutation,
  useUpdateAdminCollectionMutation,
  useDeleteAdminCollectionMutation,
} = adminCollectionsApi;
