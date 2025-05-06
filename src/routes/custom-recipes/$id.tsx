import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import EditRecipe from '@/organisms/CreateRecipe/EditRecipe';
import { handleUserRoute } from '@/utils/route';

const EditRecipePage: React.FC = () => <EditRecipe />;

export const Route = createFileRoute(`${PATH.CUSTOM_RECIPES}/$id`)({
  component: EditRecipePage,
  beforeLoad: handleUserRoute,
});
