import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { CreateRecipe } from '@/organisms/CreateRecipe';
import { handleUserRoute } from '@/utils/route';

const CreateRecipePage: React.FC = () => <CreateRecipe />;

export const Route = createFileRoute('/custom-recipes/create-recipe')({
  component: CreateRecipePage,
  beforeLoad: handleUserRoute,
});
