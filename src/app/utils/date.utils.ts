import { format } from 'date-fns';

const DATE_FORMAT = 'MMM dd, yyyy';

export const formatDate = (date: Date) => format(date, DATE_FORMAT);

export const dateInUTC = (date: Date, isEndOfDay?: boolean) => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      isEndOfDay ? date.getDate() + 1 : date.getDate(),
      0,
      0,
      0
    )
  );
};
