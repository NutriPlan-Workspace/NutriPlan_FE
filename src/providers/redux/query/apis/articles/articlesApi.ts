import {
  ARTICLE_VIEW_ENDPOINT,
  ARTICLES_ENDPOINT,
} from '@/constants/endpoints';
import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import type { ApiResponse } from '@/types/apiResponse';
import type {
  ArticleDetail,
  ArticleListItem,
  GetArticleBySlugArgs,
  GetArticlesArgs,
  GetArticlesResponse,
} from '@/types/article';

export const articlesApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query<
      ApiResponse<GetArticlesResponse>,
      GetArticlesArgs
    >({
      query: ({ limit = 10 } = {}) => ({
        url: ARTICLES_ENDPOINT,
        params: { limit },
      }),
    }),
    getArticleBySlug: builder.query<
      ApiResponse<ArticleDetail>,
      GetArticleBySlugArgs
    >({
      query: ({ slug }) => ({
        url: `${ARTICLES_ENDPOINT}/${slug}`,
      }),
    }),
    trackArticleView: builder.mutation<
      ApiResponse<unknown>,
      { articleId: string; source?: string }
    >({
      query: (body) => ({
        url: ARTICLE_VIEW_ENDPOINT,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  useTrackArticleViewMutation,
} = articlesApi;

export type { ArticleListItem };
