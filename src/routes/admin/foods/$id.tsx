import { useMemo } from 'react';
import {
  createFileRoute,
  FileRoutesByPath,
  useParams,
} from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { AdminFoodForm, AdminFoodFormValues } from '@/organisms/AdminFoodForm';
import {
  useGetAdminFoodByIdQuery,
  useUpdateAdminFoodMutation,
} from '@/redux/query/apis/admin/adminFoodsApi';
import { useGetCategoriesQuery } from '@/redux/query/apis/category/categoriesApi';
import type { Food } from '@/types/food';
import { handleAdminRoute } from '@/utils/route';
import { showToastError, showToastSuccess } from '@/utils/toastUtils';

export const Route = createFileRoute(
  PATH.ADMIN_FOOD_EDIT as keyof FileRoutesByPath,
)({
  component: AdminFoodEditPage,
  beforeLoad: handleAdminRoute,
});

const resolveFoodType = (food?: Food): AdminFoodFormValues['type'] => {
  if (!food) return 'create' as const;
  if (!food.isCustom) return 'create' as const;
  return food.isRecipe ? 'customRecipe' : 'customFood';
};

function AdminFoodEditPage() {
  const { id } = useParams({ strict: false });
  const { data, isLoading } = useGetAdminFoodByIdQuery(id!);
  const [updateFood, { isLoading: isUpdating }] = useUpdateAdminFoodMutation();
  const { data: categoriesData } = useGetCategoriesQuery();

  const food = data?.data?.mainFood;
  const initialValues = useMemo<AdminFoodFormValues>(
    () => ({
      name: food?.name ?? '',
      type: resolveFoodType(food),
      description: food?.description ?? '',
      imgUrl: food?.imgUrls?.[0] ?? '',
      units:
        food?.units?.length && Array.isArray(food.units)
          ? food.units.map((unit) => ({
              amount: unit.amount ?? 1,
              description: unit.description ?? 'serving',
            }))
          : [{ amount: 1, description: 'serving' }],
      defaultUnit: food?.defaultUnit ?? 0,
      categories: food?.categories ?? [],
      nutrition: food?.nutrition ?? {},
    }),
    [food],
  );

  const handleSubmit = async (payload: AdminFoodFormValues) => {
    if (!id) return;
    try {
      await updateFood({
        id,
        data: {
          name: payload.name.trim(),
          type: payload.type,
          description: payload.description || undefined,
          imgUrls: payload.imgUrl ? [payload.imgUrl] : undefined,
          units: payload.units,
          defaultUnit: payload.defaultUnit,
          categories: payload.categories.length
            ? payload.categories
            : undefined,
          nutrition: payload.nutrition,
        },
      }).unwrap();
      showToastSuccess('Food updated.');
      window.location.href = '/admin/foods';
    } catch {
      showToastError('Update failed.');
    }
  };

  if (isLoading) {
    return (
      <div className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10'>
        Loading food...
      </div>
    );
  }

  if (!food) {
    return (
      <div className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10'>
        Food not found.
      </div>
    );
  }

  return (
    <AdminFoodForm
      title={`Edit ${food.name}`}
      submitLabel='Save changes'
      categories={categoriesData?.data ?? []}
      initialValues={initialValues}
      isSubmitting={isUpdating}
      onSubmit={handleSubmit}
    />
  );
}
