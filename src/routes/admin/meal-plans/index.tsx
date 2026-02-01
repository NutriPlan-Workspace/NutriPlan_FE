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
  useDeleteAdminMealPlanMutation,
  useGetAdminMealPlansQuery,
  useUpdateAdminMealPlanMutation,
} from '@/redux/query/apis/admin/adminMealPlansApi';
import type { AdminMealPlan } from '@/types/admin';
import { handleAdminRoute } from '@/utils/route';
import { showToastError, showToastSuccess } from '@/utils/toastUtils';

export const Route = createFileRoute(
  PATH.ADMIN_MEAL_PLANS as keyof FileRoutesByPath,
)({
  component: AdminMealPlansPage,
  beforeLoad: handleAdminRoute,
});

function AdminMealPlansPage() {
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    userId: '',
    mealDate: '',
  });

  const { data, isLoading, isError, refetch } = useGetAdminMealPlansQuery({
    page,
    limit: 10,
    userId: userId || undefined,
  });

  const [updateMealPlan, { isLoading: isUpdating }] =
    useUpdateAdminMealPlanMutation();
  const [deleteMealPlan, { isLoading: isDeleting }] =
    useDeleteAdminMealPlanMutation();

  const payload = data?.data;
  const items = payload?.items ?? [];
  const total = payload?.total ?? 0;
  const totalPages = payload?.totalPages ?? 1;

  const columns = useMemo<ColumnDef<AdminMealPlan>[]>(
    () => [
      {
        header: 'Plan',
        accessorKey: 'mealDate',
        cell: ({ row }) => (
          <div>
            <p className='text-sm font-semibold text-slate-900'>
              {new Date(row.original.mealDate).toLocaleDateString()}
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
        id: 'items',
        cell: ({ row }) => {
          const itemsCount =
            (row.original.mealItems?.breakfast?.length ?? 0) +
            (row.original.mealItems?.lunch?.length ?? 0) +
            (row.original.mealItems?.dinner?.length ?? 0);
          return <span className='text-sm text-slate-600'>{itemsCount}</span>;
        },
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
                const owner = row.original.userId;
                setFormState({
                  userId:
                    typeof owner === 'string' ? owner : (owner?._id ?? ''),
                  mealDate: row.original.mealDate.split('T')[0],
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
                  'Delete this meal plan? This action cannot be undone.',
                );
                if (!confirmed) return;
                try {
                  await deleteMealPlan({ id: row.original._id }).unwrap();
                  showToastSuccess('Meal plan deleted.');
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
    [deleteMealPlan, isDeleting],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const columnCount = table.getHeaderGroups()[0]?.headers.length ?? 1;

  const handleSubmit = async () => {
    if (!editingId || !formState.userId.trim() || !formState.mealDate) return;

    try {
      await updateMealPlan({
        id: editingId,
        data: { mealDate: formState.mealDate },
      }).unwrap();
      showToastSuccess('Meal plan updated.');
      setEditingId(null);
      setFormState({ userId: '', mealDate: '' });
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
            Meal Plans
          </AnimatedTitle>
          <AnimatedSubtitle className='mt-2 max-w-2xl text-sm text-slate-600'>
            Review and manage saved meal plans.
          </AnimatedSubtitle>
        </div>

        <div className='flex items-center gap-2'>
          <a
            href={PATH.MEAL_PLAN}
            className='inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
          >
            Open planner
          </a>
        </div>
      </div>

      <div className='mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <input
          className='w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 md:max-w-sm'
          placeholder='Search meal plans'
          value={userId}
          onChange={(event) => {
            setUserId(event.target.value);
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

      {editingId && (
        <div className='mb-6 rounded-2xl border border-slate-200 bg-white p-5'>
          <div className='grid gap-4 md:grid-cols-[2fr_1fr_1fr]'>
            <input
              className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
              placeholder='User ID'
              value={formState.userId}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  userId: event.target.value,
                }))
              }
            />
            <input
              className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
              type='date'
              value={formState.mealDate}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  mealDate: event.target.value,
                }))
              }
            />
            <button
              type='button'
              className='rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60'
              onClick={handleSubmit}
              disabled={
                isUpdating || !formState.userId.trim() || !formState.mealDate
              }
            >
              Save changes
            </button>
          </div>
        </div>
      )}

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
                    Unable to load meal plans.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className='px-5 py-10 text-center text-sm'>
                      No meal plans found.
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
