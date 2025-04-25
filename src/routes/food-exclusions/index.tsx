import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import FoodExclusions from '@/organisms/FoodExclusions/FoodExclusions';
import { handleUserRoute } from '@/utils/route';

const FoodExclusionsPage: React.FC = () => <FoodExclusions />;

export const Route = createFileRoute(
  PATH.FOOD_EXCLUSIONS as keyof FileRoutesByPath,
)({
  component: FoodExclusionsPage,
  beforeLoad: handleUserRoute,
});
