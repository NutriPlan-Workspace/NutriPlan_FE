import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { PrimaryDiet } from '@/organisms/PrimaryDiet';
import { handleUserRoute } from '@/utils/route';

const PrimaryDietPage: React.FC = () => <PrimaryDiet />;

export const Route = createFileRoute(
  PATH.PRIMARY_DIET as keyof FileRoutesByPath,
)({
  component: PrimaryDietPage,
  beforeLoad: handleUserRoute,
});
