import { format } from 'date-fns';

const DATE_FORMAT = 'MMM dd, yyyy';

export const dateInUTC = (date: Date) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
};

const formatForUserTimezone = (date: Date) => {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
};

export const formatDate = (date: Date) => {
  return format(formatForUserTimezone(date), DATE_FORMAT);
};
