type NumberOptions = {
  currency?: string;
  options?: Intl.NumberFormatOptions;
  locale?: string;
};

export const formatNumber = (value: number | string, { currency, options, locale = 'en-US' }: NumberOptions = {}) => {
  const defaultOptions: Intl.NumberFormatOptions = currency ? { style: 'currency', currency } : {};

  return new Intl.NumberFormat(locale, options || defaultOptions).format(Number(value));
};
