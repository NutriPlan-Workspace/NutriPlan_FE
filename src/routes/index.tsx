import React, { useEffect } from 'react';
import { createFileRoute, useRouterState } from '@tanstack/react-router';

import { LandingContent } from '@/organisms/LandingContent';
import { handlePublicRoute } from '@/utils/route';

const LandingPage = () => {
  const hash = useRouterState({ select: (s) => s.location.hash });

  useEffect(() => {
    if (hash !== '#try-plan') return;
    const section = document.getElementById('try-plan');
    section?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  return <LandingContent />;
};

export const Route = createFileRoute('/')({
  component: LandingPage,
  beforeLoad: handlePublicRoute,
});
