type ValidationErrors = Record<string, string | null>;

export const useValidate = () => {
  const validate = useState<ValidationErrors>('validation', () => ({}));

  const setErrors = (errors: ValidationErrors | Record<string, string[] | string | null>) => {
    if (typeof errors === 'object' && errors !== null) {
      validate.value = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, Array.isArray(value) ? value[0] || null : value])
      );
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
