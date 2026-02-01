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
import { Role } from '@/constants/role';
import {
  useDeleteAdminUserMutation,
  useGetAdminUsersQuery,
  useUpdateAdminUserRoleMutation,
} from '@/redux/query/apis/admin/adminUsersApi';
import type { AdminUser } from '@/types/admin';
import { handleAdminRoute } from '@/utils/route';
import { showToastError, showToastSuccess } from '@/utils/toastUtils';

export const Route = createFileRoute(
  PATH.ADMIN_USERS as keyof FileRoutesByPath,
)({
  component: AdminUsersPage,
  beforeLoad: handleAdminRoute,
});

function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const limit = 10;

  const { data, isLoading, isError, refetch } = useGetAdminUsersQuery({
    page,
    limit,
    q: query || undefined,
  });

  const [updateRole, { isLoading: isUpdating }] =
    useUpdateAdminUserRoleMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteAdminUserMutation();

  const payload = data?.data;
  const items = payload?.items ?? [];
  const total = payload?.total ?? 0;
  const totalPages = payload?.totalPages ?? 1;

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        header: 'User',
        accessorKey: 'fullName',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700'>
              {row.original.fullName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className='text-sm font-semibold text-slate-900'>
                {row.original.fullName}
              </p>
              <p className='text-xs text-slate-500'>{row.original._id}</p>
            </div>
          </div>
        ),
      },
      {
        header: 'Email',
        accessorKey: 'email',
        cell: (info) => (
          <span className='text-sm text-slate-600'>
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        header: 'Role',
        accessorKey: 'role',
        cell: ({ row }) => (
          <select
            className='rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700'
            value={row.original.role}
            disabled={isUpdating}
            onChange={async (event) => {
              try {
                await updateRole({
                  id: row.original._id,
                  role: event.target.value,
                }).unwrap();
                showToastSuccess('Role updated.');
              } catch {
                showToastError('Update failed.');
              }
            }}
          >
            <option value={Role.USER}>User</option>
            <option value={Role.ADMIN}>Admin</option>
          </select>
        ),
      },
      {
        header: () => <div className='text-right'>Actions</div>,
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex justify-end'>
            <button
              type='button'
              className='rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60'
              disabled={isDeleting}
              onClick={async () => {
                const confirmed = window.confirm(
                  'Delete this user? This action cannot be undone.',
                );
                if (!confirmed) return;
                try {
                  await deleteUser({ id: row.original._id }).unwrap();
                  showToastSuccess('User deleted.');
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
    [deleteUser, isDeleting, isUpdating, updateRole],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const columnCount = table.getHeaderGroups()[0]?.headers.length ?? 1;

  return (
    <div className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10'>
      <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
        <div>
          <p className='text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>
            Admin
          </p>
          <AnimatedTitle className='mt-2 text-3xl font-bold text-slate-900'>
            Users
          </AnimatedTitle>
          <AnimatedSubtitle className='mt-2 max-w-2xl text-sm text-slate-600'>
            Manage user accounts and roles.
          </AnimatedSubtitle>
        </div>

        <div className='flex items-center gap-2'>
          <button
            type='button'
            disabled
            className='inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white opacity-60'
          >
            Invite user
          </button>
        </div>
      </div>

      <div className='mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <input
          className='w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 md:max-w-sm'
          placeholder='Search users (name, email)'
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
                        <div className='h-9 w-9 animate-pulse rounded-full bg-slate-100' />
                        <div className='flex-1 space-y-2'>
                          <div className='h-3 w-1/4 animate-pulse rounded bg-slate-100' />
                          <div className='h-3 w-1/3 animate-pulse rounded bg-slate-100' />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

              {isError && !isLoading && (
                <tr>
                  <td colSpan={4} className='px-5 py-10 text-center text-sm'>
                    Unable to load users.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className='px-5 py-10 text-center text-sm'>
                      No users found.
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
