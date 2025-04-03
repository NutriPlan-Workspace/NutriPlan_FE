import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { Profile } from '@/organisms/ProfileInfo';
import { LayoutLogined } from '@/templates/LayoutLogined';
import { handleUserRoute } from '@/utils/route';

const ProfilePage: React.FC = () => (
  <LayoutLogined>
    <Profile />
  </LayoutLogined>
);

export const Route = createFileRoute(
  PATH.CREDENTIALS as keyof FileRoutesByPath,
)({
  component: ProfilePage,
  beforeLoad: handleUserRoute,
});
