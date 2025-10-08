type DateOptions = {
  format?: 'short' | 'long' | 'iso';
  time?: boolean;
  year?: boolean;
  options?: Intl.DateTimeFormatOptions;
  locale?: string;
  hourCycle?: Intl.DateTimeFormatOptions['hourCycle'];
};

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
