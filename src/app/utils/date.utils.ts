import { format, differenceInCalendarWeeks, fromUnixTime } from 'date-fns';

export const dateInUTC = (date: Date) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
};

export const formatDate = (date: Date) => {
  const DATE_FORMAT = 'MMM dd, yyyy';
  const dateToUserTimezone = () =>
    new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);

  return format(dateToUserTimezone(), DATE_FORMAT);
};

export const getNumberOfWeeks = (from: Date, to: Date) =>
  differenceInCalendarWeeks(to, from, { weekStartsOn: 1 });

export const handleDate = (date?: number | Date) => {
  if (!date) {
    return new Date();
  } else if (typeof date === 'number') {
    return fromUnixTime(date);
  } else {
    return date;
  }
};
