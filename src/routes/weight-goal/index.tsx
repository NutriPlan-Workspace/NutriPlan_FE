import {
  createFileRoute,
  FileRoutesByPath,
  redirect,
} from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { handleUserRoute } from '@/utils/route';

export const Route = createFileRoute(
  PATH.WEIGHT_GOAL as keyof FileRoutesByPath,
)({
  component: () => null,
  beforeLoad: async () => {
    await handleUserRoute();
    throw redirect({ to: PATH.PHYSICAL_STATS });
  },
});
