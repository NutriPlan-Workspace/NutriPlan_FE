import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { GroceriesContent } from '@/organisms/GroceriesContent';
import { handleUserRoute } from '@/utils/route';

const GroceriesPage: React.FC = () => <GroceriesContent />;

export const Route = createFileRoute('/groceries/')({
  component: GroceriesPage,
  beforeLoad: handleUserRoute,
});
