import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { RegisterFormContent } from '@/molecules/RegisterFormContent';
import { FormWrapper } from '@/organisms/FormWrapper';
import { LayoutAuth } from '@/templates/LayoutAuth';

const RegisterPage: React.FC = () => (
  <LayoutAuth>
    <FormWrapper>
      <RegisterFormContent />
    </FormWrapper>
  </LayoutAuth>
);

export const Route = createFileRoute(PATH.REGISTER as keyof FileRoutesByPath)({
  component: RegisterPage,
});
