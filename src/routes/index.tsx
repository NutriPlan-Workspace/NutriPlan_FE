import { useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { LandingContent } from '@/organisms/LandingContent';
import { LayoutGuest } from '@/templates/LayoutGuest';

const LandingPage = () => {
  const mealPlanRef = useRef<HTMLDivElement | null>(null);
  return (
    <LayoutGuest mealPlanRef={mealPlanRef}>
      <LandingContent mealPlanRef={mealPlanRef} />
    </LayoutGuest>
  );
};

export const Route = createFileRoute('/')({
  component: LandingPage,
});
