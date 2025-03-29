import { createFileRoute } from '@tanstack/react-router';

import { MealPlanWeek } from '@/templates/MealPlanWeek';

// TODO: remove when finish all mealplan components
export const Route = createFileRoute('/this-week/')({
  component: MealPlanWeek,
});
