import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';

export const Route = createFileRoute(
  PATH.UNAUTHORIZED as keyof FileRoutesByPath,
)({
  component: AccessDeniedPage,
});

function AccessDeniedPage() {
  return (
    <div>
      <h1>Access Denied</h1>
    </div>
  );
}
