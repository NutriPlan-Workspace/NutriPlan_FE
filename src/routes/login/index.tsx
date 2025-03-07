import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { handleLoginRoute } from '@/utils/route';

export const Route = createFileRoute(PATH.LOGIN as keyof FileRoutesByPath)({
  component: LoginPage,
  beforeLoad: handleLoginRoute,
});

function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
    </div>
  );
}
