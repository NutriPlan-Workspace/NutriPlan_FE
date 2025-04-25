import { createFileRoute } from '@tanstack/react-router';

import { LandingContent } from '@/organisms/LandingContent';
import { handlePublicRoute } from '@/utils/route';

const LandingPage = () => <LandingContent />;

export const Route = createFileRoute('/')({
  component: LandingPage,
  beforeLoad: handlePublicRoute,
});
