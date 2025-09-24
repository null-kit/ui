export const formatNumber = (value?: number | string, props?: Intl.NumberFormatOptions, locale = 'en-US') => {
  if (value === undefined) return 'N/A';

  return new Intl.NumberFormat(locale, {
    ...(props?.currency && { style: 'currency' }),
    ...props
  }).format(Number(value));
};
