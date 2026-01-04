export const formatNumber = (
  value: number | string | undefined | null,
  props?: Intl.NumberFormatOptions,
  locale: Intl.LocalesArgument = 'en-US'
) => {
  if (value === undefined) return 'N/A';

  return new Intl.NumberFormat(locale, {
    ...(props?.currency && { style: 'currency' }),
    ...props
  }).format(Number(value));
};

export const formatCurrency = (
  value: number | string | undefined | null,
  props?: Intl.NumberFormatOptions,
  locale: Intl.LocalesArgument = 'en-US'
) => {
  return formatNumber(value, { style: 'currency', currency: props?.currency ?? 'USD', ...props }, locale);
};
