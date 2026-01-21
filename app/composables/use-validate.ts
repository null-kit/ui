type ValidationErrors = Record<string, string | string[] | null>;

export const useValidate = () => {
  const validationErrors = useState<ValidationErrors>('validation', () => ({}));

  const setErrors = <T extends ValidationErrors>(errors: T) => {
    if (Array.isArray(errors)) {
      validationErrors.value = Object.fromEntries(errors.map((error) => [error.path, error.message]));
      return;
    }

    if (typeof errors === 'object' && errors !== null) {
      const object = Object.entries(errors).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] || null : value
      ]);

      validationErrors.value = Object.fromEntries(object);

      return;
    }
  };

  const clearErrors = (path?: string) => {
    if (path) {
      validationErrors.value = { ...validationErrors.value, [path]: null };
      return;
    }

    validationErrors.value = {};
  };

  return {
    errors: validationErrors,
    setErrors,
    clearErrors
  };
};
