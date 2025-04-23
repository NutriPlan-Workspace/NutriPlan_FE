import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { CreateCollection } from '@/atoms/CreateCollection';
import { PATH } from '@/constants/path';
import { LayoutLogined } from '@/templates/LayoutLogined';
import { handleUserRoute } from '@/utils/route';

const CollectionsPage: React.FC = () => (
  <LayoutLogined>
    <CreateCollection />
  </LayoutLogined>
);

export const Route = createFileRoute(
  PATH.CREATE_COLLECTION as keyof FileRoutesByPath,
)({
  component: CollectionsPage,
  beforeLoad: handleUserRoute,
});
