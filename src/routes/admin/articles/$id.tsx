import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createFileRoute,
  FileRoutesByPath,
  Link,
  useRouter,
} from '@tanstack/react-router';
import { Input, Switch } from 'antd';
import { z } from 'zod';

import { AnimatedSubtitle } from '@/atoms/AnimatedSubtitle';
import { AnimatedTitle } from '@/atoms/AnimatedTitle';
import { Button } from '@/atoms/Button';
import { InputField } from '@/atoms/Input';
import { PATH } from '@/constants/path';
import {
  useDeleteArticleMutation,
  useGetAdminArticleByIdQuery,
  useUpdateArticleMutation,
} from '@/redux/query/apis/articles/articlesAdminApi';
import { handleAdminRoute } from '@/utils/route';
import { showToastError, showToastSuccess } from '@/utils/toastUtils';

const schema = z.object({
  title: z.string().trim().min(3, 'Title is required'),
  excerpt: z
    .string()
    .trim()
    .max(500, 'Excerpt is too long')
    .optional()
    .or(z.literal('')),
  coverImageUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Cover image must be a valid URL' },
    ),
  content: z.string().min(10, 'Content is required'),
  isPublished: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute(
  PATH.ADMIN_ARTICLE_EDIT as keyof FileRoutesByPath,
)({
  component: AdminArticleEditPage,
  beforeLoad: handleAdminRoute,
});

function AdminArticleEditPage() {
  const router = useRouter();
  const params = Route.useParams() as { id: string };
  const id = params.id;

  const { data, isLoading, isError, refetch } = useGetAdminArticleByIdQuery({
    id,
  });

  const article = data?.data;

  const [updateArticle, { isLoading: isSaving }] = useUpdateArticleMutation();
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

  const defaultValues = useMemo<FormValues>(
    () => ({
      title: article?.title ?? '',
      excerpt: article?.excerpt ?? '',
      coverImageUrl: article?.coverImageUrl ?? '',
      content: article?.content ?? '',
      isPublished: article?.isPublished ?? false,
    }),
    [article],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const isPublished = !!watch('isPublished');
  const contentPreview = watch('content');

  const onSubmit = async (values: FormValues) => {
    try {
      await updateArticle({
        id,
        title: values.title,
        excerpt: values.excerpt || undefined,
        coverImageUrl: values.coverImageUrl || undefined,
        content: values.content,
        isPublished: values.isPublished,
      }).unwrap();

      showToastSuccess('Article updated.');
      reset(values);
    } catch {
      showToastError('Update failed. Please try again.');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Delete this article? This action cannot be undone.',
    );
    if (!confirmed) return;

    try {
      await deleteArticle({ id }).unwrap();
      showToastSuccess('Article deleted.');
      await router.navigate({ to: PATH.ADMIN_ARTICLES });
    } catch {
      showToastError('Delete failed. Please try again.');
    }
  };

  const publicUrl = article?.slug ? `/articles/${article.slug}` : null;

  return (
    <div className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10'>
      <div className='mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <p className='text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>
            Admin
          </p>
          <AnimatedTitle className='text-3xl font-bold text-slate-900'>
            Edit article
          </AnimatedTitle>
          <AnimatedSubtitle className='max-w-2xl text-sm text-slate-600'>
            Update your content and keep it relevant to readers.
          </AnimatedSubtitle>
          {article?.slug && (
            <p className='text-sm text-slate-600'>
              Slug: <span className='font-mono text-xs'>{article.slug}</span>
            </p>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Link
            to={PATH.ADMIN_ARTICLES as unknown as string}
            className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
          >
            Back
          </Link>

          {publicUrl && (
            <a
              href={publicUrl}
              className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
              target='_blank'
              rel='noreferrer'
            >
              View public
            </a>
          )}

          <button
            type='button'
            className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60'
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </button>
        </div>
      </div>

      {isLoading && (
        <div className='rounded-2xl border border-slate-200 bg-white p-6'>
          <div className='h-5 w-1/2 animate-pulse rounded bg-slate-100' />
          <div className='mt-4 h-4 w-5/6 animate-pulse rounded bg-slate-100' />
          <div className='mt-2 h-4 w-4/6 animate-pulse rounded bg-slate-100' />
        </div>
      )}

      {isError && (
        <div className='rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700'>
          Unable to load this article.
        </div>
      )}

      {!isLoading && !isError && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='rounded-2xl border border-slate-200 bg-white p-6'
        >
          <div className='grid gap-5'>
            <div>
              <label className='text-sm font-semibold text-slate-700'>
                Title
              </label>
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    placeholder='e.g. Protein là gì?'
                    error={errors.title?.message}
                    className='mt-2 rounded-xl'
                  />
                )}
              />
            </div>

            <div>
              <label className='text-sm font-semibold text-slate-700'>
                Excerpt
              </label>
              <Controller
                name='excerpt'
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    rows={3}
                    placeholder='Short summary (optional)'
                    className='mt-2 rounded-xl'
                  />
                )}
              />
              {errors.excerpt?.message && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.excerpt.message}
                </p>
              )}
            </div>

            <div>
              <label className='text-sm font-semibold text-slate-700'>
                Cover image URL
              </label>
              <Controller
                name='coverImageUrl'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='https://...'
                    className='mt-2 rounded-xl'
                  />
                )}
              />
              {errors.coverImageUrl?.message && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.coverImageUrl.message}
                </p>
              )}
            </div>

            <div>
              <label className='text-sm font-semibold text-slate-700'>
                Content
              </label>
              <Controller
                name='content'
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    rows={14}
                    placeholder='Write the full article content...'
                    className='mt-2 rounded-xl'
                  />
                )}
              />
              {errors.content?.message && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.content.message}
                </p>
              )}
            </div>

            <div>
              <label className='text-sm font-semibold text-slate-700'>
                Preview (HTML)
              </label>
              <div className='mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4'>
                {contentPreview ? (
                  <div
                    className='article-content'
                    dangerouslySetInnerHTML={{ __html: contentPreview }}
                  />
                ) : (
                  <p className='text-sm text-slate-500'>
                    Nothing to preview yet.
                  </p>
                )}
              </div>
            </div>

            <div className='flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3'>
              <div>
                <p className='text-sm font-semibold text-slate-800'>
                  Published
                </p>
                <p className='text-xs text-slate-600'>
                  Toggle to publish/unpublish immediately.
                </p>
              </div>
              <Controller
                name='isPublished'
                control={control}
                render={({ field }) => (
                  <Switch checked={!!field.value} onChange={field.onChange} />
                )}
              />
            </div>

            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div className='flex flex-wrap items-center gap-2'>
                <Button
                  htmlType='submit'
                  disabled={isSaving}
                  className='bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60'
                >
                  {isSaving ? 'Saving...' : isDirty ? 'Save changes' : 'Saved'}
                </Button>

                <button
                  type='button'
                  className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60'
                  onClick={() =>
                    handleSubmit(async (values) =>
                      onSubmit({ ...values, isPublished: !isPublished }),
                    )()
                  }
                  disabled={isSaving}
                >
                  {isPublished ? 'Unpublish' : 'Publish'}
                </button>
              </div>

              <button
                type='button'
                className='rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60'
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
