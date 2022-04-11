import { endOfDay, subDays, subHours, subMinutes, subMonths, subSeconds, subYears } from 'date-fns';

import { dateInUTC, formatDate, formatRelativeDate, handleDate } from '@app/utils/date.utils';

test('Timezoned date is forced to UTC', () => {
  const date = new Date(1970, 0, 0, 23, 59, 59);
  expect(dateInUTC(date).getTime()).toEqual(0);
});

test('Date is formatted', () => {
  const date = new Date(2000, 0, 1, 23, 59, 59);
  expect(formatDate(date)).toEqual('Jan 01, 2000');
});

test('Normalize dates of any type to a Date object', () => {
  const date = new Date(2000, 0, 1, 0, 0, 0);
  const dateAsUnixEpoch = date.getTime() / 1000;
  expect(handleDate(date)).toBe(date);
  expect(handleDate(dateAsUnixEpoch)).toEqual(date);
  expect(endOfDay(handleDate())).toEqual(endOfDay(new Date()));
});

test('Formatted relative date', () => {
  const today = new Date();
  expect(formatRelativeDate(today, today)).toBe('Just now');
  expect(formatRelativeDate(subSeconds(today, 1), today)).not.toBe('1 second ago');
  expect(formatRelativeDate(subSeconds(today, 59), today)).toBe('59 seconds ago');
  expect(formatRelativeDate(subMinutes(today, 1), today)).toBe('1 minute ago');
  expect(formatRelativeDate(subMinutes(today, 59), today)).toBe('59 minutes ago');
  expect(formatRelativeDate(subHours(today, 1), today)).toBe('1 hour ago');
  expect(formatRelativeDate(subHours(today, 23), today)).toBe('23 hours ago');
  expect(formatRelativeDate(subDays(today, 1), today)).toBe('1 day ago');
  expect(formatRelativeDate(subDays(today, 27), today)).toBe('27 days ago');
  expect(formatRelativeDate(subMonths(today, 1), today)).toBe('1 month ago');
  expect(formatRelativeDate(subMonths(today, 11), today)).toBe('11 months ago');
  expect(formatRelativeDate(subYears(today, 1), today)).toBe('1 year ago');
  expect(formatRelativeDate(subYears(today, 2), today)).toBe('2 years ago');
});
