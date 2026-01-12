import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { Profile } from '@/organisms/ProfileInfo';
import UserHubPageShell from '@/templates/UserHubPageShell';
import { handleUserRoute } from '@/utils/route';

const ProfilePage: React.FC = () => (
  <UserHubPageShell
    title='Account'
    description='Manage your credentials and security settings.'
  >
    <Profile />
  </UserHubPageShell>
);

export const Route = createFileRoute(PATH.ACCOUNT as keyof FileRoutesByPath)({
  component: ProfilePage,
  beforeLoad: handleUserRoute,
});
