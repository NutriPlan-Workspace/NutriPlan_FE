import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { FoodCustomContent } from '@/organisms/FoodCustomContent';
import { handleUserRoute } from '@/utils/route';

const CustomFoodPage: React.FC = () => <FoodCustomContent />;

export const Route = createFileRoute(
  PATH.CREATE_CUSTOM_FOODS as keyof FileRoutesByPath,
)({
  component: CustomFoodPage,
  beforeLoad: handleUserRoute,
});
