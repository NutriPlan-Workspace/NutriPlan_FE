import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { GroceriesContent } from '@/organisms/GroceriesContent';
import { LayoutLogined } from '@/templates/LayoutLogined';

const GroceriesPage: React.FC = () => (
  <LayoutLogined>
    <GroceriesContent />
  </LayoutLogined>
);
export const Route = createFileRoute('/groceries/')({
  component: GroceriesPage,
});
