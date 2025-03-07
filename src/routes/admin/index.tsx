import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { handleAdminRoute } from '@/utils/route';

export const Route = createFileRoute(PATH.ADMIN as keyof FileRoutesByPath)({
  component: AdminPage,
  beforeLoad: handleAdminRoute,
});

function AdminPage() {
  return (
    <div>
      <h1>Admin</h1>
    </div>
  );
}
