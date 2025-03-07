import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
});

function NotFoundPage() {
  return <h1>Not Found</h1>;
}
