import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { PhysicalStats } from '@/organisms/PhysicalStats';

const PhysicalStatsPage: React.FC = () => <PhysicalStats />;
export const Route = createFileRoute('/physical-stats/')({
  component: PhysicalStatsPage,
});
