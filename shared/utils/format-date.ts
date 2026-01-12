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
export const setDate = (date: DateInput, offset: number = 0, format: 'iso' | 'date' = 'date') => {
  const currentDate = date instanceof Date ? date : date ? new Date(date) : new Date();

  const targetDate = new Date(currentDate.setDate(currentDate.getDate() + offset));

  return format === 'iso' ? formatDate(targetDate, { format: 'iso' }) : targetDate;
};
