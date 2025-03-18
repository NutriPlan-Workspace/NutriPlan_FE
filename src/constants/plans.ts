import { MenuItem } from '@/types/menuItem';
import { getDisplayWeek } from '@/utils/dateUtils';

export const PLAN_TYPES = {
  SINGLE_DAY: '1',
  MULTI_DAY: '2',
  WEEKLY_VIEW: '3',
} as const;

export const PLAN_MENU_ITEMS: MenuItem[] = [
  { key: PLAN_TYPES.SINGLE_DAY, label: 'Single-Day' },
  { key: PLAN_TYPES.MULTI_DAY, label: 'Multi-Day' },
  { key: PLAN_TYPES.WEEKLY_VIEW, label: 'Weekly View' },
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
): MenuItem[] => [
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
