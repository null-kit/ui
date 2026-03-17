export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(fn: F, ms = 300) => {
  let timeout: NodeJS.Timeout;

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => fn(...args), ms);
  };

  return debounced;
};
