import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { PhysicalStats } from '@/organisms/PhysicalStats';
import { LayoutLogined } from '@/templates/LayoutLogined';

const PhysicalStatsPage: React.FC = () => (
  <LayoutLogined>
    <PhysicalStats />
  </LayoutLogined>
);
export const Route = createFileRoute('/physical-stats/')({
  component: PhysicalStatsPage,
});
