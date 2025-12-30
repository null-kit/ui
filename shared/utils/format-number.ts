export const formatNumber = (value?: number | string, props?: Intl.NumberFormatOptions, locale = 'en-US') => {
  if (value === undefined) return 'N/A';

  return new Intl.NumberFormat(locale, {
    ...(props?.currency && { style: 'currency' }),
    ...props
  }).format(Number(value));
};

export const formatCurrency = (value?: number | string, currency?: Intl.NumberFormatOptionsStyle, locale = 'en-US') => {
  if (value === undefined) return 'N/A';

  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(value));
};
