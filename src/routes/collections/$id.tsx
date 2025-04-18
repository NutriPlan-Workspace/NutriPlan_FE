import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { CollectionDetail } from '@/organisms/CollectionDetail';
import { LayoutLogined } from '@/templates/LayoutLogined';
import { handleUserRoute } from '@/utils/route';

const CollectionDetailPage: React.FC = () => (
  <LayoutLogined>
    <CollectionDetail />
  </LayoutLogined>
);

export const Route = createFileRoute(PATH.COLLECTIOND_ID)({
  component: CollectionDetailPage,
  beforeLoad: handleUserRoute,
});
