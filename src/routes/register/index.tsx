import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';

export const Route = createFileRoute(PATH.REGISTER as keyof FileRoutesByPath)({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div>
      <h1>Register</h1>
    </div>
  );
}
