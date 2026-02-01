import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { AdminFoodForm, AdminFoodFormValues } from '@/organisms/AdminFoodForm';
import { useCreateAdminFoodMutation } from '@/redux/query/apis/admin/adminFoodsApi';
import { useGetCategoriesQuery } from '@/redux/query/apis/category/categoriesApi';
import { handleAdminRoute } from '@/utils/route';
import { showToastError, showToastSuccess } from '@/utils/toastUtils';

export const Route = createFileRoute(
  PATH.ADMIN_FOOD_CREATE as keyof FileRoutesByPath,
)({
  component: AdminFoodCreatePage,
  beforeLoad: handleAdminRoute,
});

function AdminFoodCreatePage() {
  const [createFood, { isLoading }] = useCreateAdminFoodMutation();
  const { data: categoriesData } = useGetCategoriesQuery();

  const initialValues = {
    name: '',
    type: 'create' as const,
    description: '',
    imgUrl: '',
    units: [{ amount: 1, description: 'serving' }],
    defaultUnit: 0,
    categories: [],
    nutrition: {},
  };

  const handleSubmit = async (values: AdminFoodFormValues) => {
    try {
      const payload = {
        name: values.name.trim(),
        type: values.type,
        description: values.description || undefined,
        imgUrls: values.imgUrl ? [values.imgUrl] : undefined,
        units: values.units,
        defaultUnit: values.defaultUnit,
        categories: values.categories.length ? values.categories : undefined,
        nutrition: values.nutrition,
      };

      const result = await createFood(payload).unwrap();
      showToastSuccess('Food created.');
      const id = result?.data?._id;
      if (id) {
        window.location.href = `/admin/foods/${id}`;
        return;
      }
      window.location.href = '/admin/foods';
    } catch {
      showToastError('Create failed.');
    }
  };

  return (
    <AdminFoodForm
      title='Create food'
      submitLabel='Create food'
      categories={categoriesData?.data ?? []}
      initialValues={initialValues}
      isSubmitting={isLoading}
      onSubmit={handleSubmit}
    />
  );
}
