import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createFileRoute,
  FileRoutesByPath,
  useRouter,
} from '@tanstack/react-router';
import { Input, Switch } from 'antd';
import { z } from 'zod';

import { AnimatedSubtitle } from '@/atoms/AnimatedSubtitle';
import { AnimatedTitle } from '@/atoms/AnimatedTitle';
import { Button } from '@/atoms/Button';
import { InputField } from '@/atoms/Input';
import { PATH } from '@/constants/path';
import { useCreateArticleMutation } from '@/redux/query/apis/articles/articlesAdminApi';
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
  PATH.ADMIN_ARTICLE_CREATE as keyof FileRoutesByPath,
)({
  component: AdminArticleCreatePage,
  beforeLoad: handleAdminRoute,
});

function AdminArticleCreatePage() {
  const router = useRouter();
  const [createArticle, { isLoading }] = useCreateArticleMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      excerpt: '',
      coverImageUrl: '',
      content: '',
      isPublished: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const created = await createArticle({
        title: values.title,
        excerpt: values.excerpt || undefined,
        coverImageUrl: values.coverImageUrl || undefined,
        content: values.content,
        isPublished: values.isPublished,
      }).unwrap();

      showToastSuccess('Article created.');

      const id = created?.data?.id;
      if (id) {
        await router.navigate({
          to: '/admin/articles/$id',
          params: { id },
        });
        return;
      }

      await router.navigate({ to: PATH.ADMIN_ARTICLES });
    } catch {
      showToastError('Create failed. Please try again.');
    }
  };

  const contentPreview = watch('content');

  return (
    <div className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10'>
      <div className='mb-8 flex flex-col gap-2'>
        <p className='text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>
          Admin
        </p>
        <AnimatedTitle className='text-3xl font-bold text-slate-900'>
          Create article
        </AnimatedTitle>
        <AnimatedSubtitle className='max-w-2xl text-sm text-slate-600'>
          Write HTML content (use h2/h3 headings for the table of contents).
        </AnimatedSubtitle>
      </div>

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
                Publish now
              </p>
              <p className='text-xs text-slate-600'>
                If disabled, the article stays in Draft.
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

          <div className='flex flex-wrap gap-3'>
            <a
              href={PATH.ADMIN_ARTICLES}
              className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
            >
              Back
            </a>
            <Button
              htmlType='submit'
              disabled={isLoading}
              className='bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60'
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
