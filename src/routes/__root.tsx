import { createRootRoute, Outlet } from '@tanstack/react-router';

import { ModalFoodDetail } from '@/organisms/ModalFoodDetail';

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function NotFoundPage() {
  return <h1>Not Found</h1>;
}

function RootLayout() {
  return (
    <>
      <Outlet />
      <ModalFoodDetail />
    </>
  );
}
