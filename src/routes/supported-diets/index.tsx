import React from 'react';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { MarketingPage } from '@/templates/MarketingPage';
import { handlePublicRoute } from '@/utils/route';

const SupportedDietsPage: React.FC = () => (
  <MarketingPage
    eyebrow='Supported diets'
    title='Plans for every dietary style'
    description='Choose from popular diets or keep it flexible. NutriPlan builds balanced meals that meet your nutrition targets.'
    heroImage='https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80'
    highlights={[
      'Anything',
      'Keto',
      'Mediterranean',
      'Paleo',
      'Vegan',
      'Vegetarian',
    ]}
    sections={[
      {
        title: 'Flexible planning',
        description:
          'Start with a diet style and adjust anytime. We keep your macros aligned even when you swap meals.',
        items: [
          'Quick switches between diets.',
          'Auto-adjusted macros.',
          'Meal swaps without effort.',
        ],
      },
      {
        title: 'Balanced macros',
        description:
          'Every diet plan includes macro targets so you stay consistent with your goals.',
        items: [
          'Carb, protein, and fat breakdowns.',
          'Calorie-aware portions.',
          'Balanced meal composition.',
        ],
      },
      {
        title: 'Local ingredients',
        description:
          'We curate meals that use accessible ingredients so you can stick to your plan easily.',
        items: [
          'Vietnam-friendly ingredients.',
          'Seasonal meal options.',
          'Easy-to-find grocery items.',
        ],
      },
      {
        title: 'Goal-driven results',
        description:
          'Whether you’re cutting, maintaining, or building muscle, NutriPlan keeps you on track.',
        items: [
          'Aligned with fitness goals.',
          'Consistent nutrition tracking.',
          'Plan summaries that keep you focused.',
        ],
      },
    ]}
  />
);

export const Route = createFileRoute(
  PATH.SUPPORTED_DIETS as keyof FileRoutesByPath,
)({
  component: SupportedDietsPage,
  beforeLoad: handlePublicRoute,
});
