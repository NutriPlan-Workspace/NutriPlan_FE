import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import MealTrack from '@/organisms/MealTrack/MealTrack';

export const Route = createFileRoute(PATH.MEAL_PLAN as keyof FileRoutesByPath)({
  component: MealPlanPage,
});

function MealPlanPage() {
  return <MealTrack />;
}
