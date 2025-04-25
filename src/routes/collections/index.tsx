import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { Collection } from '@/organisms/Collection';
import { handleUserRoute } from '@/utils/route';

const CollectionsPage: React.FC = () => <Collection />;

export const Route = createFileRoute(
  PATH.COLLECTIONS as keyof FileRoutesByPath,
)({
  component: CollectionsPage,
  beforeLoad: handleUserRoute,
});
