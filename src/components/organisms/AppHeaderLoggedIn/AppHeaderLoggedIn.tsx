import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FaRegCalendarAlt, FaUser } from 'react-icons/fa';
import { IoChevronDown, IoLogOutOutline } from 'react-icons/io5';
import { PiGearSixLight } from 'react-icons/pi';
import { PiNotebookLight, PiSquaresFourLight } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Tooltip } from 'antd';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

import { HTTP_STATUS } from '@/constants/httpStatus';
import { PATH } from '@/constants/path';
import { cn } from '@/helpers/helpers';
import {
  authApi,
  useLogoutRequestMutation,
} from '@/redux/query/apis/auth/authApi';
import { removeUser, userSelector } from '@/redux/slices/user';
import { showToastError } from '@/utils/toastUtils';

const HUBS = [
  {
    key: 'planner',
    label: 'Planner Hub',
    tagline: 'Balance your meals, faster.',
    color: 'from-primary-100 to-primary-50 text-primary-800 border-primary-100',
    icon: FaRegCalendarAlt,
    items: [
      { label: 'Meal Plan', to: PATH.MEAL_PLAN },
      { label: 'Groceries', to: PATH.GROCERIES },
      { label: 'Nutrition Targets', to: PATH.NUTRITION_TARGETS },
    ],
  },
  {
    key: 'collections',
    label: 'Collection Hub',
    tagline: 'Save foods, recipes, and collections.',
    color:
      'from-secondary-100 to-secondary-50 text-secondary-700 border-secondary-100',
    icon: PiSquaresFourLight,
    items: [
      { label: 'Discover', to: PATH.DISCOVER },
      { label: 'Collections', to: PATH.COLLECTIONS },
      { label: 'Custom Recipes', to: PATH.CUSTOM_RECIPES },
    ],
  },
  {
    key: 'user',
    label: 'User Hub',
    tagline: 'Profile, goals, and preferences.',
    color: 'from-rose-50 to-white text-[#ef7a66] border-rose-100',
    icon: FaUser,
    items: [
      { label: 'Body & Goal', to: PATH.PHYSICAL_STATS },
      { label: 'Food Exclusions', to: PATH.FOOD_EXCLUSIONS },
      { label: 'Account', to: PATH.ACCOUNT },
    ],
  },
] as const;

type HubKey = (typeof HUBS)[number]['key'];

const HUB_GRADIENT: Record<HubKey, { right: string }> = {
  planner: {
    right: 'rgba(100,179,104,0.22)',
  },
  collections: {
    right: 'rgba(59,130,246,0.18)',
  },
  user: {
    right: 'rgba(251,113,133,0.12)',
  },
};

const HUB_THEME: Record<
  HubKey,
  {
    titleText: string;
    iconBg: string;
    iconText: string;
    selectorBorder: string;
    selectorGradient: string;
    tabTextActive: string;
    tabPill: string;
  }
> = {
  planner: {
    titleText: 'text-primary-700',
    iconBg: 'bg-primary-50',
    iconText: 'text-primary-700',
    selectorBorder: 'border-primary-100',
    selectorGradient: 'from-primary-100/70 to-transparent',
    tabTextActive: 'text-primary-800',
    tabPill: 'bg-primary-100 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.35)]',
  },
  collections: {
    titleText: 'text-secondary-700',
    iconBg: 'bg-secondary-50',
    iconText: 'text-secondary-700',
    selectorBorder: 'border-secondary-100',
    selectorGradient: 'from-secondary-100/70 to-transparent',
    tabTextActive: 'text-secondary-800',
    tabPill: 'bg-secondary-100 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.35)]',
  },
  user: {
    titleText: 'text-[#ef7a66]',
    iconBg: 'bg-rose-50',
    iconText: 'text-[#ef7a66]',
    selectorBorder: 'border-rose-100',
    selectorGradient: 'from-rose-50/80 to-transparent',
    tabTextActive: 'text-[#e86852]',
    tabPill: 'bg-rose-50 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.35)]',
  },
};

const AppHeaderLoggedIn: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate({ from: PATH.HOME });
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const [isHubMenuOpen, setIsHubMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const user = useSelector(userSelector).user;
  const firstName = user.fullName?.split(' ')?.[0] || 'there';
  const userInitials = useMemo(() => {
    const parts = (user.fullName ?? '').trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? 'U';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
    return `${first}${last}`.toUpperCase();
  }, [user.fullName]);
  const avatarUrl = user.avatarUrl?.trim();
  const [logout, { isLoading }] = useLogoutRequestMutation();

  const normalizedPath = useMemo(
    () =>
      pathname.endsWith('/') && pathname.length > 1
        ? pathname.slice(0, -1)
        : pathname,
    [pathname],
  );

  const derivedHub = useMemo(
    () =>
      HUBS.find((hub) =>
        hub.items.some((item) => {
          const base =
            item.to.endsWith('/') && item.to.length > 1
              ? item.to.slice(0, -1)
              : item.to;
          return (
            normalizedPath === base || normalizedPath.startsWith(`${base}/`)
          );
        }),
      ) ?? HUBS[0],
    [normalizedPath],
  );

  const [selectedHubKey, setSelectedHubKey] = useState<HubKey>(derivedHub.key);

  useEffect(() => {
    setIsHubMenuOpen(false);
    setSelectedHubKey(derivedHub.key);
  }, [derivedHub.key]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!isUserMenuOpen) return;
      const el = userMenuRef.current;
      if (!el) return;
      if (el.contains(e.target as Node)) return;
      setIsUserMenuOpen(false);
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [isUserMenuOpen]);

  const activeHub = useMemo(
    () => HUBS.find((h) => h.key === selectedHubKey) ?? derivedHub,
    [derivedHub, selectedHubKey],
  );

  const activeTheme = HUB_THEME[activeHub.key];

  const go = useCallback(
    (to: string) => {
      (navigate as unknown as (opts: { to: string }) => void)({ to });
    },
    [navigate],
  );

  const goToAccount = useCallback(() => {
    setIsUserMenuOpen(false);
    setIsHubMenuOpen(false);
    setSelectedHubKey('user');
    go(PATH.ACCOUNT);
  }, [go]);

  const handleLogout = useCallback(async () => {
    try {
      const response = await logout().unwrap();
      if (response.code === HTTP_STATUS.OK) {
        dispatch(authApi.util.resetApiState());
        dispatch(removeUser());
        navigate({ to: PATH.HOME });
      }
    } catch {
      showToastError('Logout failed. Please try again.');
    }
  }, [dispatch, logout, navigate]);

  const dropdownVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: -10, scale: 0.98 },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.18,
          ease: [0.22, 1, 0.36, 1] as const,
          when: 'beforeChildren',
          staggerChildren: 0.035,
        },
      },
      exit: {
        opacity: 0,
        y: -10,
        scale: 0.98,
        transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] as const },
      },
    }),
    [],
  );

  const dropdownItemVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: -6 },
      show: { opacity: 1, y: 0, transition: { duration: 0.14 } },
      exit: { opacity: 0, y: -6, transition: { duration: 0.1 } },
    }),
    [],
  );

  const renderHubTabs = () => {
    const renderTab = (opts: {
      to: string;
      label: string;
      isActive: boolean;
    }) => (
      <motion.button
        key={opts.to}
        layout
        type='button'
        onClick={() => go(opts.to)}
        className={cn(
          'relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors',
          opts.isActive ? activeTheme.tabTextActive : 'text-gray-600',
          !opts.isActive && 'hover:bg-gray-50',
        )}
      >
        {opts.isActive && (
          <motion.span
            layoutId={`hub-tab-pill-${activeHub.key}`}
            transition={{ type: 'spring', stiffness: 520, damping: 38 }}
            className={cn('absolute inset-0 rounded-full', activeTheme.tabPill)}
          />
        )}
        <span className='relative z-10 flex items-center gap-2'>
          <PiNotebookLight className='h-4 w-4' />
          <span className='hidden sm:inline'>{opts.label}</span>
        </span>
      </motion.button>
    );

    switch (activeHub.key) {
      case 'planner':
        return (
          <>
            {renderTab({
              to: PATH.MEAL_PLAN,
              label: 'Meal Plan',
              isActive:
                normalizedPath === PATH.MEAL_PLAN ||
                normalizedPath.startsWith(`${PATH.MEAL_PLAN}/`),
            })}
            {renderTab({
              to: PATH.GROCERIES,
              label: 'Groceries',
              isActive:
                normalizedPath === PATH.GROCERIES ||
                normalizedPath.startsWith(`${PATH.GROCERIES}/`),
            })}
            {renderTab({
              to: PATH.NUTRITION_TARGETS,
              label: 'Nutrition Targets',
              isActive:
                normalizedPath === PATH.NUTRITION_TARGETS ||
                normalizedPath.startsWith(`${PATH.NUTRITION_TARGETS}/`),
            })}
          </>
        );

      case 'collections':
        return (
          <>
            {renderTab({
              to: PATH.DISCOVER,
              label: 'Discover',
              isActive:
                normalizedPath === PATH.DISCOVER ||
                normalizedPath.startsWith(`${PATH.DISCOVER}/`),
            })}
            {renderTab({
              to: PATH.COLLECTIONS,
              label: 'Collections',
              isActive:
                normalizedPath === PATH.COLLECTIONS ||
                normalizedPath.startsWith(`${PATH.COLLECTIONS}/`),
            })}
            {renderTab({
              to: PATH.CUSTOM_RECIPES,
              label: 'Custom Recipes',
              isActive:
                normalizedPath === PATH.CUSTOM_RECIPES ||
                normalizedPath.startsWith(`${PATH.CUSTOM_RECIPES}/`),
            })}
          </>
        );

      case 'user':
      default:
        return (
          <>
            {renderTab({
              to: PATH.PHYSICAL_STATS,
              label: 'Body & Goal',
              isActive:
                normalizedPath === PATH.PHYSICAL_STATS ||
                normalizedPath.startsWith(`${PATH.PHYSICAL_STATS}/`),
            })}
            {renderTab({
              to: PATH.FOOD_EXCLUSIONS,
              label: 'Food Exclusions',
              isActive:
                normalizedPath === PATH.FOOD_EXCLUSIONS ||
                normalizedPath.startsWith(`${PATH.FOOD_EXCLUSIONS}/`),
            })}
            {renderTab({
              to: PATH.ACCOUNT,
              label: 'Account',
              isActive:
                normalizedPath === PATH.ACCOUNT ||
                normalizedPath.startsWith(`${PATH.ACCOUNT}/`),
            })}
          </>
        );
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-[200] flex items-center justify-between gap-3',
        'relative isolate overflow-visible',
        'bg-slate-100/70 shadow-[0_14px_36px_-28px_rgba(16,24,40,0.28)]',
        'saturate-150 backdrop-blur-2xl',
        'supports-[backdrop-filter:blur(0px)]:bg-white/35',
        'px-3 py-3 md:px-5',
      )}
    >
      <AnimatePresence mode='wait'>
        <motion.div
          key={`hub-bg-${activeHub.key}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className='pointer-events-none absolute inset-0 -z-10'
        >
          <div
            className='absolute inset-0'
            style={{
              background:
                'radial-gradient(900px circle at 18% 0%, rgba(255,255,255,0.95), transparent 58%)',
            }}
          />
          <div
            className='absolute inset-0'
            style={{
              background: `radial-gradient(820px circle at 82% 0%, ${HUB_GRADIENT[activeHub.key].right}, transparent 60%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className='pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px bg-black/10' />

      <div className='flex items-center gap-3'>
        <Tooltip title='Go to home' overlayClassName='np-tooltip'>
          <Link
            to={PATH.HOME}
            className={cn(
              'flex items-center justify-center rounded-2xl px-2 py-2',
              'bg-transparent shadow-none',
              'transition hover:bg-white/55 active:bg-white/70',
            )}
          >
            <img
              src='https://res.cloudinary.com/dtwrwvffl/image/upload/v1746503177/gordxatzr6puhs6upcfl.png'
              alt='NutriPlan'
              className='aspect-[21/6] h-[26px] object-contain'
            />
          </Link>
        </Tooltip>

        <div className='relative'>
          <Tooltip
            title='Switch hub'
            overlayClassName='np-tooltip'
            placement='bottom'
          >
            <button
              type='button'
              onClick={() => setIsHubMenuOpen((prev) => !prev)}
              className={cn(
                'flex items-center gap-3 rounded-2xl border bg-gradient-to-r px-3 py-2 text-left transition',
                'border-white/25 bg-white/45 shadow-[0_12px_30px_-24px_rgba(16,24,40,0.35)]',
                'saturate-150 backdrop-blur-2xl',
                'hover:bg-white/60',
                activeTheme.selectorBorder,
                activeTheme.selectorGradient,
              )}
            >
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full shadow-inner',
                  activeTheme.iconBg,
                  activeTheme.iconText,
                )}
              >
                <activeHub.icon className='h-4 w-4' />
              </div>
              <div className='flex flex-col leading-tight'>
                <AnimatePresence mode='wait' initial={false}>
                  <motion.div
                    key={`hub-selector-text-${activeHub.key}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className='flex flex-col leading-tight'
                  >
                    <span
                      className={cn(
                        'text-xs font-semibold tracking-[0.18em] uppercase',
                        activeTheme.titleText,
                      )}
                    >
                      {activeHub.label.replace('Hub', '').trim()} HUB
                    </span>
                    <span className='text-sm font-medium text-gray-500'>
                      {activeHub.tagline}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
              <IoChevronDown
                className={cn(
                  'h-4 w-4 text-gray-500 transition-transform',
                  isHubMenuOpen && 'rotate-180',
                )}
              />
            </button>
          </Tooltip>

          <AnimatePresence>
            {isHubMenuOpen && (
              <motion.div
                variants={dropdownVariants}
                initial='hidden'
                animate='show'
                exit='exit'
                className='absolute left-0 z-[240] mt-2 w-[360px] origin-top-left rounded-3xl border border-white/35 bg-white/92 p-2 shadow-[0_20px_44px_-24px_rgba(16,24,40,0.35)] saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/96'
              >
                {HUBS.map((hub) => {
                  const theme = HUB_THEME[hub.key];
                  const active = hub.key === selectedHubKey;
                  return (
                    <motion.button
                      key={hub.key}
                      type='button'
                      variants={dropdownItemVariants}
                      onClick={() => {
                        setSelectedHubKey(hub.key);
                        setIsHubMenuOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-2xl border bg-gradient-to-r px-4 py-3 text-left transition',
                        theme.selectorBorder,
                        theme.selectorGradient,
                        active
                          ? 'border-opacity-100 bg-gray-50'
                          : 'border-transparent hover:border-gray-100 hover:bg-gray-50',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full shadow-inner',
                          theme.iconBg,
                          theme.iconText,
                        )}
                      >
                        <hub.icon className='h-5 w-5' />
                      </span>
                      <span className='flex flex-col'>
                        <span
                          className={cn(
                            'text-xs font-semibold tracking-[0.18em] uppercase',
                            theme.titleText,
                          )}
                        >
                          {hub.label.replace('Hub', '').trim()} HUB
                        </span>
                        <span className='text-sm font-medium text-gray-500'>
                          {hub.tagline}
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className='absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex'>
        <div className='relative z-[220] rounded-full border border-gray-300/80 bg-white/80 px-2 py-1 shadow-[0_18px_44px_-30px_rgba(16,24,40,0.38)] saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/92'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={`hub-tabs-${activeHub.key}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className='flex items-center gap-2'
            >
              {renderHubTabs()}
            </motion.div>
          </AnimatePresence>
        </div>
      </nav>

      <div className='flex items-center gap-2 md:gap-3'>
        <div className='hidden flex-col items-end leading-tight md:flex'>
          <span
            className={cn(
              'text-xs font-semibold tracking-[0.18em] uppercase',
              activeTheme.titleText,
            )}
          >
            Welcome
          </span>
          <span className='text-sm font-medium text-gray-700'>
            Hi, {firstName}
          </span>
        </div>

        <div ref={userMenuRef} className='relative'>
          <Tooltip
            title='Account'
            overlayClassName='np-tooltip'
            placement='bottom'
          >
            <button
              type='button'
              aria-label='User menu'
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className={cn(
                'flex items-center gap-2 rounded-full border border-white/25 bg-white/45 px-2 py-1.5',
                'shadow-[0_12px_30px_-24px_rgba(16,24,40,0.35)] saturate-150 backdrop-blur-2xl',
                'hover:bg-white/60',
              )}
            >
              <span
                className={cn(
                  'relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full',
                  'border border-white/35 bg-gradient-to-br from-white/90 to-white/55',
                  'text-xs font-bold tracking-[0.12em] text-gray-700 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.35)]',
                )}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt='Avatar'
                    className='h-full w-full object-cover'
                  />
                ) : (
                  userInitials
                )}
              </span>
              <IoChevronDown
                className={cn(
                  'h-4 w-4 text-gray-500 transition-transform',
                  isUserMenuOpen && 'rotate-180',
                )}
              />
            </button>
          </Tooltip>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                variants={dropdownVariants}
                initial='hidden'
                animate='show'
                exit='exit'
                className='absolute right-0 z-[240] mt-2 w-[240px] origin-top-right overflow-hidden rounded-3xl border border-white/35 bg-white/92 shadow-[0_20px_44px_-24px_rgba(16,24,40,0.35)] saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/96'
              >
                <div className='px-4 pt-4 pb-3'>
                  <div className='text-xs font-semibold tracking-[0.18em] text-gray-500 uppercase'>
                    Signed in
                  </div>
                  <div className='mt-1 text-sm font-semibold text-gray-800'>
                    {user.fullName}
                  </div>
                  <div className='text-xs text-gray-500'>{user.email}</div>
                </div>

                <div className='h-px bg-white/40' />

                <div className='p-2'>
                  <motion.button
                    type='button'
                    onClick={goToAccount}
                    variants={dropdownItemVariants}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition',
                      'hover:bg-white/60',
                    )}
                  >
                    <span className='flex h-9 w-9 items-center justify-center rounded-full bg-white/65 text-gray-700 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.35)]'>
                      <PiGearSixLight className='h-4 w-4' />
                    </span>
                    <span className='flex flex-col'>
                      <span className='text-sm font-semibold text-gray-800'>
                        Account
                      </span>
                      <span className='text-xs text-gray-500'>
                        Profile & settings
                      </span>
                    </span>
                  </motion.button>

                  <motion.button
                    type='button'
                    disabled={isLoading}
                    onClick={handleLogout}
                    variants={dropdownItemVariants}
                    className={cn(
                      'mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition',
                      'hover:bg-red-50/70 disabled:cursor-not-allowed disabled:opacity-60',
                    )}
                  >
                    <span className='flex h-9 w-9 items-center justify-center rounded-full bg-red-50/80 text-red-600 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.25)]'>
                      <IoLogOutOutline className='h-4 w-4' />
                    </span>
                    <span className='flex flex-col'>
                      <span className='text-sm font-semibold text-red-700'>
                        {isLoading ? 'Logging out...' : 'Log Out'}
                      </span>
                      <span className='text-xs text-red-600/80'>
                        End this session
                      </span>
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default AppHeaderLoggedIn;
