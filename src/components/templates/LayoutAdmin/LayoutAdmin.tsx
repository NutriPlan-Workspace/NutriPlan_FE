import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaNewspaper,
  FaRegChartBar,
  FaRegFolderOpen,
  FaRegListAlt,
  FaRegUser,
  FaTimes,
} from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { FileRoutesByPath, Link, useRouterState } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { cn } from '@/helpers/helpers';

interface LayoutAdminProps {
  children: ReactNode;
}

type NavItem = {
  label: string;
  to: keyof FileRoutesByPath;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    to: PATH.ADMIN as keyof FileRoutesByPath,
    icon: FaRegChartBar,
  },
  {
    label: 'Articles',
    to: PATH.ADMIN_ARTICLES as keyof FileRoutesByPath,
    icon: FaNewspaper,
  },
  {
    label: 'Users',
    to: PATH.ADMIN_USERS as keyof FileRoutesByPath,
    icon: FaRegUser,
  },
  {
    label: 'Foods',
    to: PATH.ADMIN_FOODS as keyof FileRoutesByPath,
    icon: FaRegListAlt,
  },
  {
    label: 'Curated Collections',
    to: PATH.ADMIN_COLLECTIONS as keyof FileRoutesByPath,
    icon: FaRegFolderOpen,
  },
  {
    label: 'Categories',
    to: PATH.ADMIN_CATEGORIES as keyof FileRoutesByPath,
    icon: FaRegListAlt,
  },
  {
    label: 'Meal Plans',
    to: PATH.ADMIN_MEAL_PLANS as keyof FileRoutesByPath,
    icon: FaRegChartBar,
  },
  {
    label: 'Settings',
    to: PATH.ADMIN_SETTINGS as keyof FileRoutesByPath,
    icon: IoSettingsOutline,
  },
];

const LayoutAdmin: React.FC<LayoutAdminProps> = ({ children }) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = useMemo(
    () => [
      'Use Articles to publish content to the public site.',
      'Categories help keep foods searchable and consistent.',
      'Keep units concise (e.g., 100g, serving, cup).',
      'Use the full editor for nutrition details and images.',
      'Refresh a table after bulk edits to see latest data.',
    ],
    [],
  );

  const normalizedPath = useMemo(
    () =>
      pathname.endsWith('/') && pathname.length > 1
        ? pathname.slice(0, -1)
        : pathname,
    [pathname],
  );

  const activeBase = useMemo(() => {
    const sorted = [...NAV_ITEMS]
      .map((i) => i.to as string)
      .sort((a, b) => b.length - a.length);

    return (
      sorted.find((base) => {
        const clean =
          base.endsWith('/') && base.length > 1 ? base.slice(0, -1) : base;
        return (
          normalizedPath === clean || normalizedPath.startsWith(`${clean}/`)
        );
      }) ?? PATH.ADMIN
    );
  }, [normalizedPath]);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className='relative flex h-screen w-screen overflow-hidden bg-slate-50'>
      {isMobileNavOpen && (
        <div className='fixed inset-0 z-50 lg:hidden'>
          <button
            type='button'
            aria-label='Close navigation'
            className='absolute inset-0 h-full w-full bg-slate-900/40'
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className='absolute inset-y-0 left-0 flex w-[320px] max-w-[85vw] flex-col border-r border-slate-200 bg-white'>
            <div className='flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4'>
              <Link
                to={PATH.ADMIN as unknown as string}
                className='flex items-center gap-3'
              >
                <img
                  src='https://res.cloudinary.com/dtwrwvffl/image/upload/v1746503177/gordxatzr6puhs6upcfl.png'
                  alt='NutriPlan'
                  className='h-7 w-auto'
                />
                <div className='text-left'>
                  <p className='m-0 text-sm font-semibold text-slate-900'>
                    NutriPlan Admin
                  </p>
                  <p className='m-0 text-xs text-slate-500'>Operations</p>
                </div>
              </Link>

              <button
                type='button'
                aria-label='Close navigation'
                className='inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700'
                onClick={() => setIsMobileNavOpen(false)}
              >
                <FaTimes className='h-4 w-4' />
              </button>
            </div>

            <nav className='flex-1 overflow-auto p-3'>
              <p className='px-3 pb-2 text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase'>
                Management
              </p>
              <div className='space-y-1'>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeBase === item.to;

                  return (
                    <Link
                      key={item.to}
                      to={item.to as unknown as string}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition',
                        isActive
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4',
                          isActive ? 'text-emerald-700' : 'text-slate-400',
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className='border-t border-slate-200 p-4'>
              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-3'>
                <div className='flex items-center justify-between'>
                  <p className='m-0 text-xs font-semibold text-slate-700'>
                    Tip
                  </p>
                  <div className='flex items-center gap-1'>
                    <button
                      type='button'
                      className='inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-100'
                      onClick={() =>
                        setTipIndex((prev) =>
                          prev === 0 ? tips.length - 1 : prev - 1,
                        )
                      }
                    >
                      <FaChevronLeft className='h-3 w-3' />
                    </button>
                    <button
                      type='button'
                      className='inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-100'
                      onClick={() =>
                        setTipIndex((prev) =>
                          prev === tips.length - 1 ? 0 : prev + 1,
                        )
                      }
                    >
                      <FaChevronRight className='h-3 w-3' />
                    </button>
                  </div>
                </div>
                <p className='m-0 mt-2 text-xs text-slate-600'>
                  {tips[tipIndex]}
                </p>
              </div>
              <a
                href={PATH.HOME}
                className='mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
              >
                View site
              </a>
            </div>
          </div>
        </div>
      )}

      <aside className='hidden h-full w-[280px] shrink-0 border-r border-slate-200 bg-white lg:flex'>
        <div className='flex h-full w-full flex-col'>
          <div className='flex items-center gap-3 border-b border-slate-200 px-5 py-4'>
            <Link
              to={PATH.ADMIN as unknown as string}
              className='flex items-center gap-3'
            >
              <img
                src='https://res.cloudinary.com/dtwrwvffl/image/upload/v1746503177/gordxatzr6puhs6upcfl.png'
                alt='NutriPlan'
                className='h-7 w-auto'
              />
              <div className='text-left'>
                <p className='m-0 text-sm font-semibold text-slate-900'>
                  NutriPlan Admin
                </p>
                <p className='m-0 text-xs text-slate-500'>Operations</p>
              </div>
            </Link>
          </div>

          <nav className='flex-1 overflow-auto p-3'>
            <p className='px-3 pb-2 text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase'>
              Management
            </p>
            <div className='space-y-1'>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeBase === item.to;

                return (
                  <Link
                    key={item.to}
                    to={item.to as unknown as string}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition',
                      isActive
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4',
                        isActive ? 'text-emerald-700' : 'text-slate-400',
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className='border-t border-slate-200 p-4'>
            <div className='rounded-2xl border border-slate-200 bg-slate-50 p-3'>
              <div className='flex items-center justify-between'>
                <p className='m-0 text-xs font-semibold text-slate-700'>Tip</p>
                <div className='flex items-center gap-1'>
                  <button
                    type='button'
                    className='inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-100'
                    onClick={() =>
                      setTipIndex((prev) =>
                        prev === 0 ? tips.length - 1 : prev - 1,
                      )
                    }
                  >
                    <FaChevronLeft className='h-3 w-3' />
                  </button>
                  <button
                    type='button'
                    className='inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-100'
                    onClick={() =>
                      setTipIndex((prev) =>
                        prev === tips.length - 1 ? 0 : prev + 1,
                      )
                    }
                  >
                    <FaChevronRight className='h-3 w-3' />
                  </button>
                </div>
              </div>
              <p className='m-0 mt-2 text-xs text-slate-600'>
                {tips[tipIndex]}
              </p>
            </div>
            <a
              href={PATH.HOME}
              className='mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
            >
              View site
            </a>
          </div>
        </div>
      </aside>

      <div className='flex h-full flex-1 flex-col overflow-hidden'>
        <div className='relative h-full overflow-auto'>
          <button
            type='button'
            aria-label='Open navigation'
            className='absolute top-4 left-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden'
            onClick={() => setIsMobileNavOpen(true)}
          >
            <FaBars className='h-4 w-4' />
          </button>
          <main className='min-h-full w-full pt-4'>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
