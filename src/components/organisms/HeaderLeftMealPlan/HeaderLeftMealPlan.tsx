import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FaAngleLeft,
  FaAngleRight,
  FaGripVertical,
  FaRegWindowRestore,
  FaSearch,
  FaThumbtack,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { motion } from 'motion/react';

import { DateDisplay } from '@/atoms/DateDisplay';
import { DropdownMenu } from '@/atoms/DropdownMenu';
import { RemoveDropzone } from '@/atoms/RemoveDropzone';
import { PLAN_MENU_ITEMS } from '@/constants/plans';
import { PLAN_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { cn } from '@/helpers/helpers';
import { NavigationButtons } from '@/molecules/NavigationButtons';
import PantrySuggestionsDock from '@/molecules/PantrySuggestionsDock/PantrySuggestionsDock';
import { SideAddFood } from '@/molecules/SideAddFood';
import { mealPlanSelector, setIsDockExpanded } from '@/redux/slices/mealPlan';
import { shiftDate, shiftRange } from '@/utils/dateUtils';

const DOCK_FOOD_DRAG_EVENT = 'nutriplan:dock-food-drag';

const HeaderLeftMealPlan: React.FC = () => {
  const {
    rangeDate,
    selectedDate,
    selectedPlan,
    setRangeDate,
    setSelectedDate,
    setSelectedPlan,
  } = useDate();
  const dispatch = useDispatch();
  const { isDragging, isDockExpanded: isDockExpandedRedux } =
    useSelector(mealPlanSelector);
  const dockDragPrevExpandedRef = useRef<boolean>(false);
  const dockDragAutoCollapsedRef = useRef<boolean>(false);
  const dockActiveDragCountRef = useRef<number>(0);
  const prevIsDraggingRef = useRef<boolean>(false);

  useEffect(() => {
    if (isDockExpandedRedux) {
      setIsExpanded(true);
      // Reset redux state to avoid it being stuck true?
      // Or keep it true? If we keep it true, user closing it locally will cause desync.
      // Better to treat Redux as "trigger" or keep fully synced.
      // For now, let's just use it as a trigger.
    }
  }, [isDockExpandedRedux]);

  const storageKey = useMemo(() => 'mealPlanDock.v1', []);
  const dockRef = useRef<HTMLDivElement | null>(null);
  const dragOffsetRef = useRef<{ dx: number; dy: number } | null>(null);

  const [position, setPosition] = useState<{ x: number; y: number }>(() => ({
    x: 16,
    y: 16,
  }));
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isExpandedRef = useRef<boolean>(false);
  const [dockMode, setDockMode] = useState<
    'floating' | 'pin-left' | 'pin-right'
  >('floating');
  const [sheenKey, setSheenKey] = useState<number>(0);

  const COMPACT_WIDTH = 72;
  const PANEL_WIDTH = 360;
  const PANEL_GAP = 8;
  const RESERVED_MARGIN = 16;
  const PINNED_SIDEBAR_WIDTH = 332;
  const FLOATING_PANEL_MAX_HEIGHT = 520;
  const PINNED_SIDEBAR_TOP = 96;

  const getMinDockTop = useCallback(() => {
    // Prevent dragging the dock under the sticky app header.
    // The app header uses <header className="sticky top-0 ...">.
    const header = document.querySelector('header');
    const margin = 8;
    if (!header) return margin;
    const rect = header.getBoundingClientRect();
    return Math.max(margin, rect.bottom + margin);
  }, []);

  const clampToViewport = useCallback(
    (next: { x: number; y: number }) => {
      const el = dockRef.current;
      if (!el) return next;

      const rect = el.getBoundingClientRect();
      const margin = 8;
      const minY = getMinDockTop();
      const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
      const maxY = Math.max(minY, window.innerHeight - rect.height - margin);

      return {
        x: Math.min(Math.max(next.x, margin), maxX),
        y: Math.min(Math.max(next.y, minY), maxY),
      };
    },
    [dockRef, getMinDockTop],
  );

  useEffect(() => {
    // Clamp any persisted position (from localStorage) to the current viewport/header.
    setPosition((prev) => clampToViewport(prev));
  }, [clampToViewport]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        position?: { x: number; y: number };
        isExpanded?: boolean;
        dockMode?: 'floating' | 'pin-left' | 'pin-right';
      };

      if (parsed.position) setPosition(parsed.position);
      if (typeof parsed.isExpanded === 'boolean') {
        setIsExpanded(parsed.isExpanded);
      }
      if (
        parsed.dockMode === 'floating' ||
        parsed.dockMode === 'pin-left' ||
        parsed.dockMode === 'pin-right'
      ) {
        setDockMode(parsed.dockMode);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  useEffect(() => {
    const onResize = () => setPosition((prev) => clampToViewport(prev));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [clampToViewport]);

  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  const beginTemporaryCollapse = useCallback(() => {
    if (dockMode !== 'floating') return;

    if (dockActiveDragCountRef.current === 0) {
      dockDragPrevExpandedRef.current = isExpandedRef.current;
      if (isExpandedRef.current) {
        dockDragAutoCollapsedRef.current = true;
        setIsExpanded(false);
      }
    }

    dockActiveDragCountRef.current += 1;
  }, [dockMode]);

  const endTemporaryCollapse = useCallback(() => {
    if (dockMode !== 'floating') return;

    dockActiveDragCountRef.current = Math.max(
      0,
      dockActiveDragCountRef.current - 1,
    );

    if (
      dockActiveDragCountRef.current === 0 &&
      dockDragAutoCollapsedRef.current
    ) {
      dockDragAutoCollapsedRef.current = false;
      setIsExpanded(dockDragPrevExpandedRef.current);
    }
  }, [dockMode]);

  useEffect(() => {
    const onDockFoodDrag = (event: Event) => {
      const detail = (event as CustomEvent).detail as
        | { isDragging?: boolean }
        | undefined;

      const nextDragging = detail?.isDragging === true;
      if (nextDragging) {
        beginTemporaryCollapse();
      } else {
        endTemporaryCollapse();
      }
    };

    window.addEventListener(DOCK_FOOD_DRAG_EVENT, onDockFoodDrag);
    return () =>
      window.removeEventListener(DOCK_FOOD_DRAG_EVENT, onDockFoodDrag);
  }, [beginTemporaryCollapse, endTemporaryCollapse]);

  useEffect(() => {
    // Also collapse the floating dock during meal plan drags.
    if (dockMode !== 'floating') {
      prevIsDraggingRef.current = isDragging;
      return;
    }

    if (isDragging && !prevIsDraggingRef.current) {
      beginTemporaryCollapse();
    }

    if (!isDragging && prevIsDraggingRef.current) {
      endTemporaryCollapse();
    }

    prevIsDraggingRef.current = isDragging;
  }, [beginTemporaryCollapse, dockMode, endTemporaryCollapse, isDragging]);

  const persist = useCallback(
    (next: {
      position: { x: number; y: number };
      isExpanded: boolean;
      dockMode: 'floating' | 'pin-left' | 'pin-right';
    }) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
    },
    [storageKey],
  );

  const onStartDockDrag = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0) return;
      if (dockMode !== 'floating') return;
      const el = dockRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      dragOffsetRef.current = {
        dx: e.clientX - rect.left,
        dy: e.clientY - rect.top,
      };

      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    [dockMode],
  );

  const onDockDragMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const offset = dragOffsetRef.current;
      if (!offset) return;
      const next = clampToViewport({
        x: e.clientX - offset.dx,
        y: e.clientY - offset.dy,
      });
      setPosition(next);
    },
    [clampToViewport],
  );

  const onEndDockDrag = useCallback(() => {
    dragOffsetRef.current = null;
    persist({ position, isExpanded, dockMode });
  }, [dockMode, isExpanded, persist, position]);

  const handlePlanChange = (key: string) => {
    setSelectedPlan(key);
  };

  const handlePrevDay = () => {
    if (selectedPlan !== PLAN_TYPES.WEEKLY_VIEW) {
      setSelectedDate(shiftDate(selectedDate, -1));
      return;
    }
    setRangeDate(shiftRange(rangeDate, -1));
  };

  const handleNextDay = () => {
    if (selectedPlan !== PLAN_TYPES.WEEKLY_VIEW) {
      setSelectedDate(shiftDate(selectedDate, 1));
      return;
    }
    setRangeDate(shiftRange(rangeDate, 1));
  };

  const toggleExpanded = useCallback(() => {
    if (dockMode !== 'floating') return;
    setSheenKey((prev) => prev + 1);
    setIsExpanded((prev) => {
      const next = !prev;
      persist({ position, isExpanded: next, dockMode });
      // Sync to Redux
      dispatch(setIsDockExpanded(next));
      return next;
    });
    // after width changes, keep dock in viewport
    setTimeout(() => setPosition((prev) => clampToViewport(prev)), 0);
  }, [clampToViewport, dispatch, dockMode, persist, position]);

  const handleDockModeChange = useCallback(
    (nextMode: string) => {
      if (
        nextMode !== 'floating' &&
        nextMode !== 'pin-left' &&
        nextMode !== 'pin-right'
      ) {
        return;
      }

      setSheenKey((prev) => prev + 1);
      setDockMode(nextMode);

      // When pinning, sidebar is always open.
      if (nextMode !== 'floating') {
        setIsExpanded(true);
        persist({ position, isExpanded: true, dockMode: nextMode });
        return;
      }

      persist({ position, isExpanded, dockMode: nextMode });
      setTimeout(() => setPosition((prev) => clampToViewport(prev)), 0);
    },
    [clampToViewport, isExpanded, persist, position],
  );

  const isPinned = dockMode !== 'floating';

  const reservedOffset = useMemo(() => {
    if (dockMode === 'pin-left' || dockMode === 'pin-right') {
      return PINNED_SIDEBAR_WIDTH + RESERVED_MARGIN;
    }
    const panel = isExpanded ? PANEL_GAP + PANEL_WIDTH : 0;
    return COMPACT_WIDTH + panel + RESERVED_MARGIN;
  }, [dockMode, isExpanded]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--mealplan-dock-offset-left', '0px');
    root.style.setProperty('--mealplan-dock-offset-right', '0px');

    if (dockMode === 'pin-left') {
      root.style.setProperty(
        '--mealplan-dock-offset-left',
        `${reservedOffset}px`,
      );
    } else if (dockMode === 'pin-right') {
      root.style.setProperty(
        '--mealplan-dock-offset-right',
        `${reservedOffset}px`,
      );
    }

    return () => {
      root.style.setProperty('--mealplan-dock-offset-left', '0px');
      root.style.setProperty('--mealplan-dock-offset-right', '0px');
    };
  }, [dockMode, reservedOffset]);

  const dockPositionStyle = useMemo<React.CSSProperties>(() => {
    if (dockMode === 'pin-left') {
      return {
        left: 'calc(var(--app-sidebar-width, 0px) + 8px)',
        top: PINNED_SIDEBAR_TOP,
      };
    }
    if (dockMode === 'pin-right') return { right: 8, top: PINNED_SIDEBAR_TOP };
    return { left: position.x, top: position.y };
  }, [dockMode, position.x, position.y]);

  const PIN_MENU_ITEMS = useMemo(
    () => [
      {
        key: 'floating',
        label: 'Floating',
        icon: <FaRegWindowRestore className='h-3.5 w-3.5' />,
      },
      {
        key: 'pin-left',
        label: 'Pin Left',
        icon: <FaThumbtack className='h-3.5 w-3.5' />,
      },
      {
        key: 'pin-right',
        label: 'Pin Right',
        icon: <FaThumbtack className='h-3.5 w-3.5 rotate-180' />,
      },
    ],
    [],
  );

  return (
    <div
      ref={dockRef}
      data-tour='planner-dock'
      className={cn('fixed z-[70] transform-gpu select-none')}
      style={dockPositionStyle}
    >
      <div
        className={cn(
          'relative flex items-start rounded-3xl',
          !isPinned && (isExpanded ? 'gap-2' : 'gap-0'),
          'bg-transparent',
        )}
      >
        {isPinned ? (
          /* Pinned sidebar: merged compact + expanded */
          <div
            className={cn(
              'relative flex w-[332px] flex-col pb-4',
              'h-[calc(100vh-112px)]',
              'relative isolate overflow-hidden',
              'rounded-3xl bg-white/65 shadow-[0_22px_70px_-34px_rgba(16,24,40,0.42)]',
              'saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/38',
            )}
          >
            <div
              key={`pinned-sheen-${sheenKey}`}
              className={cn(
                'pointer-events-none absolute -inset-x-12 -inset-y-8',
                'bg-gradient-to-r from-transparent via-white/45 to-transparent',
                '[transform:translateX(-140%)_skewX(-12deg)] opacity-0',
                'animate-[dockSheen_900ms_ease-out]',
              )}
            />

            <div className='flex items-center justify-between gap-2 px-3 pt-3'>
              <div className='flex items-center gap-2'>
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full',
                    'border border-white/40 bg-white/55 text-gray-500 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.4)]',
                  )}
                  aria-hidden
                >
                  <Tooltip
                    title='Pinned'
                    classNames={{ root: 'np-tooltip' }}
                    placement='right'
                  >
                    <span className='flex h-3.5 w-3.5 items-center justify-center'>
                      <FaGripVertical className='h-3.5 w-3.5 opacity-40' />
                    </span>
                  </Tooltip>
                </div>

                <Tooltip
                  title='Dock mode'
                  classNames={{ root: 'np-tooltip' }}
                  placement='right'
                >
                  <div data-tour='planner-dock-mode'>
                    <DropdownMenu
                      items={PIN_MENU_ITEMS}
                      onSelect={handleDockModeChange}
                      variant='icon-only'
                      ariaLabel='Dock mode'
                      selectedKey={dockMode}
                      defaultSelectedKey='pin-left'
                    />
                  </div>
                </Tooltip>
              </div>

              <div className='group relative min-w-0 flex-1 cursor-pointer px-1 leading-none'>
                <div className='flex items-baseline gap-2 whitespace-nowrap'>
                  <span className='text-primary-600 truncate text-[15px] font-bold tracking-[0.12em] uppercase'>
                    {selectedDate
                      .toLocaleString('en-US', { month: 'long' })
                      .toUpperCase()}
                  </span>
                  <span className='text-[13px] font-semibold text-gray-800'>
                    {selectedDate.getFullYear()}
                  </span>
                </div>
                {/* Invisible DatePicker Overlay */}
                <div className='absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100'>
                  <DatePicker
                    value={dayjs(selectedDate)}
                    onChange={(date: Dayjs | null) => {
                      if (date) setSelectedDate(date.toDate());
                    }}
                    allowClear={false}
                    className='absolute inset-0 h-full w-full opacity-0'
                    dropdownClassName='dock-date-picker-dropdown'
                  />
                </div>
              </div>

              <Tooltip
                title='View mode'
                classNames={{ root: 'np-tooltip' }}
                placement='right'
              >
                <div data-tour='planner-view-mode'>
                  <DropdownMenu
                    items={PLAN_MENU_ITEMS}
                    onSelect={handlePlanChange}
                    variant='icon-only'
                    ariaLabel='Plan view'
                    selectedKey={selectedPlan}
                  />
                </div>
              </Tooltip>
            </div>

            <div className='px-3 pt-2'>
              <div
                data-tour='planner-nav-buttons'
                className='flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/55 px-2 py-2 shadow-[0_10px_32px_-20px_rgba(16,24,40,0.45)] saturate-150 backdrop-blur-xl'
              >
                <NavigationButtons />
              </div>
            </div>

            <div className='flex-1 overflow-hidden px-3 pb-4'>
              <div className='relative mt-3 h-full overflow-hidden rounded-2xl border border-black/10 bg-white/55 p-2 shadow-[0_10px_28px_-24px_rgba(16,24,40,0.55)] saturate-150 backdrop-blur-xl supports-[backdrop-filter:blur(0px)]:bg-white/30'>
                <div className='side-add-scroll h-full overflow-y-auto pr-0 pb-6'>
                  <SideAddFood variant='dock' showClose={false} />
                  <PantrySuggestionsDock />
                </div>
                <div className='pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-b from-transparent to-white/80' />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Floating: Vertical compact dock */}
            <div
              className={cn(
                'relative flex w-[72px] flex-col items-center',
                'relative isolate overflow-hidden',
                'rounded-3xl border border-black/10 bg-white/65 shadow-[0_24px_78px_-36px_rgba(16,24,40,0.52)]',
                'saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/50',
                'transition-[background-color,box-shadow,transform,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                'hover:shadow-[0_22px_60px_-34px_rgba(16,24,40,0.42)]',
              )}
            >
              <div
                key={`dock-sheen-${sheenKey}`}
                className={cn(
                  'pointer-events-none absolute -inset-x-10 -inset-y-6',
                  'bg-gradient-to-r from-transparent via-white/55 to-transparent',
                  '[transform:translateX(-140%)_skewX(-12deg)] opacity-0',
                  'animate-[dockSheen_900ms_ease-out]',
                )}
              />

              {/* drag area */}
              <Tooltip
                title='Drag to move dock'
                classNames={{ root: 'np-tooltip' }}
                placement='right'
              >
                <button
                  type='button'
                  aria-label='Drag dock'
                  onPointerDown={onStartDockDrag}
                  onPointerMove={onDockDragMove}
                  onPointerUp={onEndDockDrag}
                  onPointerCancel={onEndDockDrag}
                  className={cn(
                    'mt-2 flex h-9 w-9 items-center justify-center rounded-full',
                    'border border-white/40 bg-white/55 text-gray-500 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.4)]',
                    'hover:bg-white/70 hover:text-gray-800',
                  )}
                  style={{ touchAction: 'none' }}
                >
                  <FaGripVertical className='h-3.5 w-3.5' />
                </button>
              </Tooltip>

              {/* pin mode selector */}
              <div className='mt-2 flex w-full items-center justify-center px-2'>
                <Tooltip
                  title='Dock mode'
                  classNames={{ root: 'np-tooltip' }}
                  placement='right'
                >
                  <div>
                    <DropdownMenu
                      items={PIN_MENU_ITEMS}
                      onSelect={handleDockModeChange}
                      variant='icon-only'
                      ariaLabel='Dock mode'
                      selectedKey={dockMode}
                    />
                  </div>
                </Tooltip>
              </div>

              {/* plan/view selector (icon-only button; menu shows text) */}
              <div className='mt-2 flex w-full items-center justify-center px-2'>
                <Tooltip
                  title='View mode'
                  classNames={{ root: 'np-tooltip' }}
                  placement='right'
                >
                  <div>
                    <DropdownMenu
                      items={PLAN_MENU_ITEMS}
                      onSelect={handlePlanChange}
                      variant='icon-only'
                      ariaLabel='Plan view'
                      selectedKey={selectedPlan}
                    />
                  </div>
                </Tooltip>
              </div>

              <div className='mt-2 w-full px-2'>
                <div className='group relative flex h-9 w-full items-center justify-center overflow-visible py-1'>
                  <button
                    type='button'
                    aria-label='Previous'
                    onClick={handlePrevDay}
                    className={cn(
                      'absolute left-0 flex h-7 w-7 items-center justify-center rounded-full',
                      'border border-white/35 bg-white/55 text-gray-700 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.4)] backdrop-blur-xl',
                      'opacity-0 transition-all duration-200 group-hover:opacity-100',
                      'hover:bg-white/75 hover:text-gray-900',
                    )}
                  >
                    <Tooltip
                      title='Previous day'
                      classNames={{ root: 'np-tooltip' }}
                      placement='right'
                    >
                      <span className='flex h-4 w-4 items-center justify-center'>
                        <FaAngleLeft className='h-4 w-4' />
                      </span>
                    </Tooltip>
                  </button>

                  <div className='flex flex-col items-center justify-center px-8 leading-none'>
                    <div className='text-primary-600 text-[13px] font-bold tracking-[0.1em] uppercase'>
                      {selectedDate
                        .toLocaleString('en-US', { month: 'short' })
                        .slice(0, 3)}
                    </div>
                    <div className='text-[14px] font-semibold text-gray-800'>
                      {selectedDate.getFullYear()}
                    </div>
                  </div>

                  <button
                    type='button'
                    aria-label='Next'
                    onClick={handleNextDay}
                    className={cn(
                      'absolute right-0 flex h-7 w-7 items-center justify-center rounded-full',
                      'border border-white/35 bg-white/55 text-gray-700 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.4)] backdrop-blur-xl',
                      'opacity-0 transition-all duration-200 group-hover:opacity-100',
                      'hover:bg-white/75 hover:text-gray-900',
                    )}
                  >
                    <Tooltip
                      title='Next day'
                      classNames={{ root: 'np-tooltip' }}
                      placement='right'
                    >
                      <span className='flex h-4 w-4 items-center justify-center'>
                        <FaAngleRight className='h-4 w-4' />
                      </span>
                    </Tooltip>
                  </button>
                </div>

                {/* keep original DateDisplay hidden for weekly range semantics if needed elsewhere */}
                <DateDisplay className='hidden' showPrefix={false} />
              </div>

              <div className='mt-3 flex w-full flex-1 flex-col items-center justify-end gap-2 px-3 pb-3'>
                <button
                  type='button'
                  aria-label='Search'
                  onClick={toggleExpanded}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full',
                    'border border-white/40 bg-white/55 text-gray-600 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.4)]',
                    'hover:border-primary-200 hover:bg-primary-50/60 hover:text-gray-900',
                  )}
                >
                  <Tooltip
                    title={isExpanded ? 'Close search' : 'Open search'}
                    classNames={{ root: 'np-tooltip' }}
                    placement='right'
                  >
                    <span className='flex h-3.5 w-3.5 items-center justify-center'>
                      <FaSearch className='text-primary-500 h-3.5 w-3.5' />
                    </span>
                  </Tooltip>
                </button>
              </div>
            </div>

            {/* Floating expanded panel (kept mounted so search state persists) */}
            <motion.div
              animate={
                isExpanded
                  ? {
                      width: PANEL_WIDTH,
                      marginLeft: PANEL_GAP,
                      maxHeight: FLOATING_PANEL_MAX_HEIGHT,
                    }
                  : {
                      width: 0,
                      marginLeft: 0,
                      maxHeight: 0,
                    }
              }
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}
              className={cn(
                'relative rounded-3xl',
                'relative isolate overflow-hidden',
                'bg-white/70 shadow-[0_26px_86px_-40px_rgba(16,24,40,0.55)]',
                'saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/55',
                isExpanded
                  ? 'border border-black/10'
                  : 'border border-transparent shadow-none',
              )}
            >
              <div
                key={`panel-sheen-${sheenKey}`}
                className={cn(
                  'pointer-events-none absolute -inset-x-12 -inset-y-8',
                  'bg-gradient-to-r from-transparent via-white/50 to-transparent',
                  '[transform:translateX(-140%)_skewX(-12deg)] opacity-0',
                  'animate-[dockSheen_900ms_ease-out]',
                )}
              />

              <div className='px-3 pt-3'>
                <div className='flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/55 px-2 py-2 shadow-[0_10px_32px_-20px_rgba(16,24,40,0.45)] saturate-150 backdrop-blur-xl'>
                  <NavigationButtons />
                </div>
              </div>

              <div className='flex-1 overflow-hidden px-3 pb-3'>
                <div className='relative mt-3 h-[420px] overflow-hidden rounded-2xl border border-black/10 bg-white/55 p-2 shadow-[0_10px_28px_-24px_rgba(16,24,40,0.55)] saturate-150 backdrop-blur-xl supports-[backdrop-filter:blur(0px)]:bg-white/30'>
                  <div className='side-add-scroll h-full overflow-y-auto pr-0 pb-3'>
                    <SideAddFood variant='dock' showClose={false} />
                    <PantrySuggestionsDock />
                  </div>
                  <div className='pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-b from-transparent to-white/80' />
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Remove zone overlays the whole dock+panel only during dragging */}
        <RemoveDropzone className='absolute inset-0 h-full w-full rounded-3xl' />
      </div>
    </div>
  );
};

export default HeaderLeftMealPlan;
