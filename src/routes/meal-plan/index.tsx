import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { SIDEBAR_WIDTH } from '@/constants/layout';
import { PATH } from '@/constants/path';
import { PLAN_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { MealPlanContent } from '@/organisms/MealPlanContent';
import { MealTrack } from '@/organisms/MealTrack';
import { MealTrackMultiple } from '@/organisms/MealTrackMultiple';
import { LayoutLogined } from '@/templates/LayoutLogined';
import { handleUserRoute } from '@/utils/route';

const PLAN_COMPONENTS: Record<string, React.FC> = {
  [PLAN_TYPES.SINGLE_DAY]: MealTrack,
  [PLAN_TYPES.MULTI_DAY]: MealTrack,
  [PLAN_TYPES.WEEKLY_VIEW]: MealTrackMultiple,
};

const MealPlanPageContent: React.FC = () => {
  const { selectedPlan } = useDate();
  const SelectedComponent = PLAN_COMPONENTS[selectedPlan] || MealTrack;

  return <SelectedComponent />;
};

const MealPlanPage: React.FC = () => (
  <LayoutLogined>
    {(isSidebarOpen) => {
      const sidebarWidth = isSidebarOpen
        ? SIDEBAR_WIDTH.OPEN
        : SIDEBAR_WIDTH.COLLAPSED;
      const width = `calc(100vw - ${sidebarWidth}px)`;

      return (
        <MealPlanContent width={width}>
          <MealPlanPageContent />
        </MealPlanContent>
      );
    }}
  </LayoutLogined>
);

export const Route = createFileRoute(PATH.MEAL_PLAN as keyof FileRoutesByPath)({
  component: MealPlanPage,
  beforeLoad: handleUserRoute,
});
