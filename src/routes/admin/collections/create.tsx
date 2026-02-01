import {
  createFileRoute,
  FileRoutesByPath,
  Link,
  useRouter,
} from '@tanstack/react-router';

import { AnimatedSubtitle } from '@/atoms/AnimatedSubtitle';
import { AnimatedTitle } from '@/atoms/AnimatedTitle';
import { Button } from '@/atoms/Button';
import { PATH } from '@/constants/path';
import { useCreateAdminCollectionMutation } from '@/redux/query/apis/admin/adminCollectionsApi';
import { handleAdminRoute } from '@/utils/route';
import { showToastError, showToastSuccess } from '@/utils/toastUtils';

export const Route = createFileRoute(
  PATH.ADMIN_COLLECTION_CREATE as keyof FileRoutesByPath,
)({
  component: AdminCollectionCreatePage,
  beforeLoad: handleAdminRoute,
});

function AdminCollectionCreatePage() {
  const router = useRouter();
  const [createCollection, { isLoading }] = useCreateAdminCollectionMutation();

  const handleCreate = async () => {
    try {
      const created = await createCollection({
        title: 'New curated collection',
        description: '',
        isCurated: true,
      }).unwrap();

      const id = created?.data?._id;
      if (id) {
        showToastSuccess('Collection created.');
        await router.navigate({
          to: '/admin/collections/$id',
          params: { id, slug: '' },
        });
        return;
      }

      showToastSuccess('Collection created.');
      await router.navigate({
        to: '/admin/collections',
        params: { id: '', slug: '' },
      });
    } catch {
      showToastError('Create failed. Please try again.');
    }
  };

  return (
    <div className='mx-auto w-full max-w-3xl px-6 py-10 lg:px-10'>
      <div className='mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <p className='text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>
            Admin
          </p>
          <AnimatedTitle className='text-3xl font-bold text-slate-900'>
            Create curated collection
          </AnimatedTitle>
          <AnimatedSubtitle className='max-w-2xl text-sm text-slate-600'>
            Create a curated collection and start adding foods right away.
          </AnimatedSubtitle>
        </div>
      </div>

      <div className='rounded-2xl border border-slate-200 bg-white p-6'>
        <p className='text-sm text-slate-600'>
          This creates an empty curated collection and opens the editor.
        </p>
        <div className='mt-5 flex flex-wrap gap-3'>
          <Link
            to={PATH.ADMIN_COLLECTIONS as unknown as string}
            className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
          >
            Back
          </Link>
          <Button
            className='rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60'
            disabled={isLoading}
            onClick={handleCreate}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
