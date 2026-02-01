import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { MarketingPage } from '@/templates/MarketingPage';
import { handlePublicRoute } from '@/utils/route';

const WhyNutriPlanPage: React.FC = () => (
  <MarketingPage
    eyebrow='Why NutriPlan'
    title='Nutrition planning built for real life'
    description='NutriPlan combines Vietnamese-inspired meals, smart nutrition targets, and effortless planning tools so you can stay consistent.'
    heroImage='https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80'
    highlights={['Balanced macros', 'Local favorites', 'Time-saving tools']}
    sections={[
      {
        title: 'Eat with confidence',
        description:
          'Get clear nutrition insights for every meal so you know exactly how each plan supports your goals.',
        items: [
          'Macro targets tailored to you.',
          'Nutrition breakdowns for each dish.',
          'Balanced meal suggestions every time.',
        ],
      },
      {
        title: 'Built for Vietnam',
        description:
          'Discover meals that match local flavors and eating habits, so healthy eating stays realistic.',
        items: [
          'Vietnamese-inspired meal library.',
          'Flexible recipes for your pantry.',
          'Culturally familiar ingredients.',
        ],
      },
      {
        title: 'Stay consistent',
        description:
          'Plan faster, swap easily, and keep your routine on track even on busy days.',
        items: [
          'Quick plan generation.',
          'Easy meal swaps without breaking targets.',
          'Repeat your favorite plans anytime.',
        ],
      },
      {
        title: 'All-in-one planning',
        description:
          'From meal ideas to grocery lists, NutriPlan keeps every step in one place.',
        items: [
          'Organized meal timelines.',
          'Exportable grocery lists.',
          'Clear, shareable plan summaries.',
        ],
      },
    ]}
  />
);

export const Route = createFileRoute(
  PATH.WHY_NUTRIPLAN as keyof FileRoutesByPath,
)({
  component: WhyNutriPlanPage,
  beforeLoad: handlePublicRoute,
});
