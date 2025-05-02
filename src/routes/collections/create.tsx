import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { CreateCollection } from '@/atoms/CreateCollection';
import { PATH } from '@/constants/path';
import { handleUserRoute } from '@/utils/route';

const CollectionsPage: React.FC = () => <CreateCollection />;

export const Route = createFileRoute(
  PATH.CREATE_COLLECTION as keyof FileRoutesByPath,
)({
  component: CollectionsPage,
  beforeLoad: handleUserRoute,
});
