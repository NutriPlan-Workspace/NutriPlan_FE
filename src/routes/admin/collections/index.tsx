import { useMemo, useState } from 'react';
import {
  createFileRoute,
  FileRoutesByPath,
  Link,
} from '@tanstack/react-router';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { AnimatedSubtitle } from '@/atoms/AnimatedSubtitle';
import { AnimatedTitle } from '@/atoms/AnimatedTitle';
import { PATH } from '@/constants/path';
import {
  useCreateAdminCollectionMutation,
  useDeleteAdminCollectionMutation,
  useGetAdminCollectionsQuery,
  useUpdateAdminCollectionMutation,
} from '@/redux/query/apis/admin/adminCollectionsApi';
import type { Collection } from '@/types/collection';
import { handleAdminRoute } from '@/utils/route';
import { showToastError, showToastSuccess } from '@/utils/toastUtils';

export const Route = createFileRoute(
  PATH.ADMIN_COLLECTIONS as keyof FileRoutesByPath,
)({
  component: AdminCollectionsPage,
  beforeLoad: handleAdminRoute,
});

function AdminCollectionsPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
  });

  const { data, isLoading, isError, refetch } = useGetAdminCollectionsQuery({
    page,
    limit: 10,
    q: query || undefined,
    isCurated: true,
  });

  const [createCollection, { isLoading: isCreating }] =
    useCreateAdminCollectionMutation();
  const [updateCollection, { isLoading: isUpdating }] =
    useUpdateAdminCollectionMutation();
  const [deleteCollection, { isLoading: isDeleting }] =
    useDeleteAdminCollectionMutation();

  const payload = data?.data;
  const items = payload?.items ?? [];
  const total = payload?.total ?? 0;
  const totalPages = payload?.totalPages ?? 1;

  const columns = useMemo<ColumnDef<Collection>[]>(
    () => [
      {
        header: 'Collection',
        accessorKey: 'title',
        cell: ({ row }) => (
          <div>
            <p className='text-sm font-semibold text-slate-900'>
              {row.original.title}
            </p>
            <p className='text-xs text-slate-500'>{row.original._id}</p>
          </div>
        ),
      },
      {
        header: 'Owner',
        accessorKey: 'userId',
        cell: ({ row }) => {
          const owner = row.original.userId;
          if (!owner) {
            return <span className='text-sm text-slate-600'>—</span>;
          }
          if (typeof owner === 'string') {
            return <span className='text-sm text-slate-600'>{owner}</span>;
          }
          return (
            <div>
              <p className='text-sm font-semibold text-slate-900'>
                {owner.fullName ?? 'Unknown'}
              </p>
              <p className='text-xs text-slate-500'>{owner.email ?? ''}</p>
            </div>
          );
        },
      },
      {
        header: 'Items',
        accessorKey: 'foods',
        cell: ({ row }) => (
          <span className='text-sm text-slate-600'>
            {row.original.foods?.length ?? 0}
          </span>
        ),
      },
      {
        header: () => <div className='text-right'>Actions</div>,
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex justify-end gap-2'>
            <Link
              to={PATH.ADMIN_COLLECTION_DETAIL as unknown as string}
              params={{ id: row.original._id } as never}
              className='rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
            >
              Manage foods
            </Link>
            <button
              type='button'
              className='rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
              onClick={() => {
                setEditingId(row.original._id);
                setFormState({
                  title: row.original.title ?? '',
                  description: row.original.description ?? '',
                });
              }}
            >
              Edit
            </button>
            <button
              type='button'
              className='rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60'
              disabled={isDeleting}
              onClick={async () => {
                const confirmed = window.confirm(
                  'Delete this collection? This action cannot be undone.',
                );
                if (!confirmed) return;
                try {
                  await deleteCollection({ id: row.original._id }).unwrap();
                  showToastSuccess('Collection deleted.');
                } catch {
                  showToastError('Delete failed.');
                }
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [deleteCollection, isDeleting],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const columnCount = table.getHeaderGroups()[0]?.headers.length ?? 1;

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateCollection({
          id: editingId,
          data: {
            title: formState.title,
            description: formState.description,
          },
        }).unwrap();
        showToastSuccess('Collection updated.');
      } else {
        await createCollection({
          title: formState.title,
          description: formState.description,
          isCurated: true,
        }).unwrap();
        showToastSuccess('Collection created.');
      }
      setEditingId(null);
      setFormState({ title: '', description: '' });
    } catch {
      showToastError('Save failed.');
    }
  };

  return (
    <div className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10'>
      <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
        <div>
          <p className='text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>
            Admin
          </p>
          <AnimatedTitle className='mt-2 text-3xl font-bold text-slate-900'>
            Curated Collections
          </AnimatedTitle>
          <AnimatedSubtitle className='mt-2 max-w-2xl text-sm text-slate-600'>
            Create and manage curated collections shown across the app.
          </AnimatedSubtitle>
        </div>

        <div className='flex items-center gap-2'>
          <a
            href={PATH.COLLECTIONS}
            className='inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
          >
            View collections
          </a>
          <Link
            to={PATH.ADMIN_COLLECTION_CREATE as unknown as string}
            className='inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700'
          >
            Create collection
          </Link>
        </div>
      </div>

      <div className='mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <input
          className='w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 md:max-w-sm'
          placeholder='Search collections'
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
        <div className='flex items-center gap-2'>
          <button
            type='button'
            className='inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60'
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className='mb-6 rounded-2xl border border-slate-200 bg-white p-5'>
        <div className='grid gap-4 md:grid-cols-[2fr_2fr_1fr]'>
          <input
            className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
            placeholder='Collection title'
            value={formState.title}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, title: event.target.value }))
            }
          />
          <input
            className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
            placeholder='Description'
            value={formState.description}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
          />
          <div className='rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500'>
            Curated collections only
          </div>
        </div>
        <div className='mt-3 flex justify-end'>
          <button
            type='button'
            className='rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60'
            onClick={handleSubmit}
            disabled={isCreating || isUpdating || !formState.title.trim()}
          >
            {editingId ? 'Save changes' : 'Create collection'}
          </button>
        </div>
      </div>

      <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white'>
        <div className='overflow-x-auto'>
          <table className='min-w-full border-collapse'>
            <thead className='bg-slate-50 text-left text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className='px-5 py-3'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 10 }).map((_, index) => (
                  <tr
                    key={`loading-${index}`}
                    className='border-t border-slate-100'
                  >
                    <td colSpan={columnCount} className='px-5 py-4'>
                      <div className='flex items-center gap-4'>
                        <div className='h-10 w-10 animate-pulse rounded-xl bg-slate-100' />
                        <div className='flex-1 space-y-2'>
                          <div className='h-3 w-1/3 animate-pulse rounded bg-slate-100' />
                          <div className='h-3 w-1/4 animate-pulse rounded bg-slate-100' />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              {isError && !isLoading && (
                <tr>
                  <td colSpan={4} className='px-5 py-10 text-center text-sm'>
                    Unable to load collections.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className='px-5 py-10 text-center text-sm'>
                      No collections found.
                    </td>
                  </tr>
                )}
              {!isLoading &&
                !isError &&
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className='border-t border-slate-100'>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className='px-5 py-4 align-middle'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600'>
        <p>
          Page {page} of {totalPages} • {total} total
        </p>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-slate-500'>Go to</span>
          <input
            className='w-20 rounded-lg border border-slate-200 px-3 py-2 text-sm'
            type='number'
            min={1}
            max={totalPages}
            value={page}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (!next || Number.isNaN(next)) return;
              setPage(Math.min(Math.max(1, next), totalPages));
            }}
          />
          <button
            type='button'
            className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60'
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
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
    </div>
  );
}
