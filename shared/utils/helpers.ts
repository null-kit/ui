/**
 * Calculates the sum of an array of values.
 *
 * If a `key` is provided, it will sum the values at that key for each object in the array.
 *
 * If an array element is not an object (when a key is provided), it uses the value as-is.
 *
 * If no `key` is provided, each item is coerced to a number and summed.
 */
export const calcTotal = <T>(data: T[], key?: keyof T) => {
  return data.reduce((acc, cur) => acc + Number((key ? (typeof cur === 'object' ? cur?.[key] : cur) : cur) ?? 0), 0);
};

/**
 * Calculates the average of an array of values.
 *
 * If a `key` is provided, it will average the values at that key for each object in the array.
 *
 * If an array element is not an object (when a key is provided), it uses the value as-is.
 *
 * If no `key` is provided, each item is coerced to a number and averaged.
 */
export const calcAvg = <T>(data: T[], key?: keyof T) => calcTotal(data, key) / data.length;

/**
 * Calculates the difference between two numbers as a percentage.
 *
 * If the first number is less than 0, it returns 100.
 *
 * Otherwise, it returns the difference as a percentage.
 */
export const calcDiffPercentage = (a: number, b: number) => {
  return a > 0 ? -toFixedNumber(((a - b) / a) * 100) : 100;
};

/**
 * Calculates the percentage of a number relative to another number.
 */
export const calcPercentage = (a: number, b: number) => toFixedNumber((a / b) * 100);

/**
 * Converts a number to a fixed number with given precision (default: 2).
 */
export const toFixedNumber = (value: number, precision: number = 2) => Number(Number(value).toFixed(precision));

const formatString = (value: string, separator: string) => {
  return value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
};

/**
 * Converts a string to an array using a separator.
 * @param value - The string to convert.
 * @param separator - The separator to use.
 * @param unique - Whether to return a unique array.
 */
export const toSeparatedArray = (value: string, separator: string, unique: boolean = false) => {
  if (!value || !separator) return [];

  if (unique) return [...new Set(formatString(value, separator))];

  return formatString(value, separator);
};

/**
 * Converts an array to a string using a separator.
 * @param value - The array of strings or numbers to convert.
 * @param separator - The separator to use.
 * @param unique - Whether to return a unique array.
 */
export const toSeparatedString = (value: (string | number)[], separator: string, unique: boolean = false) => {
  if (!value || !separator) return [];

  if (unique) return [...new Set(value)].join(separator);

  return value.join(separator);
};

/**
 * Generates a random string of a given length (default: 20).
 */
export const generateRandomString = (length = 20) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return randomString;
};
