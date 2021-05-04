export const SUPPORTED_DATE_FORMAT = ['DD/MM/YYYY', 'MM/DD/YYYY'];

export const SUPPORTED_DATE_FORMAT_OPTIONS = SUPPORTED_DATE_FORMAT.map(dateFormat => ({
  label: dateFormat,
  value: dateFormat,
}));
