import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { WeightAndGoal } from '@/organisms/WeightAndGoal';
import { LayoutLogined } from '@/templates/LayoutLogined';

const WeightAndGoalPage: React.FC = () => (
  <LayoutLogined>
    <WeightAndGoal />;
  </LayoutLogined>
);
export const Route = createFileRoute('/weight-goal/')({
  component: WeightAndGoalPage,
});
