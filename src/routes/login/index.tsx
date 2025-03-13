import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { LoginFormWrapper } from '@/organisms/LoginFormWrapper';
import { LayoutAuth } from '@/templates/LayoutAuth';
import { handleLoginRoute } from '@/utils/route';

const LoginPage: React.FC = () => (
  <LayoutAuth>
    <LoginFormWrapper />
  </LayoutAuth>
);

export default LoginPage;

export const Route = createFileRoute(PATH.LOGIN as keyof FileRoutesByPath)({
  component: LoginPage,
  beforeLoad: handleLoginRoute,
});
