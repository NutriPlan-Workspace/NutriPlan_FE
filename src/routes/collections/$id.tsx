import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { ScaleProvider } from '@/contexts/ScaleContext';
import { ScaleProviderIngre } from '@/contexts/ScaleIngreContext';
import { CollectionDetail } from '@/organisms/CollectionDetail';
import { LayoutLogined } from '@/templates/LayoutLogined';
import { handleUserRoute } from '@/utils/route';

const CollectionDetailPage: React.FC = () => (
  <ScaleProvider>
    <ScaleProviderIngre>
      <LayoutLogined>
        <CollectionDetail />
      </LayoutLogined>
    </ScaleProviderIngre>
  </ScaleProvider>
);

export const Route = createFileRoute(PATH.COLLECTIOND_ID)({
  component: CollectionDetailPage,
  beforeLoad: handleUserRoute,
});
