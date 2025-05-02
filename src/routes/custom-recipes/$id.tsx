import { createFileRoute } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { handleUserRoute } from '@/utils/route';

export const Route = createFileRoute(`${PATH.CUSTOM_RECIPES}/$id`)({
  component: RouteComponent,
  beforeLoad: handleUserRoute,
});

function RouteComponent() {
  return <div>Hello &quot;/custom-recipes/$id&quot;!</div>;
}
