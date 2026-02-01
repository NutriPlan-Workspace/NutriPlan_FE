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
import { CategoryMultiSelect } from '@/molecules/CategoryMultiSelect';
import type { AdminFoodInput } from '@/redux/query/apis/admin/adminFoodsApi';
import {
  useCreateAdminFoodMutation,
  useDeleteAdminFoodMutation,
  useGetAdminFoodsQuery,
  useUpdateAdminFoodMutation,
} from '@/redux/query/apis/admin/adminFoodsApi';
import { useGetCategoriesQuery } from '@/redux/query/apis/category/categoriesApi';
import type { Food } from '@/types/food';
import { handleAdminRoute } from '@/utils/route';
import { showToastError, showToastSuccess } from '@/utils/toastUtils';

export const Route = createFileRoute(
  PATH.ADMIN_FOODS as keyof FileRoutesByPath,
)({
  component: AdminFoodsPage,
  beforeLoad: handleAdminRoute,
});

function AdminFoodsPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    type: 'create' as AdminFoodInput['type'],
    unitAmount: 1,
    unitDescription: 'serving',
    categories: [] as number[],
  });

  const limit = 10;

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAdminFoodsQuery({
      page,
      limit,
      q: query || undefined,
    });

  const { data: categoriesData } = useGetCategoriesQuery();
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    (categoriesData?.data ?? []).forEach((cat) => {
      map.set(cat.value, cat.label);
    });
    return map;
  }, [categoriesData?.data]);

  const [createFood, { isLoading: isCreating }] = useCreateAdminFoodMutation();
  const [updateFood, { isLoading: isUpdating }] = useUpdateAdminFoodMutation();
  const [deleteFood, { isLoading: isDeleting }] = useDeleteAdminFoodMutation();

  const items = data?.data ?? [];

  const columns = useMemo<ColumnDef<Food>[]>(
    () => [
      {
        header: 'Food',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 overflow-hidden rounded-xl bg-slate-100'>
              {row.original.imgUrls?.[0] ? (
                <img
                  src={row.original.imgUrls[0]}
                  alt={row.original.name}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center text-xs text-slate-400'>
                  Img
                </div>
              )}
            </div>
            <div>
              <p className='text-sm font-semibold text-slate-900'>
                {row.original.name}
              </p>
              <p className='text-xs text-slate-500'>{row.original._id}</p>
            </div>
          </div>
        ),
      },
      {
        header: 'Category',
        accessorKey: 'categories',
        cell: ({ row }) => {
          const categories = row.original.categories ?? [];
          if (!categories.length) {
            return <span className='text-sm text-slate-600'>—</span>;
          }
          return (
            <div className='flex flex-wrap gap-1'>
              {categories.slice(0, 3).map((value) => (
                <span
                  key={value}
                  className='rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700'
                >
                  {categoryMap.get(value) ?? value}
                </span>
              ))}
              {categories.length > 3 && (
                <span className='text-xs text-slate-500'>
                  +{categories.length - 3}
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: 'Calories',
        accessorKey: 'nutrition.calories',
        cell: ({ row }) => (
          <span className='text-sm text-slate-600'>
            {row.original.nutrition?.calories ?? 0}
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
                  name: row.original.name,
                  type: 'create',
                  unitAmount: row.original.units?.[0]?.amount ?? 1,
                  unitDescription:
                    row.original.units?.[0]?.description ?? 'serving',
                  categories: row.original.categories ?? [],
                });
              }}
            >
              Quick edit
            </button>
            <button
              type='button'
              className='rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100'
              onClick={() => {
                window.location.href = `/admin/foods/${row.original._id}`;
              }}
            >
              Full edit
            </button>
            <button
              type='button'
              className='rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60'
              disabled={isDeleting}
              onClick={async () => {
                const confirmed = window.confirm(
                  'Delete this food? This action cannot be undone.',
                );
                if (!confirmed) return;
                try {
                  await deleteFood({ id: row.original._id }).unwrap();
                  showToastSuccess('Food deleted.');
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
    [categoryMap, deleteFood, isDeleting],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const columnCount = table.getHeaderGroups()[0]?.headers.length ?? 1;

  const handleSubmit = async () => {
    const payload: AdminFoodInput = {
      name: formState.name.trim(),
      type: formState.type,
      units: [
        {
          amount: Number(formState.unitAmount) || 1,
          description: formState.unitDescription || 'serving',
        },
      ],
      ...(formState.categories.length
        ? { categories: formState.categories }
        : {}),
    };

    try {
      if (editingId) {
        const { type: _unused, ...updatePayload } = payload;
        void _unused;
        await updateFood({ id: editingId, data: updatePayload }).unwrap();
        showToastSuccess('Food updated.');
      } else {
        await createFood(payload).unwrap();
        showToastSuccess('Food created.');
      }
      setEditingId(null);
      setFormState({
        name: '',
        type: 'create',
        unitAmount: 1,
        unitDescription: 'serving',
        categories: [],
      });
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
            Foods
          </AnimatedTitle>
          <AnimatedSubtitle className='mt-2 max-w-2xl text-sm text-slate-600'>
            Manage the food database and nutrition facts.
          </AnimatedSubtitle>
        </div>

        <div className='flex items-center gap-2'>
          <a
            href={PATH.BROWSE_FOODS}
            className='inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
          >
            Browse foods
          </a>
          <button
            type='button'
            className='inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700'
            onClick={() => {
              window.location.href = '/admin/foods/create';
            }}
          >
            Add food
          </button>
        </div>
      </div>

      <div className='mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <input
          className='w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 md:max-w-sm'
          placeholder='Search foods (name, brand, barcode)'
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
        <div className='flex items-center gap-2'>
          {isFetching && (
            <span className='text-xs text-slate-500'>Loading...</span>
          )}
          <button
            type='button'
            className='inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60'
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className='mb-6 rounded-2xl border border-slate-200 bg-white p-5'>
        <div className='grid gap-4 md:grid-cols-[2fr_1fr_1fr_1fr]'>
          <input
            className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
            placeholder='Food name'
            value={formState.name}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, name: event.target.value }))
            }
          />
          <select
            className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
            value={formState.type}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                type: event.target.value as AdminFoodInput['type'],
              }))
            }
          >
            <option value='create'>Admin food</option>
            <option value='customFood'>Custom food</option>
            <option value='customRecipe'>Custom recipe</option>
          </select>
          <input
            className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
            type='number'
            min={0}
            placeholder='Unit amount'
            value={formState.unitAmount}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                unitAmount: Number(event.target.value),
              }))
            }
          />
          <input
            className='rounded-xl border border-slate-200 px-4 py-2 text-sm'
            placeholder='Unit description'
            value={formState.unitDescription}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                unitDescription: event.target.value,
              }))
            }
          />
        </div>
        <div className='mt-4'>
          <CategoryMultiSelect
            options={categoriesData?.data ?? []}
            value={formState.categories}
            onChange={(next) =>
              setFormState((prev) => ({ ...prev, categories: next }))
            }
          />
        </div>
        <div className='mt-4 flex justify-end'>
          <button
            type='button'
            className='rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60'
            onClick={handleSubmit}
            disabled={isCreating || isUpdating || !formState.name.trim()}
          >
            {editingId ? 'Save changes' : 'Create food'}
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
              {(isLoading || isFetching) &&
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
                    Unable to load foods.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isFetching &&
                !isError &&
                table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className='px-5 py-10 text-center text-sm'>
                      No foods found.
                    </td>
                  </tr>
                )}
              {!isLoading &&
                !isFetching &&
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

      <div className='mt-6 flex justify-between text-sm text-slate-600'>
        <p>Page {page}</p>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-slate-500'>Go to</span>
          <input
            className='w-20 rounded-lg border border-slate-200 px-3 py-2 text-sm'
            type='number'
            min={1}
            value={page}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (!next || Number.isNaN(next)) return;
              setPage(Math.max(1, next));
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
            onClick={() => setPage((p) => p + 1)}
            disabled={items.length < limit}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
