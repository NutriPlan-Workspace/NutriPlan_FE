import {
  ARTICLES_ADMIN_ENDPOINT,
  ARTICLES_ENDPOINT,
} from '@/constants/endpoints';
import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import type { ApiResponse } from '@/types/apiResponse';
import type {
  ArticleAdminDetail,
  ArticleAdminListResponse,
  CreateArticleArgs,
  GetAdminArticleByIdArgs,
  GetAdminArticlesArgs,
  UpdateArticleArgs,
} from '@/types/article';

export const articlesAdminApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getAdminArticles: builder.query<
      ApiResponse<ArticleAdminListResponse>,
      GetAdminArticlesArgs
    >({
      query: ({ page = 1, limit = 20, published } = {}) => ({
        url: ARTICLES_ADMIN_ENDPOINT,
        params: {
          page,
          limit,
          ...(published === undefined ? {} : { published }),
        },
      }),
      providesTags: ['Articles'],
    }),

    getAdminArticleById: builder.query<
      ApiResponse<ArticleAdminDetail>,
      GetAdminArticleByIdArgs
    >({
      query: ({ id }) => ({
        url: `${ARTICLES_ADMIN_ENDPOINT}/${id}`,
      }),
      providesTags: (_result, _error, arg) => [
        { type: 'Articles', id: arg.id },
      ],
    }),

    createArticle: builder.mutation<
      ApiResponse<ArticleAdminDetail>,
      CreateArticleArgs
    >({
      query: (body) => ({
        url: ARTICLES_ENDPOINT,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Articles'],
    }),

    updateArticle: builder.mutation<
      ApiResponse<ArticleAdminDetail>,
      UpdateArticleArgs
    >({
      query: ({ id, ...body }) => ({
        url: `${ARTICLES_ENDPOINT}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        'Articles',
        { type: 'Articles', id: arg.id },
      ],
    }),

    deleteArticle: builder.mutation<ApiResponse<unknown>, { id: string }>({
      query: ({ id }) => ({
        url: `${ARTICLES_ENDPOINT}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Articles'],
    }),
  }),
});

export const {
  useGetAdminArticlesQuery,
  useGetAdminArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articlesAdminApi;
