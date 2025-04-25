import { createFileRoute } from '@tanstack/react-router';

import { PATH } from '@/constants/path';

export const Route = createFileRoute(`${PATH.CUSTOM_RECIPES}/$id`)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello &quot;/custom-recipes/$id&quot;!</div>;
}
