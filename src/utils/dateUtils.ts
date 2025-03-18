import { DateRange } from 'react-day-picker';
import { addDays, addWeeks, endOfWeek, format, startOfWeek } from 'date-fns';

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
