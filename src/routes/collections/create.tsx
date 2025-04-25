import { createFileRoute } from '@tanstack/react-router';

import { PATH } from '@/constants/path';

export const Route = createFileRoute(PATH.CREATE_COLLECTION)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Collection</div>;
}
