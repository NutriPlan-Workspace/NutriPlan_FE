import { useCallback, useEffect, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import { PATH } from '@/constants/path';
import {
  useGetArticleBySlugQuery,
  useGetArticlesQuery,
  useTrackArticleViewMutation,
} from '@/redux/query/apis/articles/articlesApi';
import { handlePublicRoute } from '@/utils/route';
import { showToastError, showToastSuccess } from '@/utils/toastUtils';

type TocItem = {
  id: string;
  level: 2 | 3;
  title: string;
};

function slugifyId(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 64);
}

function getPlainTextFromHtml(content?: string): string {
  if (!content) return '';
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(content, 'text/html');
    return doc.body.textContent ?? '';
  }
  return content.replace(/<[^>]+>/g, ' ');
}

function estimateReadingTimeMinutes(text?: string): number {
  const cleaned = (text ?? '').trim();
  if (!cleaned) return 1;
  const words = cleaned.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function buildHtmlWithToc(content: string): { html: string; toc: TocItem[] } {
  if (!content) return { html: '', toc: [] };
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return { html: content, toc: [] };
  }

  const doc = new DOMParser().parseFromString(content, 'text/html');
  const headings = Array.from(doc.querySelectorAll('h2, h3'));
  const toc: TocItem[] = [];

  headings.forEach((heading) => {
    const title = heading.textContent?.trim() ?? '';
    if (!title) return;

    const id = slugifyId(title) || `section-${toc.length + 1}`;
    heading.setAttribute('id', id);
    heading.classList.add('scroll-mt-24');
    const level = heading.tagName === 'H2' ? 2 : 3;
    toc.push({ id, level, title });
  });

  return { html: doc.body.innerHTML, toc };
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function ArticleDetailPage() {
  const { slug } = Route.useParams();
  const { data, isFetching, isError } = useGetArticleBySlugQuery({ slug });
  const [trackArticleView] = useTrackArticleViewMutation();

  const { data: listData } = useGetArticlesQuery({ limit: 8 });

  const article = data?.data;
  const publishedDate = formatDate(article?.publishedAt);
  const currentUrl = useMemo(
    () => (typeof window === 'undefined' ? '' : window.location.href),
    [],
  );
  const readingMinutes = useMemo(() => {
    const plainText = getPlainTextFromHtml(article?.content);
    return estimateReadingTimeMinutes(plainText);
  }, [article?.content]);

  const { html: htmlContent, toc } = useMemo(() => {
    if (!article?.content) return { html: '', toc: [] as TocItem[] };
    return buildHtmlWithToc(article.content);
  }, [article?.content]);

  const related = useMemo(() => {
    const items = listData?.data?.items ?? [];
    return items.filter((i) => i.slug !== slug).slice(0, 3);
  }, [listData?.data?.items, slug]);

  useEffect(() => {
    if (!article?.id) return;
    trackArticleView({ articleId: article.id, source: 'detail' });
  }, [article?.id, trackArticleView]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        typeof window === 'undefined' ? '' : window.location.href,
      );
      showToastSuccess('Link copied.');
    } catch {
      showToastError('Unable to copy link.');
    }
  }, []);

  const handleScrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className='bg-gradient-to-b from-white to-emerald-50/40'>
      <div className='mx-auto w-full max-w-5xl px-6 py-10 lg:px-10 lg:py-14'>
        <motion.div variants={container} initial='hidden' animate='show'>
          <motion.div
            variants={item}
            className='flex items-center gap-2 text-sm text-slate-600'
          >
            <a
              href={PATH.ARTICLES}
              className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
            >
              Articles
            </a>
            <span className='text-slate-400'>/</span>
            <span className='truncate text-slate-500'>{slug}</span>
          </motion.div>

          {isFetching && (
            <motion.div variants={item} className='mt-8 space-y-3'>
              <div className='h-9 w-3/4 animate-pulse rounded-xl bg-slate-200' />
              <div className='h-4 w-2/3 animate-pulse rounded-lg bg-slate-200' />
              <div className='h-4 w-1/2 animate-pulse rounded-lg bg-slate-200' />
              <div className='mt-6 h-60 w-full animate-pulse rounded-3xl bg-slate-200' />
            </motion.div>
          )}

          {isError && !isFetching && (
            <motion.div
              variants={item}
              className='mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-6'
            >
              <p className='m-0 text-sm font-semibold text-rose-900'>
                Could not load this article.
              </p>
              <p className='m-0 mt-2 text-sm text-rose-800'>
                Please try again or go back to the list.
              </p>
              <div className='mt-4'>
                <a
                  href={PATH.ARTICLES}
                  className='inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-900 ring-1 ring-rose-200 transition hover:bg-rose-50'
                >
                  Back to Articles
                </a>
              </div>
            </motion.div>
          )}

          {article && (
            <>
              <motion.div variants={item} className='mt-8'>
                <h1 className='entry-title text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl'>
                  {article.title}
                </h1>

                <div className='mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600'>
                  <span className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800'>
                    Nutrition
                  </span>
                  <span className='text-slate-300'>•</span>
                  <span>By NutriPlan</span>
                  <span className='text-slate-300'>•</span>
                  <span>{readingMinutes} min read</span>
                  {publishedDate && (
                    <>
                      <span className='text-slate-300'>•</span>
                      <span>{publishedDate}</span>
                    </>
                  )}
                </div>

                {article.excerpt && (
                  <p className='mt-4 max-w-3xl text-base leading-7 text-slate-700'>
                    {article.excerpt}
                  </p>
                )}

                <div className='mt-6 flex flex-wrap items-center gap-2'>
                  <button
                    type='button'
                    onClick={handleCopyLink}
                    className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50'
                  >
                    Copy link
                  </button>
                  <a
                    href={PATH.ARTICLES}
                    className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50'
                  >
                    Back to Articles
                  </a>
                </div>
              </motion.div>

              {article.coverImageUrl && (
                <motion.div variants={item} className='mt-8'>
                  <div className='relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className='h-[260px] w-full object-cover sm:h-[380px]'
                      loading='lazy'
                    />
                  </div>
                </motion.div>
              )}

              <motion.div variants={item} className='mt-10'>
                <div className='grid gap-6 lg:grid-cols-[1fr_320px]'>
                  <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
                    <div
                      className='article-content'
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />

                    <div className='mt-10 flex flex-wrap gap-3'>
                      <a
                        href={PATH.BROWSE_FOODS}
                        className='rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'
                      >
                        Browse foods
                      </a>
                      <a
                        href={PATH.ARTICLES}
                        className='rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50'
                      >
                        View all articles
                      </a>
                    </div>
                  </div>

                  <aside className='space-y-4 lg:sticky lg:top-24 lg:self-start'>
                    {toc.length > 0 && (
                      <div className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
                        <p className='text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase'>
                          On this page
                        </p>
                        <div className='mt-3 space-y-2'>
                          {toc.map((t) => (
                            <button
                              key={t.id}
                              type='button'
                              onClick={() => handleScrollTo(t.id)}
                              className={
                                t.level === 2
                                  ? 'block w-full text-left text-sm font-semibold text-slate-800 hover:text-emerald-700'
                                  : 'block w-full pl-4 text-left text-sm text-slate-600 hover:text-emerald-700'
                              }
                            >
                              {t.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
                      <p className='text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase'>
                        Share
                      </p>
                      <div className='mt-3 flex flex-wrap gap-2'>
                        <button
                          type='button'
                          onClick={handleCopyLink}
                          className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50'
                        >
                          Copy link
                        </button>
                        <a
                          href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(currentUrl)}`}
                          className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50'
                        >
                          Email
                        </a>
                      </div>
                    </div>

                    {related.length > 0 && (
                      <div className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
                        <p className='text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase'>
                          Related
                        </p>
                        <div className='mt-3 space-y-3'>
                          {related.map((r) => (
                            <a
                              key={r.id}
                              href={PATH.ARTICLE_DETAIL.replace(
                                '$slug',
                                r.slug,
                              )}
                              className='block rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50/30'
                            >
                              <p className='m-0 line-clamp-2 text-sm font-semibold text-slate-900'>
                                {r.title}
                              </p>
                              {r.excerpt && (
                                <p className='m-0 mt-2 line-clamp-2 text-xs text-slate-600'>
                                  {r.excerpt}
                                </p>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </aside>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export const Route = createFileRoute(PATH.ARTICLE_DETAIL)({
  component: ArticleDetailPage,
  beforeLoad: handlePublicRoute,
});
