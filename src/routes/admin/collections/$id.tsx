import React, { useEffect, useMemo, useState } from 'react';
import {
  createFileRoute,
  FileRoutesByPath,
  Link,
  useParams,
} from '@tanstack/react-router';

import { AnimatedSubtitle } from '@/atoms/AnimatedSubtitle';
import { AnimatedTitle } from '@/atoms/AnimatedTitle';
import { Button } from '@/atoms/Button';
import { PATH } from '@/constants/path';
import { FoodsSection } from '@/molecules/FoodsSection';
import {
  useGetAdminCollectionDetailQuery,
  useUpdateAdminCollectionMutation,
} from '@/redux/query/apis/admin/adminCollectionsApi';
import type { CollectionFood } from '@/types/collection';
import { handleAdminRoute } from '@/utils/route';
import { showToastError, showToastSuccess } from '@/utils/toastUtils';

const dropdownItems = [
  { key: '1', label: 'Date Added' },
  { key: '2', label: 'Name' },
];

export const Route = createFileRoute(
  PATH.ADMIN_COLLECTION_DETAIL as keyof FileRoutesByPath,
)({
  component: AdminCollectionDetailPage,
  beforeLoad: handleAdminRoute,
});

function AdminCollectionDetailPage() {
  const { id } = useParams({ strict: false }) as { id?: string };

  const { data, isLoading, isError, refetch } =
    useGetAdminCollectionDetailQuery({ id: id ?? '' }, { skip: !id });

  const [updateCollection, { isLoading: isUpdating }] =
    useUpdateAdminCollectionMutation();

  const [foods, setFoods] = useState<CollectionFood[]>([]);

  useEffect(() => {
    if (data?.data?.foods) {
      setFoods(data.data.foods);
    }
  }, [data]);

  const foodsBrief = useMemo(
    () =>
      foods.map((item) => ({
        food: item.food._id,
        date: item.date,
      })),
    [foods],
  );

  const title = data?.data?.title ?? 'Curated collection';

  const handleRemoveFood = async (foodId: string) => {
    if (!id) return;

    const updatedFoods = foodsBrief.filter((entry) => entry.food !== foodId);
    try {
      await updateCollection({ id, data: { foods: updatedFoods } }).unwrap();
      setFoods((prev) => prev.filter((item) => item.food._id !== foodId));
      showToastSuccess('Food removed from collection.');
    } catch {
      showToastError('Remove failed.');
    }
  };

  const handleAddFood = async (foodId: string) => {
    if (!id) return;

    if (foods.some((item) => item.food._id === foodId)) {
      showToastError('Food already in this collection.');
      return;
    }

    const updatedFoods = [
      ...foodsBrief,
      { food: foodId, date: new Date().toISOString() },
    ];

    try {
      await updateCollection({ id, data: { foods: updatedFoods } }).unwrap();
      showToastSuccess('Food added.');
      refetch();
    } catch {
      showToastError('Add failed.');
    }
  };

  if (!id) return null;

  return (
    <div className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10'>
      <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
        <div>
          <p className='text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>
            Admin
          </p>
          <AnimatedTitle className='mt-2 text-3xl font-bold text-slate-900'>
            {title}
          </AnimatedTitle>
          <AnimatedSubtitle className='mt-2 max-w-2xl text-sm text-slate-600'>
            Manage foods inside this curated collection.
          </AnimatedSubtitle>
        </div>

        <div className='flex items-center gap-2'>
          <Link
            to={PATH.ADMIN_COLLECTIONS as unknown as string}
            className='inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
          >
            Back
          </Link>
        </div>
      </div>

      {isError ? (
        <div className='rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700'>
          Failed to load this collection.
        </div>
      ) : null}

      {isLoading ? (
        <div className='rounded-2xl border border-slate-200 bg-white p-5'>
          <div className='h-5 w-40 animate-pulse rounded bg-slate-100' />
          <div className='mt-4 h-40 animate-pulse rounded bg-slate-100' />
        </div>
      ) : (
        <div className='rounded-2xl border border-slate-200 bg-white p-6'>
          <FoodsSection
            dropdownItems={dropdownItems}
            foods={foods}
            onRemoveFood={handleRemoveFood}
            onAddFood={handleAddFood}
          />
          <div className='mt-4 flex items-center justify-end'>
            <Button
              onClick={() => refetch()}
              className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
              disabled={isUpdating}
            >
              Refresh
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/*
  The content below was an accidentally corrupted route scaffold.
  It's kept here commented out to avoid breaking the build.























































































































































}  );    </div>      )}        </div>          </div>            </Button>              Refresh            >              disabled={isUpdating}              className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'              onClick={() => refetch()}            <Button          <div className='mt-4 flex items-center justify-end'>          />            onAddFood={handleAddFood}            onRemoveFood={handleRemoveFood}            foods={foods}            dropdownItems={dropdownItems}          <FoodsSection        <div className='rounded-2xl border border-slate-200 bg-white p-6'>      ) : (        </div>          <div className='mt-4 h-40 animate-pulse rounded bg-slate-100' />          <div className='h-5 w-40 animate-pulse rounded bg-slate-100' />        <div className='rounded-2xl border border-slate-200 bg-white p-5'>      {isLoading ? (      ) : null}        </div>          Failed to load this collection.        <div className='rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700'>      {isError ? (      </div>        </div>          </Link>            Back          >            className='inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'            to={PATH.ADMIN_COLLECTIONS as unknown as string}          <Link        <div className='flex items-center gap-2'>        </div>          </AnimatedSubtitle>            Manage foods inside this curated collection.          <AnimatedSubtitle className='mt-2 max-w-2xl text-sm text-slate-600'>          </AnimatedTitle>            {title}          <AnimatedTitle className='mt-2 text-3xl font-bold text-slate-900'>          </p>            Admin          <p className='text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>        <div>      <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>    <div className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10'>  return (  if (!id) return null;  };    }      showToastError('Add failed.');    } catch {      refetch();      showToastSuccess('Food added.');      await updateCollection({ id, data: { foods: updatedFoods } }).unwrap();    try {    const updatedFoods = [...foodsBrief, { food: foodId, date: new Date().toISOString() }];    }      return;      showToastError('Food already in this collection.');    if (foods.some((item) => item.food._id === foodId)) {    if (!id) return;  const handleAddFood = async (foodId: string) => {  };    }      showToastError('Remove failed.');    } catch {      showToastSuccess('Food removed from collection.');      setFoods((prev) => prev.filter((item) => item.food._id !== foodId));      await updateCollection({ id, data: { foods: updatedFoods } }).unwrap();    try {    const updatedFoods = foodsBrief.filter((entry) => entry.food !== foodId);    if (!id) return;  const handleRemoveFood = async (foodId: string) => {  );    [foods],      })),        date: item.date,        food: item.food._id,      foods.map((item) => ({    () =>  const foodsBrief = useMemo(  const title = data?.data?.title ?? 'Curated collection';  }, [data]);    }      setFoods(data.data.foods);    if (data?.data?.foods) {  useEffect(() => {  const [foods, setFoods] = useState<CollectionFood[]>([]);    useUpdateAdminCollectionMutation();  const [updateCollection, { isLoading: isUpdating }] =  );    { skip: !id },    { id: id ?? '' },  const { data, isLoading, isError, refetch } = useGetAdminCollectionDetailQuery(  const { id } = useParams({ strict: false }) as { id?: string };function AdminCollectionDetailPage() {});  beforeLoad: handleAdminRoute,  component: AdminCollectionDetailPage,)({  PATH.ADMIN_COLLECTION_DETAIL as keyof FileRoutesByPath,export const Route = createFileRoute(];  { key: '2', label: 'Name' },  { key: '1', label: 'Date Added' },const dropdownItems = [import { showToastError, showToastSuccess } from '@/utils/toastUtils';import { handleAdminRoute } from '@/utils/route';import type { CollectionFood } from '@/types/collection';} from '@/redux/query/apis/admin/adminCollectionsApi';  useUpdateAdminCollectionMutation,  useGetAdminCollectionDetailQuery,import {import FoodsSection from '@/molecules/FoodsSection/FoodsSection';import { PATH } from '@/constants/path';import { Button } from '@/atoms/Button';import { AnimatedTitle } from '@/atoms/AnimatedTitle';import { AnimatedSubtitle } from '@/atoms/AnimatedSubtitle';import { createFileRoute, FileRoutesByPath, Link, useParams } from '@tanstack/react-router';
export const Route = createFileRoute('/admin/collections/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/collections/$id"!</div>
}

*/
