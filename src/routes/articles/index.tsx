import {
  createFileRoute,
  FileRoutesByPath,
  Link,
} from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { useGetArticlesQuery } from '@/redux/query/apis/articles/articlesApi';
import { handlePublicRoute } from '@/utils/route';

export const Route = createFileRoute(PATH.ARTICLES as keyof FileRoutesByPath)({
  component: ArticlesPage,
  beforeLoad: handlePublicRoute,
});

function ArticlesPage() {
  const { data, isLoading, isError } = useGetArticlesQuery({ limit: 20 });
  const items = data?.data?.items ?? [];

  return (
    <div className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10'>
      <div className='mb-8 flex flex-col gap-2'>
        <p className='text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>
          Articles
        </p>
        <h1 className='text-3xl font-bold text-slate-900'>
          Nutrition insights & updates
        </h1>
        <p className='max-w-2xl text-sm text-slate-600'>
          Posts curated and updated by admins to help you plan smarter.
        </p>
      </div>

      {isLoading && (
        <div className='grid gap-4 md:grid-cols-2'>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className='rounded-2xl border border-slate-200 bg-white p-5'
            >
              <div className='h-4 w-1/2 animate-pulse rounded bg-slate-100' />
              <div className='mt-3 h-3 w-5/6 animate-pulse rounded bg-slate-100' />
              <div className='mt-2 h-3 w-4/6 animate-pulse rounded bg-slate-100' />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className='rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700'>
          Unable to load articles right now.
        </div>
      )}

      {!isLoading && !isError && (
        <div className='grid gap-4 md:grid-cols-2'>
          {items.map((article) => (
            <Link
              key={article.id}
              to={PATH.ARTICLE_DETAIL.replace('$slug', article.slug)}
              className='group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm'
            >
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <h2 className='text-lg font-bold text-slate-900 group-hover:text-emerald-700'>
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className='mt-2 line-clamp-3 text-sm text-slate-600'>
                      {article.excerpt}
                    </p>
                  )}
                </div>
                <span className='shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600'>
                  Read
                </span>
              </div>
            </Link>
          ))}

          {items.length === 0 && (
            <div className='rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600'>
              No articles yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
