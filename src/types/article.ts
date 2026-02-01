export type ArticleListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImageUrl?: string;
  publishedAt?: string;
};

export type ArticleDetail = ArticleListItem & {
  content: string;
};

export type ArticleAdminListItem = ArticleListItem & {
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ArticleAdminDetail = ArticleAdminListItem & {
  content: string;
};

export type GetArticlesArgs = {
  limit?: number;
};

export type GetAdminArticlesArgs = {
  page?: number;
  limit?: number;
  published?: boolean;
};

export type GetArticlesResponse = {
  items: ArticleListItem[];
};

export type ArticleAdminListResponse = {
  page: number;
  limit: number;
  total: number;
  items: ArticleAdminListItem[];
};

export type GetArticleBySlugArgs = {
  slug: string;
};

export type GetAdminArticleByIdArgs = {
  id: string;
};

export type CreateArticleArgs = {
  title: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  isPublished?: boolean;
};

export type UpdateArticleArgs = {
  id: string;
  title?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  isPublished?: boolean;
};
