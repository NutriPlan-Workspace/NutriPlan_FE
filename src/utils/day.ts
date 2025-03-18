import dayjs from 'dayjs';

export const getDayOfWeek = (date: Date) => dayjs(date).format('dddd');

export const getDateOfMonth = (date: Date) => dayjs(date).date();

export const isSameDayAsToday = (date: Date) =>
  dayjs(date).isSame(dayjs(), 'day');
