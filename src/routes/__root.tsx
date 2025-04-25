import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useRouterState } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';

import { PATH } from '@/constants/path';
import { ModalFoodDetail } from '@/organisms/ModalFoodDetail';
import { LayoutAuth } from '@/templates/LayoutAuth';
import { LayoutGuest } from '@/templates/LayoutGuest';
import { LayoutLoggedIn } from '@/templates/LayoutLoggedIn';

export const Route = createRootRoute({
  component: TemplateComponent,
  notFoundComponent: NotFoundPage,
});

const layoutVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  let layoutKey: string;
  let LayoutComponent: React.FC<{ children: React.ReactNode }>;
  if (pathname === PATH.LOGIN || pathname === PATH.REGISTER) {
    layoutKey = 'auth';
    LayoutComponent = LayoutAuth;
  } else if (pathname === PATH.HOME || pathname === PATH.BROWSE_FOODS) {
    layoutKey = 'guest';
    LayoutComponent = LayoutGuest;
  } else {
    layoutKey = 'logged-in';
    LayoutComponent = LayoutLoggedIn;
  }

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={layoutKey}
        initial='initial'
        animate='animate'
        exit='exit'
        variants={layoutVariants}
        transition={{ duration: 0.2 }}
      >
        <LayoutComponent>{children}</LayoutComponent>
      </motion.div>
    </AnimatePresence>
  );
}

function TemplateComponent() {
  return (
    <div className='w-[100vw]'>
      <LayoutWrapper>
        <Outlet />
      </LayoutWrapper>
      <ModalFoodDetail />
    </div>
  );
}

function NotFoundPage() {
  return <h1>Not Found</h1>;
}
