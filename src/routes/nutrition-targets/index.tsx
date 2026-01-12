import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { NutritionTarget } from '@/organisms/NutritionTarget';
import HubPageShell from '@/templates/HubPageShell';
import { handleUserRoute } from '@/utils/route';

const NutritionTargetPage: React.FC = () => (
  <HubPageShell
    title='Nutrition Targets'
    description='Set your daily calories and macro ranges. These targets are used across the planner to build and evaluate your meal plans.'
  >
    <NutritionTarget />
  </HubPageShell>
);

export const Route = createFileRoute(
  PATH.NUTRITION_TARGETS as keyof FileRoutesByPath,
)({
  component: NutritionTargetPage,
  beforeLoad: handleUserRoute,
});
