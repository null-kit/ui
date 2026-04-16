type DateOptions = {
  format?: 'short' | 'long' | 'iso';
  time?: boolean;
  year?: boolean;
  options?: Intl.DateTimeFormatOptions;
  locale?: Intl.LocalesArgument;
  hourCycle?: Intl.DateTimeFormatOptions['hourCycle'];
};

type DateInput = Date | string | number | null | undefined;

/**
 * Format a date to a string using the Intl.DateTimeFormat API
 * @param date - The date to format
 * @param options - The options to format the date
 * @returns The formatted date
 */
export const formatDate = (
  date: DateInput,
  { format = 'short', time = false, year = true, options, locale = 'en-US', hourCycle = 'h23' }: DateOptions = {}
) => {
  if (!date) return 'N/A';

  const currentDate = new Date(date);

  if (format === 'iso') return formatISO(date);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hourCycle,
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
    ...(time ? { hour: 'numeric', minute: 'numeric' } : {}),
    ...(year ? { year: 'numeric' } : {})
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(currentDate);
};

const toISO = (date: DateInput) => {
  if (!date) return 'N/A';

  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Format a date to a local ISO string (YYYY-MM-DD)
 * @param date - The date to format
 * @returns The formatted date
 */
export const formatISO = (date: DateInput) => toISO(date);

/**
 * Format a date to a ISO string (YYYY-MM-DD)
 * Safe version of formatISO that moves the date back one day if it is the same day and the UTC day has not started yet.
 * @param date - The date to format
 * @returns The formatted date
 */
export const formatSafeISO = (date: DateInput) => {
  if (!date) return 'N/A';

  const d = new Date(date);
  const now = new Date();

  const isSameDay =
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();

  const isUTCDayNotStarted = now.getDate() !== now.getUTCDate();

  if (isSameDay && isUTCDayNotStarted) {
    d.setDate(d.getDate() - 1);
  }

  return toISO(d);
};

/**
 * Set the date of a date object
 * @param date - The date to set the date of
 * @param offset - The offset to set the date of
 * @param format - The format to return the date in
 * @returns The date with the offset set
 */
export const setDate = (date: DateInput, offset: number = 0) => {
  const currentDate = !date ? new Date() : new Date(date);

  return new Date(currentDate.setUTCDate(currentDate.getUTCDate() + offset));
};

export const setDateRange = (startDate: DateInput, endDate: DateInput) => {
  if (!startDate || !endDate) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  const dates = [];

  for (let d = start; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    dates.push(new Date(d));
  }

  return dates;
};
