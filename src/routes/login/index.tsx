import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { LoginFormContent } from '@/molecules/LoginFormContent';
import { FormWrapper } from '@/organisms/FormWrapper';
import { handleLoginRoute } from '@/utils/route';

const LoginPage: React.FC = () => (
  <FormWrapper>
    <LoginFormContent />
  </FormWrapper>
);

export const Route = createFileRoute(PATH.LOGIN as keyof FileRoutesByPath)({
  component: LoginPage,
  beforeLoad: handleLoginRoute,
});
