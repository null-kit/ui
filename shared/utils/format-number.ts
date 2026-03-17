export const formatNumber = (
  value: number | string | undefined | null,
  options?: Intl.NumberFormatOptions,
  locale: Intl.LocalesArgument = 'en-US'
) => {
  if (value === undefined) return 'N/A';

  return new Intl.NumberFormat(locale, {
    ...(options?.currency && { style: 'currency' }),
    ...options
  }).format(Number(value));
};

export const formatCurrency = (
  value: number | string | undefined | null,
  options?: Intl.NumberFormatOptions,
  locale: Intl.LocalesArgument = 'en-US'
) => {
  return formatNumber(value, { style: 'currency', currency: options?.currency ?? 'USD', ...options }, locale);
};
