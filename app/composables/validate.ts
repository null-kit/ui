type ValidationErrors = Record<string, string | null>;

export const useValidate = () => {
  const validate = useState<ValidationErrors>('validation', () => ({}));

  const setErrors = (errors: ValidationErrors) => {
    if (Array.isArray(errors)) {
      validate.value = Object.fromEntries(errors.map((error) => [error.path, error.message]));
      return;
    }

    if (typeof errors === 'object' && errors !== null) {
      const object = Object.entries(errors).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] || null : value
      ]);

      validate.value = Object.fromEntries(object);

      return;
    }
  };

  const clearErrors = () => {
    validate.value = {};
  };

  const clearError = (path: string) => {
    validate.value = { ...validate.value, [path]: null };
  };

  return {
    validate,
    setErrors,
    clearErrors,
    clearError
  };
};
