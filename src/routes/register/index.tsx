import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { RegisterFormContent } from '@/molecules/RegisterFormContent';
import { FormWrapper } from '@/organisms/FormWrapper';
import { handleLoginRoute } from '@/utils/route';

const RegisterPage: React.FC = () => (
  <FormWrapper>
    <RegisterFormContent />
  </FormWrapper>
);

export const Route = createFileRoute(PATH.REGISTER as keyof FileRoutesByPath)({
  component: RegisterPage,
  beforeLoad: handleLoginRoute,
});
