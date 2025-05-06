import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { CustomRecipe } from '@/organisms/CustomRecipe';
import { handleUserRoute } from '@/utils/route';

const CustomRecipePage: React.FC = () => <CustomRecipe />;

export const Route = createFileRoute(
  PATH.CUSTOM_RECIPES as keyof FileRoutesByPath,
)({
  component: CustomRecipePage,
  beforeLoad: handleUserRoute,
});
