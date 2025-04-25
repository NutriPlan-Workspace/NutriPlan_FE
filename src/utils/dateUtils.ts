import { DateRange } from 'react-day-picker';
import {
  addDays,
  addWeeks,
  endOfWeek,
  format,
  isSameDay as isSameDayDateFns,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfWeek,
} from 'date-fns';

export const getWeekRange = (date: Date, offset: number = 0): DateRange => {
  const from = startOfWeek(addWeeks(date, offset), { weekStartsOn: 1 });
  const to = endOfWeek(addWeeks(date, offset), { weekStartsOn: 1 });

  return { from, to };
};

export const shiftRange = (range: DateRange, offset: 1 | -1): DateRange => {
  if (offset === 1) {
    return {
      from: range.to ? addDays(range.to, 1) : undefined,
      to: range.to ? addDays(range.to, 7) : undefined,
    };
  }
  return {
    from: range.from ? addDays(range.from, -7) : undefined,
    to: range.from ? addDays(range.from, -1) : undefined,
  };
};

export const shiftDate = (date: Date, offset: number): Date =>
  addDays(date, offset);

export const getDisplayWeek = (from: Date, to: Date) =>
  `${format(from, 'MMM d')} - ${format(to, 'MMM d')}`;

export const getDisplayWeekRange = (from?: Date, to?: Date) => {
  if (!from || !to) return 'Invalid Date Range';
  return `${format(from, 'MMMM do')} - ${format(to, 'MMMM do, yyyy')}`;
};

export const getDisplayMonthYear = (date?: Date) =>
  format(date ?? new Date(), 'MMMM yyyy');

export const isSameDateRange = (
  from: Date,
  to: Date,
  start: Date,
  end: Date,
): boolean =>
  from?.toDateString() === start?.toDateString() &&
  to?.toDateString() === end?.toDateString();

export const formatDate = (date: string | Date) => {
  const newDate = typeof date === 'string' ? new Date(date) : date;
  return newDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const isSameDay = (date1: Date, date2: Date) =>
  isSameDayDateFns(date1, date2);

export const getDayOfWeek = (date: Date) => format(date, 'EEEE');

export const getDateOfMonth = (date: Date) => format(date, 'd');

export const isSameDayAsToday = (date: Date) =>
  isSameDayDateFns(date, new Date());

export const isBetweenOfRange = (date: Date, startDate: Date, endDate: Date) =>
  isWithinInterval(startOfDay(date), {
    start: startOfDay(startDate),
    end: startOfDay(endDate),
  });

export const getDayRangeFromCenter = (
  centerDate: Date,
  range: number,
): Date[] =>
  Array.from({ length: range * 2 + 1 }, (_, i) =>
    addDays(centerDate, i - range),
  );

export const getDayRangeFromTo = (from: string, to: string): Date[] => {
  const startDate = new Date(from);
  const endDate = new Date(to);
  const dates: Date[] = [];

  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    dates.push(new Date(date));
  }

  return dates;
};

export const getMealDate = (date: Date): string => format(date, 'yyyy-MM-dd');

export const getDiffDays = (date1: Date, date2: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.abs(
    Math.floor(
      (startOfDay(date1).getTime() - startOfDay(date2).getTime()) / msPerDay,
    ),
  );
};

export function formatToDayAndDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'EEEE, MMM d');
}
