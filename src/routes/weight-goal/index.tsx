import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { WeightAndGoal } from '@/organisms/WeightAndGoal';
import { handleUserRoute } from '@/utils/route';

const WeightAndGoalPage: React.FC = () => <WeightAndGoal />;
export const Route = createFileRoute(
  PATH.WEIGHT_GOAL as keyof FileRoutesByPath,
)({
  component: WeightAndGoalPage,
  beforeLoad: handleUserRoute,
});
