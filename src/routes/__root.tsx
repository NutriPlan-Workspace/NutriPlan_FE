import React, { useEffect, useState } from 'react';
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

function getLayoutKey(pathname: string): string {
  if (pathname === PATH.LOGIN || pathname === PATH.REGISTER) {
    return 'auth';
  } else if (pathname === PATH.HOME || pathname === PATH.BROWSE_FOODS) {
    return 'guest';
  } else {
    return 'logged-in';
  }
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentLayoutKey, setCurrentLayoutKey] = useState(() =>
    getLayoutKey(pathname),
  );

  useEffect(() => {
    const nextLayoutKey = getLayoutKey(pathname);
    if (nextLayoutKey !== currentLayoutKey) {
      setIsTransitioning(true);

      const delayLayoutChange = setTimeout(() => {
        setCurrentLayoutKey(nextLayoutKey);
      }, 500);

      const hideOverlay = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);

      return () => {
        clearTimeout(delayLayoutChange);
        clearTimeout(hideOverlay);
      };
    }
  }, [pathname]);

  let LayoutComponent: React.FC<{ children: React.ReactNode }>;
  if (currentLayoutKey === 'auth') {
    LayoutComponent = LayoutAuth;
  } else if (currentLayoutKey === 'guest') {
    LayoutComponent = LayoutGuest;
  } else {
    LayoutComponent = LayoutLoggedIn;
  }

  return (
    <div className='relative h-full w-full'>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key='overlay'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-white'
          >
            <img
              src='https://res.cloudinary.com/dtwrwvffl/image/upload/v1746503177/gordxatzr6puhs6upcfl.png'
              alt='Loading'
              className='w-100 animate-pulse object-cover'
            />
          </motion.div>
        )}
      </AnimatePresence>

      <LayoutComponent key={currentLayoutKey}>
        {!isTransitioning ? children : <div className='min-h-[100vh]'></div>}
      </LayoutComponent>
    </div>
  );
}

function TemplateComponent() {
  return (
    <>
      <LayoutWrapper>
        <Outlet />
      </LayoutWrapper>
      <ModalFoodDetail />
    </>
  );
}

function NotFoundPage() {
  return <h1>Not Found</h1>;
}
