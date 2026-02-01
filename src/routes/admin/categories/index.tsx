import { useMemo, useState } from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';
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
  useCreateAdminCategoryMutation,
  useDeleteAdminCategoryMutation,
  useGetAdminCategoriesQuery,
  useUpdateAdminCategoryMutation,
} from '@/redux/query/apis/admin/adminCategoriesApi';
import type { Category } from '@/types/category';
import { handleAdminRoute } from '@/utils/route';
import { showToastError, showToastSuccess } from '@/utils/toastUtils';

export const Route = createFileRoute(
  PATH.ADMIN_CATEGORIES as keyof FileRoutesByPath,
)({
  component: AdminCategoriesPage,
  beforeLoad: handleAdminRoute,
});

function AdminCategoriesPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    label: '',
    value: '',
    group: '',
    mainItem: '',
  });

  const { data, isLoading, isError, refetch } = useGetAdminCategoriesQuery({
    page,
    limit: 10,
    q: query || undefined,
  });

  const [createCategory, { isLoading: isCreating }] =
    useCreateAdminCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateAdminCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteAdminCategoryMutation();

  const payload = data?.data;
  const items = payload?.items ?? [];
  const total = payload?.total ?? 0;
  const totalPages = payload?.totalPages ?? 1;

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        header: 'Category',
        accessorKey: 'label',
        cell: ({ row }) => (
          <div>
            <p className='text-sm font-semibold text-slate-900'>
              {row.original.label}
            </p>
            <p className='text-xs text-slate-500'>#{row.original.value}</p>
          </div>
        ),
      },
      {
        header: 'Group',
        accessorKey: 'group',
        cell: ({ row }) => (
          <span className='text-sm text-slate-600'>{row.original.group}</span>
        ),
      },
      {
        header: 'Main item',
        accessorKey: 'mainItem',
        cell: ({ row }) => (
          <span className='text-sm text-slate-600'>
            {row.original.mainItem ?? '—'}
          </span>
        ),
      },
      {
        header: () => <div className='text-right'>Actions</div>,
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              className='rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
              onClick={() => {
                setEditingId(row.original._id);
                setFormState({
                  label: row.original.label ?? '',
                  value: String(row.original.value ?? ''),
                  group: row.original.group ?? '',
                  mainItem:
                    row.original.mainItem === undefined
                      ? ''
                      : String(row.original.mainItem),
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
                  'Delete this category? This action cannot be undone.',
                );
                if (!confirmed) return;
                try {
                  await deleteCategory({ id: row.original._id }).unwrap();
                  showToastSuccess('Category deleted.');
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
    [deleteCategory, isDeleting],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const columnCount = table.getHeaderGroups()[0]?.headers.length ?? 1;

  const handleSubmit = async () => {
    const value = Number(formState.value);
    if (!formState.label.trim() || Number.isNaN(value) || !formState.group) {
      showToastError('Please enter label, group, and numeric value.');
      return;
    }

    const payloadBody = {
      label: formState.label.trim(),
      value,
      group: formState.group.trim(),
      ...(formState.mainItem ? { mainItem: Number(formState.mainItem) } : {}),
    };

    try {
      if (editingId) {
        await updateCategory({ id: editingId, data: payloadBody }).unwrap();
        showToastSuccess('Category updated.');
      } else {
        await createCategory(payloadBody).unwrap();
        showToastSuccess('Category created.');
      }
      setEditingId(null);
      setFormState({ label: '', value: '', group: '', mainItem: '' });
    } catch {
      showToastError('Save failed.');
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
            Categories
          </AnimatedTitle>
          <AnimatedSubtitle className='max-w-2xl text-sm text-slate-600'>
            Maintain category labels and grouping used across foods.
          </AnimatedSubtitle>
        </div>

        <div className='flex items-center gap-2'>
          <button
            type='button'
            className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className='mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <input
          className='w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 md:max-w-sm'
          placeholder='Search categories'
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
        <div className='flex items-center gap-2'>
          <span className='text-sm text-slate-500'>Page</span>
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
        </div>
      </div>

      <div className='mb-6 rounded-2xl border border-slate-200 bg-white p-5'>
        <div className='grid gap-4 md:grid-cols-[2fr_1fr_1fr_1fr]'>
          <input
            className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
            placeholder='Label'
            value={formState.label}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, label: event.target.value }))
            }
          />
          <input
            className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
            placeholder='Value'
            type='number'
            min={0}
            value={formState.value}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, value: event.target.value }))
            }
          />
          <input
            className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
            placeholder='Group'
            value={formState.group}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, group: event.target.value }))
            }
          />
          <input
            className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
            placeholder='Main item (optional)'
            type='number'
            min={0}
            value={formState.mainItem}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                mainItem: event.target.value,
              }))
            }
          />
        </div>
        <div className='mt-3 flex justify-end'>
          <button
            type='button'
            className='rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60'
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
          >
            {editingId ? 'Save changes' : 'Create category'}
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
                        <div className='h-8 w-8 animate-pulse rounded-full bg-slate-100' />
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
                    Unable to load categories.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className='px-5 py-10 text-center text-sm'>
                      No categories found.
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
