import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { SIDEBAR_WIDTH } from '@/constants/layout';
import { PATH } from '@/constants/path';
import { MealPlanContent } from '@/organisms/MealPlanContent';
import { MealTrack } from '@/organisms/MealTrack';
import { LayoutLogined } from '@/templates/LayoutLogined';

const MealPlanPage: React.FC = () => (
  <LayoutLogined>
    {(isSidebarOpen) => {
      const sidebarWidth = isSidebarOpen
        ? SIDEBAR_WIDTH.OPEN
        : SIDEBAR_WIDTH.COLLAPSED;
      const width = `calc(100vw - ${sidebarWidth}px)`;

      return (
        <MealPlanContent width={width}>
          <MealTrack />
        </MealPlanContent>
      );
    }}
  </LayoutLogined>
);

export const Route = createFileRoute(PATH.MEAL_PLAN as keyof FileRoutesByPath)({
  component: MealPlanPage,
});
