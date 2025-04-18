import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { LayoutLogined } from '@/templates/LayoutLogined';
import { handleUserRoute } from '@/utils/route';

// TODDO: Repplace children with Actual component
const CollectionsPage: React.FC = () => (
  <LayoutLogined>
    <div>Collection Page</div>
  </LayoutLogined>
);

export const Route = createFileRoute(
  PATH.COLLECTIONS as keyof FileRoutesByPath,
)({
  component: CollectionsPage,
  beforeLoad: handleUserRoute,
});
