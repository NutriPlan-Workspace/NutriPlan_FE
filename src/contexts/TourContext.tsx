import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FaPaperPlane, FaPlus, FaTimes } from 'react-icons/fa';
import { PiQuestionBold } from 'react-icons/pi';
import { useRouterState } from '@tanstack/react-router';
import { type Driver, driver, type DriveStep } from 'driver.js';
import { AnimatePresence, motion } from 'motion/react';

import { PATH } from '@/constants/path';
import { cn } from '@/helpers/helpers';
import { useMealPlanSetupStatus } from '@/hooks/useMealPlanSetupStatus';
import { MealPlanChatbot } from '@/organisms/MealPlanChatbot';
import { useGetPrimaryDietQuery } from '@/redux/query/apis/user/userApi';
import { showToastError } from '@/utils/toastUtils';

import 'driver.js/dist/driver.css';

type TourId = 'guest:landing' | 'logged-in:nav' | 'logged-in:setup-required';

type TourOption = {
  id: TourId;
  title: string;
  description: string;
};

type TourContextValue = {
  startTour: (
    tourId: TourId,
    options?: { mode?: 'restart' | 'resume' },
  ) => void;
  stopTour: () => void;
  isRunning: boolean;
  isDisabled: boolean;
  disableOnboarding: () => void;
  enableOnboarding: () => void;
};

const TourContext = createContext<TourContextValue | null>(null);

function getLayoutKey(
  pathname: string,
): 'auth' | 'admin' | 'guest' | 'logged-in' {
  if (pathname === PATH.LOGIN || pathname === PATH.REGISTER) return 'auth';
  if (pathname === PATH.ADMIN || pathname.startsWith('/admin/')) return 'admin';

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

function storageKeyForCompleted(tourId: TourId) {
  return `np.tour.completed.${tourId}`;
}

function storageKeyForProgress(tourId: TourId) {
  return `np.tour.progress.${tourId}`;
}

function storageKeyForPaused(tourId: TourId) {
  return `np.tour.paused.${tourId}`;
}

const STORAGE_KEY_ONBOARDING_DISABLED = 'np.tour.disabled';

function getDriverActiveIndex(instance: unknown): number | undefined {
  if (!instance || typeof instance !== 'object') return undefined;

  const typed = instance as {
    getActiveIndex?: () => number;
    state?: { activeIndex?: number };
  };

  if (typeof typed.getActiveIndex === 'function') {
    const value = typed.getActiveIndex();
    return Number.isFinite(value) ? value : undefined;
  }

  const fromState = typed.state?.activeIndex;
  return typeof fromState === 'number' && Number.isFinite(fromState)
    ? fromState
    : undefined;
}

function getStickyHeaderHeight(): number {
  if (typeof document === 'undefined') return 0;

  const stickyHeader =
    (document.querySelector('header.sticky') as HTMLElement | null) ??
    (document.querySelector('header') as HTMLElement | null);
  if (!stickyHeader) return 0;

  const rect = stickyHeader.getBoundingClientRect();
  const height = Math.max(0, rect.height);
  return Number.isFinite(height) ? height : 0;
}

function scrollTargetIntoView(
  target: Element,
  opts?: { preferBottom?: boolean },
): boolean {
  if (typeof window === 'undefined') return false;
  if (!(target instanceof HTMLElement)) return false;

  const rect = target.getBoundingClientRect();
  const headerHeight = getStickyHeaderHeight();
  const topSafe = headerHeight + 16;
  const bottomSafe = window.innerHeight - 16;

  // If already fully visible, do nothing
  if (rect.top >= topSafe && rect.bottom <= bottomSafe) return false;

  // For save-changes step, prefer scrolling so button is visible near bottom but with space
  if (opts?.preferBottom) {
    const absoluteBottom = window.scrollY + rect.bottom;
    // Position it ~15% from bottom to ensure popover has space above/left
    const targetBlock = window.innerHeight * 0.85;
    const nextTop = Math.max(0, absoluteBottom - targetBlock);
    window.scrollTo({ top: nextTop, behavior: 'smooth' });
    return true;
  }

  // Default: scroll so element is comfortably below header
  const absoluteTop = window.scrollY + rect.top;
  const nextTop = Math.max(0, absoluteTop - topSafe);
  window.scrollTo({ top: nextTop, behavior: 'smooth' });
  return true;
}

function buildTourSteps(tourId: TourId): DriveStep[] {
  if (tourId === 'logged-in:nav') {
    return [
      {
        element: 'body',
        popover: {
          title: 'Quick tour',
          description:
            'This walkthrough highlights the main navigation. You can re-run it anytime from the Help button.',
          side: 'over',
          align: 'center',
        },
      },
      {
        element: '[data-tour="hub-selector"]',
        popover: {
          title: 'Switch hubs',
          description:
            'Use this selector to jump between Planner, Collections, and User hubs.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '[data-tour="hub-tabs"]',
        popover: {
          title: 'Hub tabs',
          description:
            "These tabs are your current hub's shortcuts. Try switching tabs to explore features.",
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '[data-tour="hub-shell"]',
        popover: {
          title: 'Your workspace',
          description:
            'Each hub page uses a consistent layout. Actions usually live at the top; the main content is inside this card.',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '[data-tour="user-menu"]',
        popover: {
          title: 'Account menu',
          description: 'Manage your profile, settings, and log out from here.',
          side: 'bottom',
          align: 'end',
        },
      },
    ];
  }

  // guest:landing
  return [
    {
      element: 'body',
      popover: {
        title: 'Welcome to NutriPlan',
        description:
          'This is the public landing experience. Scroll to explore and try the meal plan builder.',
        side: 'over',
        align: 'center',
      },
    },
    {
      element: '[data-tour="landing-mealplan"]',
      popover: {
        title: 'Try the meal plan builder',
        description:
          'Set your calories and targets, then generate a plan. This section is available without signing in.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '[data-tour="landing-fresh-meals"]',
      popover: {
        title: 'Fresh meals & collections',
        description:
          "Browse curated ideas here. If you're not signed in, we'll route you to login for the full library.",
        side: 'top',
        align: 'center',
      },
    },
  ];
}

function filterExistingTargets(steps: DriveStep[]) {
  return steps.filter((step) => {
    if (!step.element) return true;
    if (typeof step.element === 'string') {
      // driver.js supports "body" and other selectors. Keep if it resolves.
      return Boolean(document.querySelector(step.element));
    }
    if (typeof step.element === 'function') {
      try {
        return Boolean(step.element());
      } catch {
        return false;
      }
    }
    return true;
  });
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const layoutKey = useMemo(() => getLayoutKey(pathname), [pathname]);
  const { canGenerate } = useMealPlanSetupStatus();
  const { data: primaryDietData } = useGetPrimaryDietQuery(undefined, {
    skip: layoutKey !== 'logged-in',
  });

  const hasPrimaryDiet =
    typeof primaryDietData?.data === 'string'
      ? primaryDietData.data.trim() !== ''
      : Boolean(primaryDietData?.data);

  const canDisableOnboarding = canGenerate && hasPrimaryDiet;

  const [isRunning, setIsRunning] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [activeTourId, setActiveTourId] = useState<TourId | null>(null);
  const [launcherView, setLauncherView] = useState<'help' | 'chat'>('help');
  const [askDraft, setAskDraft] = useState('');
  const [chatResetNonce, setChatResetNonce] = useState(0);
  const [chatSendNonce, setChatSendNonce] = useState(0);
  const [chatSendMessage, setChatSendMessage] = useState<string | null>(null);

  const quickQuestions = useMemo(
    () => [
      'Change my today breakfast meal plan to other meals.',
      'Cách để tạo thực đơn trong ngày',
      'Giới thiệu cho tôi các món trứng trong hệ thống mà có calories < 400.',
    ],
    [],
  );

  const driverRef = useRef<Driver | null>(null);
  const waitingForNutritionSaveRef = useRef(false);
  const canGenerateRef = useRef(canGenerate);
  const hasPrimaryDietRef = useRef(hasPrimaryDiet);

  useEffect(() => {
    canGenerateRef.current = canGenerate;
  }, [canGenerate]);

  useEffect(() => {
    hasPrimaryDietRef.current = hasPrimaryDiet;
  }, [hasPrimaryDiet]);

  useEffect(() => {
    try {
      setIsDisabled(
        localStorage.getItem(STORAGE_KEY_ONBOARDING_DISABLED) === '1',
      );
    } catch {
      setIsDisabled(false);
    }
  }, []);

  useEffect(() => {
    if (!isLauncherOpen) {
      setLauncherView('help');
      setAskDraft('');
    }
  }, [isLauncherOpen]);

  const tourOptions = useMemo<TourOption[]>(() => {
    if (layoutKey === 'logged-in') {
      const opts: TourOption[] = [
        {
          id: 'logged-in:setup-required',
          title: 'Setup required (guided)',
          description:
            'Mandatory onboarding when setup is incomplete (Primary Diet + Body & Goal + Nutrition Targets).',
        },
      ];

      opts.push({
        id: 'logged-in:nav',
        title: 'Navigation tour',
        description: 'Hubs, tabs, and your account menu.',
      });

      return opts;
    }

    if (layoutKey === 'guest' && pathname === PATH.HOME) {
      return [
        {
          id: 'guest:landing',
          title: 'Landing tour',
          description: 'What you can try without signing in.',
        },
      ];
    }

    return [];
  }, [layoutKey, pathname]);

  const stopTour = useCallback(() => {
    driverRef.current?.destroy();
    driverRef.current = null;
    setIsRunning(false);
  }, []);

  const openChatWithMessage = useCallback(
    (message: string) => {
      const trimmed = message.trim();
      if (!trimmed) return;
      stopTour();
      setLauncherView('chat');
      setChatSendMessage(trimmed);
      setChatSendNonce((v) => v + 1);
    },
    [stopTour],
  );

  const openChatOnly = useCallback(() => {
    stopTour();
    setLauncherView('chat');
    setChatSendMessage(null);
  }, [stopTour]);

  const enableOnboarding = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_ONBOARDING_DISABLED);
    } catch {
      // ignore
    }
    setIsDisabled(false);
  }, []);

  const disableOnboarding = useCallback(() => {
    // Only allow permanently disabling prompts once setup is complete.
    if (!canDisableOnboarding) return;
    try {
      localStorage.setItem(STORAGE_KEY_ONBOARDING_DISABLED, '1');
    } catch {
      // ignore
    }
    setIsDisabled(true);
  }, [canDisableOnboarding]);

  const buildSetupRequiredSteps = useCallback((): DriveStep[] => {
    const moveNext = () => {
      const current = driverRef.current as unknown as {
        moveNext?: () => void;
      };
      current?.moveNext?.();
    };

    const requirePath = (expected: string | string[], message: string) => {
      const matches = Array.isArray(expected)
        ? expected.includes(pathname)
        : pathname === expected;

      if (!matches) {
        showToastError(message);
        return false;
      }

      return true;
    };

    return [
      {
        element: 'body',
        popover: {
          title: 'Setup required',
          description:
            'Complete the setup to unlock meal generation. The tour will guide you step-by-step.',
          side: 'over',
          align: 'center',
        },
      },
      {
        element: '[data-tour="hub-selector"]',
        popover: {
          title: 'Open hub selector',
          description:
            'Click the hub selector to expand the hub list. The tour will continue automatically once it opens.',
          side: 'right',
          align: 'center',
          showButtons: ['close'],
        },
      },
      {
        element: '[data-tour="hub-selector-option-user"]',
        popover: {
          title: 'Select User Hub',
          description: 'Click User Hub to continue.',
          side: 'bottom',
          align: 'end',
          showButtons: ['close'],
        },
      },
      {
        element: '[data-tour="hub-tab-food-exclusions"]',
        popover: {
          title: 'Open Food Exclusions',
          description:
            'Click the Food Exclusions tab. We will set Primary Diet there first.',
          side: 'bottom',
          align: 'center',
          nextBtnText: 'Next',
          onNextClick: () => {
            if (
              !requirePath(
                PATH.FOOD_EXCLUSIONS,
                'Open the Food Exclusions tab to continue.',
              )
            ) {
              return;
            }
            moveNext();
          },
        },
      },
      {
        element: '[data-tour="userhub-primary-diet-card"]',
        popover: {
          title: 'Primary Diet',
          description:
            'Pick the diet style you follow most often. This helps tailor exclusions and meal suggestions.',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '[data-tour="userhub-primary-diet-picker"]',
        popover: {
          title: 'Choose a diet to continue',
          description:
            'Select one option (Anything/Keto/Mediterranean/...). Next is locked until you choose.',
          side: 'left',
          align: 'center',
          onNextClick: () => {
            if (!hasPrimaryDietRef.current) {
              showToastError('Please select a Primary Diet to continue.');
              return;
            }
            moveNext();
          },
          nextBtnText: 'Next',
        },
      },
      {
        element: '[data-tour="hub-tab-physical-stats"]',
        popover: {
          title: 'Open Body & Goal',
          description:
            'Click the Body & Goal tab to update your body profile and goals.',
          side: 'bottom',
          align: 'center',
          nextBtnText: 'Next',
          onNextClick: () => {
            if (
              !requirePath(
                PATH.PHYSICAL_STATS,
                'Open the Body & Goal tab to continue.',
              )
            ) {
              return;
            }
            moveNext();
          },
        },
      },
      {
        element: '[data-tour="userhub-physical-stats-card"]',
        popover: {
          title: 'Body & Goal — Physical Stats',
          description:
            'Fill your sex, height, birthday, body fat, and activity level. These affect your baseline needs.',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '[data-tour="userhub-weight-goal-card"]',
        popover: {
          title: 'Today’s check-in',
          description:
            'Update weight and goal type. Keeping this updated improves recommendations.',
          side: 'left',
          align: 'center',
        },
      },
      {
        element: '[data-tour="userhub-save-changes-container"]',
        popover: {
          title: 'Save Body & Goal',
          description:
            'Click “Save changes” first to store your updated stats/weight/goal. The tour will continue automatically once saved.',
          side: 'top',
          align: 'end',
          showButtons: ['close'],
        },
      },
      {
        element: '[data-tour="userhub-update-targets-button"]',
        popover: {
          title: 'Open update targets popup',
          description:
            'Now click this button to open the suggested Nutrition Targets popup. The tour will continue automatically once it opens.',
          side: 'bottom',
          align: 'center',
          showButtons: ['close'],
        },
      },
      {
        element: '[data-tour="nutrition-targets-modal-save"]',
        popover: {
          title: 'Save suggested targets',
          description:
            'Click “Save” in the popup to apply the updated targets. The tour will continue automatically after the update completes.',
          side: 'top',
          align: 'center',
          showButtons: ['close'],
        },
      },
      {
        element: 'body',
        popover: {
          title: 'Setup complete',
          description:
            'You can now generate meals. The planner tour is available anytime from Help & Tours.',
          side: 'over',
          align: 'center',
        },
      },
    ];
  }, [pathname]);

  const startTour = useCallback(
    (tourId: TourId, options?: { mode?: 'restart' | 'resume' }) => {
      if (layoutKey === 'auth' || layoutKey === 'admin') return;

      setIsLauncherOpen(false);

      if (options?.mode === 'restart') {
        try {
          localStorage.removeItem(storageKeyForProgress(tourId));
          localStorage.removeItem(storageKeyForPaused(tourId));
        } catch {
          // ignore
        }
      }

      const stepsRaw =
        tourId === 'logged-in:setup-required'
          ? buildSetupRequiredSteps()
          : buildTourSteps(tourId);
      const steps =
        tourId === 'logged-in:setup-required'
          ? stepsRaw
          : filterExistingTargets(stepsRaw);
      if (steps.length === 0) return;

      const readProgressIndex = () => {
        try {
          const raw = localStorage.getItem(storageKeyForProgress(tourId));
          const parsed = raw ? Number(raw) : 0;
          return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
        } catch {
          return 0;
        }
      };

      const startIndexRaw =
        options?.mode === 'resume' ? readProgressIndex() : 0;
      const startIndex = Math.min(Math.max(0, startIndexRaw), steps.length - 1);

      // Compute a smarter start index: skip any steps that are already satisfied
      // so the tour doesn't flash through them. This handles hub selector/menu,
      // the User Hub selection, primary diet and nutrition-targets completion.
      const computeFirstIncompleteIndex = (s: DriveStep[]) => {
        const userHubRoutes = [
          PATH.PHYSICAL_STATS,
          PATH.FOOD_EXCLUSIONS,
          PATH.ACCOUNT,
        ] as string[];

        for (let i = 0; i < s.length; i++) {
          const step = s[i];
          const el =
            typeof step.element === 'string' ? step.element : undefined;

          if (!el) return i;

          // If user already on any User Hub route, skip hub selector + user hub option
          if (
            (el === '[data-tour="hub-selector"]' ||
              el === '[data-tour="hub-selector-option-user"]') &&
            userHubRoutes.includes(pathname)
          ) {
            continue;
          }

          // If hub menu is already open, skip the hub-selector step
          if (el === '[data-tour="hub-selector"]') {
            if (document.querySelector('[data-tour="hub-selector-menu"]')) {
              continue;
            }
            return i;
          }

          if (
            el === '[data-tour="hub-selector-option-user"]' &&
            userHubRoutes.includes(pathname)
          ) {
            continue;
          }

          // Primary Diet already chosen -> skip related steps
          if (
            el === '[data-tour="userhub-primary-diet-picker"]' ||
            el === '[data-tour="userhub-primary-diet-card"]'
          ) {
            if (hasPrimaryDietRef.current) continue;
            return i;
          }

          // Nutrition targets already saved -> skip submit step
          if (el === '[data-tour="nutrition-targets-submit"]') {
            if (canGenerateRef.current) continue;
            return i;
          }

          // If this step is route-specific, and the current pathname already
          // matches the expected route, skip. We detect some common cases.
          if (
            el === '[data-tour="hub-tabs"]' ||
            el.startsWith('[data-tour="hub-tab-')
          ) {
            // If the active route is one of the hub tab routes, we consider
            // tab-navigation steps satisfied for the current pathname.
            const hubTabRoutes = [
              PATH.FOOD_EXCLUSIONS,
              PATH.PHYSICAL_STATS,
              PATH.NUTRITION_TARGETS,
              PATH.MEAL_PLAN,
            ] as string[];
            if (hubTabRoutes.includes(pathname)) continue;
            return i;
          }

          // For other steps where we can't reliably determine completion,
          // stop at the first unknown step so the tour shows normally.
          return i;
        }

        return 0;
      };

      const computedStart = computeFirstIncompleteIndex(steps);
      const finalStartIndex = Math.min(startIndex, Math.max(0, computedStart));

      // Tear down a previous instance if needed.
      driverRef.current?.destroy();

      const instance = driver({
        steps,
        animate: false,
        smoothScroll: false,
        allowClose: true,
        overlayOpacity: 0.55,
        stagePadding: 8,
        stageRadius: 18,
        popoverClass: 'np-tour-popover',
        showProgress: true,
        nextBtnText: 'Next',
        prevBtnText: 'Back',
        doneBtnText: 'Done',
        onHighlightStarted: (element, step, opts) => {
          if (!element) return;

          // Special case: Scroll to top for update targets button
          if (step.element === '[data-tour="userhub-update-targets-button"]') {
            window.scrollTo({ top: 0, behavior: 'auto' });
            window.setTimeout(() => {
              try {
                opts.driver.refresh();
              } catch {
                // ignore
              }
            }, 350);
            return;
          }

          // Pokud to step save-changes th scroll e nt nm v v tr th ch hp
          const isSaveChanges =
            step.element === '[data-tour="userhub-save-changes-container"]' ||
            (element instanceof HTMLElement &&
              element.dataset.tour === 'userhub-save-changes-container');
          const didScroll = scrollTargetIntoView(element, {
            preferBottom: isSaveChanges,
          });
          if (didScroll) {
            // Wait for smooth scroll
            window.setTimeout(
              () => {
                try {
                  opts.driver.refresh();
                } catch {
                  // ignore
                }
              },
              isSaveChanges ? 350 : 100,
            );
          }
        },
        onDestroyStarted: () => {
          try {
            const current = driverRef.current as unknown;
            const activeIndex = getDriverActiveIndex(current);

            const lastIndex = steps.length - 1;
            const safeIndex = typeof activeIndex === 'number' ? activeIndex : 0;

            if (safeIndex >= lastIndex) {
              localStorage.setItem(storageKeyForCompleted(tourId), '1');
              localStorage.removeItem(storageKeyForProgress(tourId));
              localStorage.removeItem(storageKeyForPaused(tourId));
            } else {
              localStorage.setItem(
                storageKeyForProgress(tourId),
                String(safeIndex),
              );
              localStorage.setItem(storageKeyForPaused(tourId), '1');
            }
          } catch {
            // ignore
          }
        },
        onDestroyed: () => {
          setIsRunning(false);
        },
      });
      driverRef.current = instance;
      setIsRunning(true);
      setActiveTourId(tourId);
      instance.drive(finalStartIndex);
    },
    [buildSetupRequiredSteps, layoutKey, pathname],
  );

  // Auto-start the mandatory setup tour when setup is incomplete.
  // DISABLED: Tour now only starts when user explicitly selects it from the Help menu.
  // useEffect(() => {
  //   if (layoutKey !== 'logged-in') return;
  //   if (isRunning) return;
  //   // Respect user preference: do not auto-start if onboarding is disabled
  //   if (isDisabled) return;
  //   if (setupAutoStartedRef.current) return;

  //   const needsSetup = !canGenerate || !hasPrimaryDiet;
  //   if (!needsSetup) return;

  //   setupAutoStartedRef.current = true;
  //   startTour('logged-in:setup-required', { mode: 'restart' });
  // }, [canGenerate, hasPrimaryDiet, isRunning, layoutKey, pathname, startTour]);

  // Cleanup if layout changes underneath a running tour.
  useEffect(() => {
    if (layoutKey === 'auth' || layoutKey === 'admin') {
      stopTour();
    }
  }, [layoutKey, stopTour]);

  useEffect(() => {
    if (!isRunning || activeTourId !== 'logged-in:setup-required') return;

    const checkpoints = new Map<number, string | string[]>([
      [1, [PATH.PHYSICAL_STATS, PATH.FOOD_EXCLUSIONS, PATH.ACCOUNT]],
      [3, PATH.FOOD_EXCLUSIONS],
      [6, PATH.PHYSICAL_STATS],
    ]);
    const interval = window.setInterval(() => {
      const instance = driverRef.current as unknown;
      const activeIndex = getDriverActiveIndex(instance);
      if (typeof activeIndex !== 'number') return;

      const expected = checkpoints.get(activeIndex);
      if (!expected) return;

      let matches = Array.isArray(expected)
        ? expected.includes(pathname)
        : pathname === expected;

      if (!matches) return;

      const api = instance as { moveNext?: () => void };
      api.moveNext?.();
    }, 250);

    return () => window.clearInterval(interval);
  }, [activeTourId, isRunning, pathname]);

  // Setup-required flow: wait for the user to save Body & Goal before
  // allowing the tour to proceed to the targets popup.
  useEffect(() => {
    if (!isRunning || activeTourId !== 'logged-in:setup-required') return;

    const onBodyGoalSaved = () => {
      const activeIndex = getDriverActiveIndex(driverRef.current as unknown);
      if (activeIndex !== 9) return;

      // Scroll to top to ensure the next step (Update Targets) is shown with page at top
      window.scrollTo({ top: 0, behavior: 'auto' });

      const api = driverRef.current as unknown as { moveNext?: () => void };
      api.moveNext?.();
    };

    window.addEventListener('np:body-goal-saved', onBodyGoalSaved);
    return () =>
      window.removeEventListener('np:body-goal-saved', onBodyGoalSaved);
  }, [activeTourId, isRunning]);

  // Setup-required flow: when the suggested targets modal is opened, advance.
  useEffect(() => {
    if (!isRunning || activeTourId !== 'logged-in:setup-required') return;

    const onOpened = () => {
      const activeIndex = getDriverActiveIndex(driverRef.current as unknown);
      if (activeIndex !== 10) return;
      const api = driverRef.current as unknown as { moveNext?: () => void };
      api.moveNext?.();
    };

    window.addEventListener('np:nutrition-targets-modal-opened', onOpened);
    return () =>
      window.removeEventListener('np:nutrition-targets-modal-opened', onOpened);
  }, [activeTourId, isRunning]);

  // Setup-required flow: when the modal save completes (targets saved), advance.
  useEffect(() => {
    if (!isRunning || activeTourId !== 'logged-in:setup-required') return;

    const onSaved = () => {
      const activeIndex = getDriverActiveIndex(driverRef.current as unknown);
      if (activeIndex !== 11) return;
      const api = driverRef.current as unknown as { moveNext?: () => void };
      api.moveNext?.();
    };

    window.addEventListener('np:nutrition-targets-saved', onSaved);
    return () =>
      window.removeEventListener('np:nutrition-targets-saved', onSaved);
  }, [activeTourId, isRunning]);

  // Wait for the nutrition-targets save event when we opened the popup from
  // the tour. The tour's onNextClick will set waitingForNutritionSaveRef to
  // true and dispatch 'np:open-nutrition-targets'. When the UI fires
  // 'np:nutrition-targets-saved' we advance the tour.
  useEffect(() => {
    if (!isRunning) return;

    const onSaved = () => {
      if (!waitingForNutritionSaveRef.current) return;
      const api = driverRef.current as unknown as { moveNext?: () => void };
      api.moveNext?.();
      waitingForNutritionSaveRef.current = false;
    };

    window.addEventListener('np:nutrition-targets-saved', onSaved);
    return () =>
      window.removeEventListener('np:nutrition-targets-saved', onSaved);
  }, [isRunning]);

  // When the tour requests the nutrition-targets popup to open, temporarily
  // hide the driver overlay/popover so the modal Save button is clickable.
  useEffect(() => {
    if (!isRunning) return;

    const onOpen = () => {
      // Mark that we're waiting and hide the tour UI
      waitingForNutritionSaveRef.current = true;
      try {
        document.body.classList.add('np-tour-modal-open');
      } catch {
        // ignore
      }
    };

    const onSaved = () => {
      try {
        document.body.classList.remove('np-tour-modal-open');
      } catch {
        // ignore
      }
      if (!waitingForNutritionSaveRef.current) return;
      const api = driverRef.current as unknown as { moveNext?: () => void };
      api.moveNext?.();
      waitingForNutritionSaveRef.current = false;
    };

    window.addEventListener('np:open-nutrition-targets', onOpen);
    window.addEventListener('np:nutrition-targets-saved', onSaved);
    return () => {
      window.removeEventListener('np:open-nutrition-targets', onOpen);
      window.removeEventListener('np:nutrition-targets-saved', onSaved);
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || activeTourId !== 'logged-in:setup-required') return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const activeIndex = getDriverActiveIndex(driverRef.current as unknown);
      if (typeof activeIndex !== 'number') return;

      const api = driverRef.current as unknown as { moveNext?: () => void };
      if (!api?.moveNext) return;

      if (
        activeIndex === 2 &&
        target.closest('[data-tour="hub-selector-option-user"]')
      ) {
        api.moveNext();
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [activeTourId, isRunning]);

  useEffect(() => {
    if (!isRunning || activeTourId !== 'logged-in:setup-required') return;

    const handleMenuOpened = () => {
      const activeIndex = getDriverActiveIndex(driverRef.current as unknown);
      if (activeIndex !== 1) return;
      const api = driverRef.current as unknown as { moveNext?: () => void };
      api.moveNext?.();
    };

    window.addEventListener('np:hub-menu-opened', handleMenuOpened);
    return () =>
      window.removeEventListener('np:hub-menu-opened', handleMenuOpened);
  }, [activeTourId, isRunning]);

  useEffect(() => {
    if (!isRunning || activeTourId !== 'logged-in:setup-required') return;

    const handleHubSelected = (event: Event) => {
      const detail = (event as CustomEvent<{ hub?: string }>).detail;
      if (detail?.hub !== 'user') return;

      const activeIndex = getDriverActiveIndex(driverRef.current as unknown);
      if (activeIndex !== 2) return;

      const api = driverRef.current as unknown as { moveNext?: () => void };
      api.moveNext?.();
    };

    window.addEventListener('np:hub-selected', handleHubSelected);
    return () =>
      window.removeEventListener('np:hub-selected', handleHubSelected);
  }, [activeTourId, isRunning]);

  // Close launcher on navigation changes.
  useEffect(() => {
    setIsLauncherOpen(false);
  }, [pathname]);

  const value = useMemo<TourContextValue>(
    () => ({
      startTour,
      stopTour,
      isRunning,
      isDisabled,
      disableOnboarding,
      enableOnboarding,
    }),
    [
      disableOnboarding,
      enableOnboarding,
      isDisabled,
      isRunning,
      startTour,
      stopTour,
    ],
  );

  const shouldShowLauncher = layoutKey === 'guest' || layoutKey === 'logged-in';
  const isChatView = launcherView === 'chat';

  return (
    <TourContext.Provider value={value}>
      {children}

      {shouldShowLauncher && (
        <div className='pointer-events-auto fixed right-5 bottom-5 z-[10050]'>
          <div className='relative'>
            <button
              type='button'
              data-tour='launcher-button'
              aria-label='Help and tours'
              onClick={() => setIsLauncherOpen((prev) => !prev)}
              className={cn(
                'inline-flex cursor-pointer items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-sm',
                'text-sm font-semibold text-gray-900',
                isRunning && 'opacity-70',
              )}
            >
              <span className='flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700'>
                <PiQuestionBold className='h-4 w-4' />
              </span>
              <span>Help Center</span>
            </button>

            {isLauncherOpen && (
              <div
                data-tour='launcher-menu'
                className={cn(
                  'pointer-events-auto absolute right-0 bottom-full mb-3 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg',
                  'h-[620px] max-h-[80vh] min-h-[540px]',
                )}
              >
                <div className='relative px-5 pt-5 pb-4'>
                  <button
                    type='button'
                    onClick={() => setIsLauncherOpen(false)}
                    aria-label='Close'
                    className='absolute top-4 right-4 rounded-full p-2 text-gray-600 hover:bg-gray-100'
                  >
                    <FaTimes />
                  </button>

                  <div className='flex items-start justify-between gap-3 pr-10'>
                    <div className='min-w-0'>
                      <div className='text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase'>
                        Help center
                      </div>
                      <AnimatePresence mode='wait'>
                        <motion.div
                          key={launcherView}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                        >
                          <div className='mt-1 text-base font-semibold text-gray-900'>
                            {isChatView ? 'NutriBot' : 'Guides'}
                          </div>
                          <p className='mt-1 text-xs text-gray-600'>
                            {isChatView
                              ? 'Ask questions and get nutrition help.'
                              : 'Pick a tour to learn by doing.'}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className='relative inline-flex'>
                      <div className='flex items-center rounded-full bg-gray-100 p-1'>
                        <button
                          type='button'
                          onClick={() => setLauncherView('help')}
                          className={cn(
                            'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                            !isChatView
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900',
                          )}
                        >
                          Guide
                        </button>
                        <button
                          type='button'
                          onClick={openChatOnly}
                          className={cn(
                            'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                            isChatView
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900',
                          )}
                        >
                          Chatbot
                        </button>
                      </div>

                      <AnimatePresence>
                        {isChatView && (
                          <motion.button
                            type='button'
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                            onClick={() => {
                              setChatSendMessage(null);
                              setChatResetNonce((v) => v + 1);
                            }}
                            className={cn(
                              'absolute top-full right-0 mt-2',
                              'inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold whitespace-nowrap',
                              'text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 hover:ring-gray-300',
                            )}
                          >
                            <FaPlus className='h-3.5 w-3.5 text-emerald-700' />
                            New chat
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className='h-px bg-gray-100' />

                <div className='flex min-h-0 flex-1 flex-col'>
                  <div className='min-h-0 flex-1'>
                    <AnimatePresence mode='wait'>
                      {isChatView ? (
                        <motion.div
                          key='chat'
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className='flex h-full min-h-0 flex-col pt-10'
                        >
                          <div className='min-h-0 flex-1 overflow-hidden'>
                            <MealPlanChatbot
                              embedded
                              headerless
                              hideComposer
                              resetNonce={chatResetNonce}
                              externalMessage={chatSendMessage}
                              sendNonce={chatSendNonce}
                            />
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key='help'
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className='flex h-full min-h-0 flex-col'
                        >
                          <div className='min-h-0 flex-1 overflow-auto p-2'>
                            {tourOptions.length === 0 ? (
                              <div className='rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center'>
                                <div className='text-sm font-semibold text-gray-800'>
                                  No tours available here
                                </div>
                                <div className='mt-1 text-xs text-gray-500'>
                                  Navigate to a supported page and try again.
                                </div>
                              </div>
                            ) : (
                              <div className='space-y-2'>
                                {tourOptions.map((option) => {
                                  let isCompleted = false;
                                  let isPaused = false;
                                  try {
                                    isCompleted =
                                      localStorage.getItem(
                                        storageKeyForCompleted(option.id),
                                      ) === '1';
                                    isPaused =
                                      localStorage.getItem(
                                        storageKeyForPaused(option.id),
                                      ) === '1';
                                  } catch {
                                    // ignore
                                  }

                                  return (
                                    <button
                                      key={option.id}
                                      type='button'
                                      onClick={() => {
                                        setIsLauncherOpen(false);
                                        startTour(option.id, {
                                          mode: 'restart',
                                        });
                                      }}
                                      className='w-full rounded-2xl border border-gray-100 px-4 py-3 text-left'
                                    >
                                      <div className='flex items-center justify-between gap-3'>
                                        <span className='text-sm font-semibold text-gray-900'>
                                          {option.title}
                                        </span>
                                        {isCompleted ? (
                                          <span className='rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700'>
                                            Completed
                                          </span>
                                        ) : isPaused ? (
                                          <span className='rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800'>
                                            Restart
                                          </span>
                                        ) : (
                                          <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700'>
                                            Start
                                          </span>
                                        )}
                                      </div>
                                      <p className='mt-1 text-xs text-gray-600'>
                                        {option.description}
                                      </p>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <div className='border-t border-gray-100 px-4 py-3'>
                            <div className='rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3'>
                              <div className='text-[11px] font-semibold tracking-[0.18em] text-emerald-800 uppercase'>
                                Quick questions
                              </div>
                              <div className='mt-2 flex flex-wrap gap-2'>
                                {quickQuestions.map((question) => (
                                  <button
                                    key={question}
                                    type='button'
                                    onClick={() =>
                                      openChatWithMessage(question)
                                    }
                                    className={cn(
                                      'rounded-full bg-white px-3 py-1.5 text-left text-xs font-semibold text-emerald-900 shadow-sm ring-1 ring-emerald-200',
                                      'hover:bg-emerald-50 hover:ring-emerald-300',
                                    )}
                                  >
                                    {question}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className='border-t border-gray-100 px-4 py-3'>
                    <div className='flex items-end gap-2'>
                      <textarea
                        rows={2}
                        value={askDraft}
                        onChange={(e) => setAskDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            openChatWithMessage(askDraft);
                            setAskDraft('');
                          }
                        }}
                        className='flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none'
                        placeholder='Ask NutriBot...'
                      />
                      <button
                        className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400'
                        type='button'
                        aria-label='Send'
                        disabled={!askDraft.trim()}
                        onClick={() => {
                          openChatWithMessage(askDraft);
                          setAskDraft('');
                        }}
                      >
                        <FaPaperPlane />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Onboarding section removed per request */}
              </div>
            )}
          </div>
        </div>
      )}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return ctx;
}
