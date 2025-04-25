import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { CustomRecipe } from '@/organisms/CustomRecipe';
import { handleUserRoute } from '@/utils/route';

const CustomeRecipePage: React.FC = () => <CustomRecipe />;

export const Route = createFileRoute(
  PATH.CUSTOM_RECIPES as keyof FileRoutesByPath,
)({
  component: CustomeRecipePage,
  beforeLoad: handleUserRoute,
});
