import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { PrimaryDiet } from '@/organisms/PrimaryDiet';
import { LayoutLogined } from '@/templates/LayoutLogined';
import { handleUserRoute } from '@/utils/route';

const PrimaryDietPage: React.FC = () => (
  <LayoutLogined>
    <PrimaryDiet />
  </LayoutLogined>
);

export const Route = createFileRoute(
  PATH.PRIMARY_DIET as keyof FileRoutesByPath,
)({
  component: PrimaryDietPage,
  beforeLoad: handleUserRoute,
});
