import React, { useEffect } from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { PLAN_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { MealPlanContent } from '@/organisms/MealPlanContent';
import { MealTrack } from '@/organisms/MealTrack';
import { MealPlanWeek } from '@/templates/MealPlanWeek';
import { handleUserRoute } from '@/utils/route';

const PLAN_COMPONENTS: Record<string, React.FC> = {
  [PLAN_TYPES.SINGLE_DAY]: MealTrack,
  [PLAN_TYPES.MULTI_DAY]: MealTrack,
  [PLAN_TYPES.WEEKLY_VIEW]: MealPlanWeek,
};

const MealPlanPageContent: React.FC = () => {
  const { selectedPlan, setSelectedPlan } = useDate();
  useEffect(() => {
    setSelectedPlan(PLAN_TYPES.SINGLE_DAY);
  }, [setSelectedPlan]);
  const SelectedComponent = PLAN_COMPONENTS[selectedPlan] || MealTrack;

  return <SelectedComponent />;
};

const MealPlanPage: React.FC = () => (
  <div>
    <MealPlanContent>
      <MealPlanPageContent />
    </MealPlanContent>
  </div>
);

export const Route = createFileRoute(PATH.MEAL_PLAN as keyof FileRoutesByPath)({
  component: MealPlanPage,
  beforeLoad: handleUserRoute,
});
