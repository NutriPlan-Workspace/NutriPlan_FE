import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { GroceriesContent } from '@/organisms/GroceriesContent';

const GroceriesPage: React.FC = () => <GroceriesContent />;
export const Route = createFileRoute('/groceries/')({
  component: GroceriesPage,
});
