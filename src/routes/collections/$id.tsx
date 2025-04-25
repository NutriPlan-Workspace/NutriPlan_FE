import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { CollectionDetail } from '@/organisms/CollectionDetail';
import { handleUserRoute } from '@/utils/route';

const CollectionDetailPage: React.FC = () => <CollectionDetail />;

export const Route = createFileRoute(PATH.COLLECTION_ID)({
  component: CollectionDetailPage,
  beforeLoad: handleUserRoute,
});
