import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { NutritionTarget } from '@/organisms/NutritionTarget';
import { LayoutLogined } from '@/templates/LayoutLogined';
import { handleUserRoute } from '@/utils/route';

const NutritionTargetPage: React.FC = () => (
  <LayoutLogined>
    <NutritionTarget />
  </LayoutLogined>
);

export const Route = createFileRoute(
  PATH.NUTRITION_TARGETS as keyof FileRoutesByPath,
)({
  component: NutritionTargetPage,
  beforeLoad: handleUserRoute,
});
