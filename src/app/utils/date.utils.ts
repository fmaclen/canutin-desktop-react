import { format, differenceInCalendarWeeks, fromUnixTime, differenceInSeconds } from 'date-fns';

export const dateInUTC = (date: Date) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getDate(), 0, 0, 0));
};

export const formatDate = (date: Date) => {
  const DATE_FORMAT = 'MMM dd, yyyy';
  return format(date, DATE_FORMAT);
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

export function formatRelativeDate(earliestDate: Date, latestDate = new Date()) {
  const difference = differenceInSeconds(latestDate, earliestDate);

  let relativeDate: string;
  let amount: number;

  const pluralize = (num: number) => (num > 1 ? 's' : '');

  if (difference < 5) {
    relativeDate = `Just now`;
  } else if (difference < 60) {
    amount = Math.floor(difference);
    relativeDate = `${amount} second${pluralize(amount)} ago`;
  } else if (difference < 3600) {
    amount = Math.floor(difference / 60);
    relativeDate = `${amount} minute${pluralize(amount)} ago`;
  } else if (difference < 86400) {
    amount = Math.floor(difference / 3600);
    relativeDate = `${amount} hour${pluralize(amount)} ago`;
  } else if (difference < 2620800) {
    amount = Math.floor(difference / 86400);
    relativeDate = `${amount} day${pluralize(amount)} ago`;
  } else if (difference < 31449600) {
    amount = Math.floor(difference / 2620800);
    relativeDate = `${amount} month${pluralize(amount)} ago`;
  } else {
    amount = Math.floor(difference / 31449600);
    relativeDate = `${amount} year${pluralize(amount)} ago`;
  }

  return relativeDate;
}
