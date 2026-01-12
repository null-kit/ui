type DateOptions = {
  format?: 'short' | 'long' | 'iso';
  time?: boolean;
  year?: boolean;
  options?: Intl.DateTimeFormatOptions;
  locale?: string;
  hourCycle?: Intl.DateTimeFormatOptions['hourCycle'];
};

/**
 * Format a date to a string using the Intl.DateTimeFormat API
 * @param date - The date to format
 * @param options - The options to format the date
 * @returns The formatted date
 */
export const formatDate = (
  date: Date | string | number | null,
  { format = 'short', time = false, year = true, options, locale = 'en-US', hourCycle = 'h23' }: DateOptions = {}
) => {
  if (!date) return 'N/A';

  const dateObject = date instanceof Date ? date : new Date(date);

  if (format === 'iso') {
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hourCycle,
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
    ...(time ? { hour: 'numeric', minute: 'numeric' } : {}),
    ...(year ? { year: 'numeric' } : {})
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(dateObject);
};

/**
 * Set the date of a date object
 * @param date - The date to set the date of
 * @param offset - The offset to set the date of
 * @param format - The format to return the date in
 * @returns The date with the offset set
 */
export const setDate = (date: Date | string | number, offset: number = 0, format: 'iso' | 'date' = 'date') => {
  const day = date instanceof Date ? date : new Date(date);

  const targetDate = new Date(day.setDate(day.getDate() + offset));

  return format === 'iso' ? formatDate(targetDate, { format: 'iso' }) : targetDate;
};
