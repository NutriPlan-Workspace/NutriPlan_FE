import {
  COLLECTIONS_ENDPOINT,
  CURATED_COLLECTION_COPY_ENDPOINT,
  CURATED_COLLECTION_VIEW_ENDPOINT,
  CURATED_COLLECTIONS_ENDPOINT,
  EXCLUSION_COLLECTION_ENDPOINT,
} from '@/constants/endpoints';
import type { ApiResponse } from '@/types/apiResponse';
import type {
  Collection,
  CollectionDetail,
  CollectionFoodBrief,
} from '@/types/collection';

import { baseApiWithAuth } from '../baseApi';

export const collectionApi = baseApiWithAuth.injectEndpoints({
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
    getCuratedCollections: builder.query<
      ApiResponse<{
        items: Collection[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>,
      { page?: number; limit?: number; q?: string }
    >({
      query: ({ page = 1, limit = 10, q }) => ({
        url: CURATED_COLLECTIONS_ENDPOINT,
        params: { page, limit, q },
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
    getExclusionCollection: builder.query<ApiResponse<CollectionDetail>, void>({
      query: () => ({
        url: EXCLUSION_COLLECTION_ENDPOINT,
        method: 'GET',
      }),
      providesTags: ['Favorites'],
    }),
    updateExclusionFoods: builder.mutation<
      ApiResponse<CollectionDetail>,
      { data: CollectionFoodBrief[] }
    >({
      query: ({ data }) => ({
        url: EXCLUSION_COLLECTION_ENDPOINT,
        method: 'PUT',
        body: { foods: data },
      }),
      invalidatesTags: ['Favorites'],
    }),

    trackCuratedCollectionView: builder.mutation<
      ApiResponse<unknown>,
      { collectionId: string; source?: string }
    >({
      query: (body) => ({
        url: CURATED_COLLECTION_VIEW_ENDPOINT,
        method: 'POST',
        body,
      }),
    }),

    trackCuratedCollectionCopy: builder.mutation<
      ApiResponse<unknown>,
      {
        collectionId: string;
        destinationCollectionId?: string;
        source?: string;
      }
    >({
      query: (body) => ({
        url: CURATED_COLLECTION_COPY_ENDPOINT,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetListCollectionQuery,
  useGetCuratedCollectionsQuery,
  useGetCollectionDetailQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useGetFavoriteFoodsQuery,
  useUpdateFavoriteFoodsMutation,
  useGetExclusionCollectionQuery,
  useUpdateExclusionFoodsMutation,
  useTrackCuratedCollectionViewMutation,
  useTrackCuratedCollectionCopyMutation,
} = collectionApi;
