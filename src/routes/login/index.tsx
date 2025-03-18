import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { LoginFormContent } from '@/molecules/LoginFormContent';
import { FormWrapper } from '@/organisms/FormWrapper';
import { LayoutAuth } from '@/templates/LayoutAuth';
import { handleLoginRoute } from '@/utils/route';

const LoginPage: React.FC = () => (
  <LayoutAuth>
    <FormWrapper>
      <LoginFormContent />
    </FormWrapper>
  </LayoutAuth>
);

export const Route = createFileRoute(PATH.LOGIN as keyof FileRoutesByPath)({
  component: LoginPage,
  beforeLoad: handleLoginRoute,
});
