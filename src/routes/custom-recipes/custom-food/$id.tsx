import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { FoodCustomEdit } from '@/organisms/FoodCustomEdit';
import { handleUserRoute } from '@/utils/route';

const CustomFoodEditPage: React.FC = () => <FoodCustomEdit />;

export const Route = createFileRoute(
  PATH.CUSTOM_FOOD_EDIT as keyof FileRoutesByPath,
)({
  component: CustomFoodEditPage,
  beforeLoad: handleUserRoute,
});
