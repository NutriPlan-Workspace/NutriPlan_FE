import React, { useEffect, useRef, useState } from 'react';
import {
  createRootRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';

import { PATH } from '@/constants/path';
import { TourProvider } from '@/contexts/TourContext';
import { ModalFoodDetail } from '@/organisms/ModalFoodDetail';
import { LayoutAdmin } from '@/templates/LayoutAdmin';
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
  }

  if (pathname === PATH.ADMIN || pathname.startsWith('/admin/')) {
    return 'admin';
  }

  const guestRoutes = new Set<string>([
    PATH.HOME,
    PATH.BROWSE_FOODS,
    PATH.HOW_IT_WORKS,
    PATH.ABOUT_US,
    PATH.ARTICLES,
    PATH.UNAUTHORIZED,
  ]);

  if (guestRoutes.has(pathname) || pathname.startsWith('/articles/')) {
    return 'guest';
  }

  return 'logged-in';
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isRouteLoading = useRouterState({
    select: (state) => state.isLoading,
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentLayoutKey, setCurrentLayoutKey] = useState(() =>
    getLayoutKey(pathname),
  );

  const currentLayoutKeyRef = useRef(currentLayoutKey);
  const delayLayoutChangeRef = useRef<number | null>(null);
  const hideOverlayRef = useRef<number | null>(null);

  useEffect(() => {
    currentLayoutKeyRef.current = currentLayoutKey;
  }, [currentLayoutKey]);

  useEffect(() => {
    const nextLayoutKey = getLayoutKey(pathname);
    if (nextLayoutKey !== currentLayoutKeyRef.current) {
      setIsTransitioning(true);

      if (delayLayoutChangeRef.current) {
        clearTimeout(delayLayoutChangeRef.current);
        delayLayoutChangeRef.current = null;
      }
      if (hideOverlayRef.current) {
        clearTimeout(hideOverlayRef.current);
        hideOverlayRef.current = null;
      }

      delayLayoutChangeRef.current = window.setTimeout(() => {
        setCurrentLayoutKey(nextLayoutKey);
      }, 500);

      hideOverlayRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);

      return () => {
        if (delayLayoutChangeRef.current) {
          clearTimeout(delayLayoutChangeRef.current);
          delayLayoutChangeRef.current = null;
        }
        if (hideOverlayRef.current) {
          clearTimeout(hideOverlayRef.current);
          hideOverlayRef.current = null;
        }
      };
    }
  }, [pathname]);

  let LayoutComponent: React.FC<{ children: React.ReactNode }>;
  if (currentLayoutKey === 'auth') {
    LayoutComponent = LayoutAuth;
  } else if (currentLayoutKey === 'admin') {
    LayoutComponent = LayoutAdmin;
  } else if (currentLayoutKey === 'guest') {
    LayoutComponent = LayoutGuest;
  } else {
    LayoutComponent = LayoutLoggedIn;
  }

  return (
    <div className='relative h-full w-full'>
      <AnimatePresence>
        {isRouteLoading && (
          <motion.div
            key='route-progress'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-x-0 top-0 z-50 h-1 bg-emerald-500/80'
          />
        )}
      </AnimatePresence>
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
    <TourProvider>
      <LayoutWrapper>
        <Outlet />
      </LayoutWrapper>
      <ModalFoodDetail />
    </TourProvider>
  );
}

function NotFoundPage() {
  return <h1>Not Found</h1>;
}
