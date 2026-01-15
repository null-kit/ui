type DateOptions = {
  format?: 'short' | 'long' | 'iso';
  time?: boolean;
  year?: boolean;
  options?: Intl.DateTimeFormatOptions;
  locale?: string;
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

  const currentDate = normalizeDate(date);

  if (format === 'iso') {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hourCycle,
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
    ...(time ? { hour: 'numeric', minute: 'numeric' } : {}),
    ...(year ? { year: 'numeric' } : {})
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(currentDate);
};

/**
 * Format a date to an ISO string (YYYY-MM-DD)
 * @param date - The date to format
 * @returns The formatted date
 */
export const formatISO = (date: DateInput) => formatDate(!date ? 'N/A' : normalizeDate(date), { format: 'iso' });

/**
 * Set the date of a date object
 * @param date - The date to set the date of
 * @param offset - The offset to set the date of
 * @param format - The format to return the date in
 * @returns The date with the offset set
 */
export const setDate = (date: DateInput, offset: number = 0, format: 'iso' | 'date' = 'date') => {
  if (!date) return 'N/A';

  const currentDate = normalizeDate(date);

  const targetDate = new Date(currentDate.setDate(currentDate.getDate() + offset));

  return format === 'iso' ? formatDate(targetDate, { format: 'iso' }) : targetDate;
};

export const setDateRange = (startDate: Date, endDate: Date, format: 'iso' | 'date' = 'date') => {
  if (!startDate || !endDate) return [];

  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  const dates: (Date | string)[] = [];

  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(format === 'iso' ? formatISO(d) : d);
  }

  return dates;
};

const normalizeDate = (date: Date | string | number) => {
  if (date instanceof Date) return date;
  if (typeof date === 'string' || typeof date === 'number') return new Date(date);

  return new Date();
};
