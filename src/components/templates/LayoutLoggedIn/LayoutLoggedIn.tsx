import React, { ReactNode, useMemo } from 'react';
import { useRouterState } from '@tanstack/react-router';

import { AppHeaderLoggedIn } from '@/organisms/AppHeaderLoggedIn';

interface LayoutLoggedInProps {
  children: ReactNode;
}

const LayoutLoggedIn: React.FC<LayoutLoggedInProps> = ({ children }) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const hubKey = useMemo(() => {
    if (
      pathname.startsWith('/discover') ||
      pathname.startsWith('/collections') ||
      pathname.startsWith('/custom-recipes') ||
      pathname.startsWith('/custom-food')
    ) {
      return 'collections' as const;
    }
    if (
      pathname.startsWith('/physical-stats') ||
      pathname.startsWith('/food-exclusions') ||
      pathname.startsWith('/account') ||
      pathname.startsWith('/primary-diet') ||
      pathname.startsWith('/weight-goal')
    ) {
      return 'user' as const;
    }

    return 'planner' as const;
  }, [pathname]);

  const background = useMemo(() => {
    if (hubKey === 'collections') {
      return {
        left: 'rgba(59,130,246,0.10)',
        right: 'rgba(14,165,233,0.10)',
      };
    }
    if (hubKey === 'user') {
      return {
        left: 'rgba(251,113,133,0.12)',
        right: 'rgba(239,122,102,0.12)',
      };
    }
    return {
      left: 'rgba(34,197,94,0.10)',
      right: 'rgba(100,179,104,0.16)',
    };
  }, [hubKey]);

  return (
    <div
      className='relative flex h-screen w-screen overflow-hidden'
      style={{ '--app-sidebar-width': '0px' } as React.CSSProperties}
    >
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute inset-0 bg-[#fafafa]' />
        <div
          className='absolute -top-36 -left-40 h-[440px] w-[440px] rounded-full blur-3xl'
          style={{ background: background.left }}
        />
        <div
          className='absolute -top-28 -right-40 h-[480px] w-[480px] rounded-full blur-3xl'
          style={{ background: background.right }}
        />
      </div>
      {/* Main Content */}
      <div className='flex h-full flex-1 flex-col overflow-hidden'>
        <AppHeaderLoggedIn />
        <div className='h-full overflow-auto'>
          <main className='h-full w-full'>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default LayoutLoggedIn;
