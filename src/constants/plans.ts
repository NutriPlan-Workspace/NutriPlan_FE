import React from 'react';
import { FaRegCalendarAlt, FaRegClone } from 'react-icons/fa';
import { PiCalendarDots } from 'react-icons/pi';

import type { MenuItemDropdown } from '@/types/menuItem';
import { getDisplayWeek } from '@/utils/dateUtils';

export const PLAN_TYPES = {
  SINGLE_DAY: '1',
  MULTI_DAY: '2',
  WEEKLY_VIEW: '3',
} as const;

export const PLAN_MENU_ITEMS: MenuItemDropdown[] = [
  {
    key: PLAN_TYPES.SINGLE_DAY,
    label: 'Single Day',
    icon: React.createElement(FaRegCalendarAlt, { className: 'h-4 w-4' }),
  },
  {
    key: PLAN_TYPES.MULTI_DAY,
    label: 'Multi Day',
    icon: React.createElement(FaRegClone, { className: 'h-4 w-4' }),
  },
  {
    key: PLAN_TYPES.WEEKLY_VIEW,
    label: 'Weekly View',
    icon: React.createElement(PiCalendarDots, { className: 'h-4 w-4' }),
  },
];

export const WEEK_TYPES = {
  LAST_WEEK: '0',
  CURRENT_WEEK: '1',
  NEXT_WEEK: '2',
  CUSTOM_RANGE: '3',
} as const;

export const getWeekOptions = (
  startLastWeek: Date,
  endLastWeek: Date,
  startCurrentWeek: Date,
  endCurrentWeek: Date,
  startNextWeek: Date,
  endNextWeek: Date,
): MenuItemDropdown[] => [
  {
    key: WEEK_TYPES.LAST_WEEK,
    label: `Last week, ${getDisplayWeek(startLastWeek, endLastWeek)}`,
  },
  {
    key: WEEK_TYPES.CURRENT_WEEK,
    label: `Current week, ${getDisplayWeek(startCurrentWeek, endCurrentWeek)}`,
  },
  {
    key: WEEK_TYPES.NEXT_WEEK,
    label: `Next week, ${getDisplayWeek(startNextWeek, endNextWeek)}`,
  },
  {
    key: WEEK_TYPES.CUSTOM_RANGE,
    label: 'Custom Range',
  },
];
