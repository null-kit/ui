type DateOptions = {
  format?: 'short' | 'long' | 'iso';
  time?: boolean;
  year?: boolean;
  options?: Intl.DateTimeFormatOptions;
  locale?: string;
  hourCycle?: Intl.DateTimeFormatOptions['hourCycle'];
};

// type DateFormat = 'iso' | 'yyyy' | 'yyyy-mm' | 'yyyy-mm-dd';

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
export const formatISO = (date: DateInput) => formatDate(!date ? 'N/A' : new Date(date), { format: 'iso' });

/**
 * Set the date of a date object
 * @param date - The date to set the date of
 * @param offset - The offset to set the date of
 * @param format - The format to return the date in
 * @returns The date with the offset set
 */
export const setDate = (date: DateInput, offset: number = 0) => {
  if (!date) return 'N/A';

  const currentDate = new Date(date);

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

// const formatDateTo = (date: Date, format?: DateFormat) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');

//   switch (format) {
//     case 'yyyy':
//       return year;
//     case 'yyyy-mm':
//       return `${year}-${month}`;
//     case 'iso':
//       return `${year}-${month}-${day}`;
//     case 'yyyy-mm-dd':
//       return `${year}-${month}-${day}`;
//     default:
//       return date;
//   }
// };
