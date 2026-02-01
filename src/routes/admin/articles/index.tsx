import { useMemo, useState } from 'react';
import {
  createFileRoute,
  FileRoutesByPath,
  Link,
} from '@tanstack/react-router';

import { AnimatedSubtitle } from '@/atoms/AnimatedSubtitle';
import { AnimatedTitle } from '@/atoms/AnimatedTitle';
import { PATH } from '@/constants/path';
import {
  useDeleteArticleMutation,
  useGetAdminArticlesQuery,
  useUpdateArticleMutation,
} from '@/redux/query/apis/articles/articlesAdminApi';
import { handleAdminRoute } from '@/utils/route';
import { showToastError, showToastSuccess } from '@/utils/toastUtils';

export const Route = createFileRoute(
  PATH.ADMIN_ARTICLES as keyof FileRoutesByPath,
)({
  component: AdminArticlesListPage,
  beforeLoad: handleAdminRoute,
});

type PublishedFilter = 'all' | 'published' | 'draft';

function AdminArticlesListPage() {
  const [page, setPage] = useState(1);
  const [publishedFilter, setPublishedFilter] =
    useState<PublishedFilter>('all');

  const publishedParam = useMemo(() => {
    if (publishedFilter === 'published') return true;
    if (publishedFilter === 'draft') return false;
    return undefined;
  }, [publishedFilter]);

  const { data, isLoading, isError, refetch } = useGetAdminArticlesQuery({
    page,
    limit: 10,
    published: publishedParam,
  });

  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

  const payload = data?.data;
  const items = payload?.items ?? [];
  const total = payload?.total ?? 0;
  const limit = payload?.limit ?? 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleTogglePublished = async (id: string, next: boolean) => {
    try {
      await updateArticle({ id, isPublished: next }).unwrap();
      showToastSuccess(next ? 'Article published.' : 'Article unpublished.');
    } catch {
      showToastError('Update failed. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Delete this article? This action cannot be undone.',
    );
    if (!confirmed) return;

    try {
      await deleteArticle({ id }).unwrap();
      showToastSuccess('Article deleted.');
    } catch {
      showToastError('Delete failed. Please try again.');
    }
  };

  return (
    <div className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10'>
      <div className='mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <p className='text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>
            Admin
          </p>
          <AnimatedTitle className='text-3xl font-bold text-slate-900'>
            Articles
          </AnimatedTitle>
          <AnimatedSubtitle className='max-w-2xl text-sm text-slate-600'>
            Create and maintain nutrition content. Toggle publish status with
            one click.
          </AnimatedSubtitle>
        </div>

        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <label className='text-sm text-slate-600'>
            Status{' '}
            <select
              className='ml-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800'
              value={publishedFilter}
              onChange={(e) => {
                setPublishedFilter(e.target.value as PublishedFilter);
                setPage(1);
              }}
            >
              <option value='all'>All</option>
              <option value='published'>Published</option>
              <option value='draft'>Draft</option>
            </select>
          </label>

          <button
            type='button'
            className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </button>

          <Link
            to={PATH.ADMIN_ARTICLE_CREATE as unknown as string}
            className='rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700'
          >
            Create article
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className='grid gap-4 md:grid-cols-2'>
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={`loading-${idx}`}
              className='rounded-2xl border border-slate-200 bg-white p-5'
            >
              <div className='h-4 w-1/2 animate-pulse rounded bg-slate-100' />
              <div className='mt-3 h-3 w-5/6 animate-pulse rounded bg-slate-100' />
              <div className='mt-2 h-3 w-4/6 animate-pulse rounded bg-slate-100' />
              <div className='mt-4 h-8 w-24 animate-pulse rounded-xl bg-slate-100' />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className='rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700'>
          Unable to load admin articles right now.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className='grid gap-4 md:grid-cols-2'>
            {items.map((article) => (
              <div
                key={article.id}
                className='rounded-2xl border border-slate-200 bg-white p-5'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='min-w-0'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <h2 className='truncate text-lg font-semibold text-slate-900'>
                        {article.title}
                      </h2>
                      <span
                        className={
                          article.isPublished
                            ? 'rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700'
                            : 'rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700'
                        }
                      >
                        {article.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {article.excerpt && (
                      <p className='mt-2 line-clamp-3 text-sm text-slate-600'>
                        {article.excerpt}
                      </p>
                    )}

                    <div className='mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500'>
                      {article.updatedAt && (
                        <span>
                          Updated {new Date(article.updatedAt).toLocaleString()}
                        </span>
                      )}
                      {!article.updatedAt && article.createdAt && (
                        <span>
                          Created {new Date(article.createdAt).toLocaleString()}
                        </span>
                      )}
                      {article.publishedAt && (
                        <span>
                          • Published{' '}
                          {new Date(article.publishedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='flex shrink-0 flex-col gap-2'>
                    <Link
                      to='/admin/articles/$id'
                      params={{ id: article.id }}
                      className='rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
                    >
                      Edit
                    </Link>

                    <button
                      type='button'
                      className='rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60'
                      onClick={() =>
                        handleTogglePublished(article.id, !article.isPublished)
                      }
                      disabled={isUpdating}
                    >
                      {article.isPublished ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      type='button'
                      className='rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60'
                      onClick={() => handleDelete(article.id)}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className='rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600'>
                No articles found.
              </div>
            )}
          </div>

          <div className='mt-8 flex flex-wrap items-center justify-between gap-3'>
            <p className='text-sm text-slate-600'>
              Page {page} of {totalPages} • {total} total
            </p>

            <div className='flex items-center gap-2'>
              <button
                type='button'
                className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
              <button
                type='button'
                className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60'
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
