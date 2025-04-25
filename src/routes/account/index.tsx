import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { Profile } from '@/organisms/ProfileInfo';
import { handleUserRoute } from '@/utils/route';

const ProfilePage: React.FC = () => <Profile />;

export const Route = createFileRoute(PATH.ACCOUNT as keyof FileRoutesByPath)({
  component: ProfilePage,
  beforeLoad: handleUserRoute,
});
