export const useClipboard = () => {
  const status = ref(false);
  const statusText = ref('Copy');

  const copy = async (text: string) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);

      status.value = true;
      statusText.value = 'Copied!';

      setTimeout(() => {
        status.value = false;
        statusText.value = 'Copy';
      }, 2000);
    } catch (error) {
      status.value = false;
      statusText.value = 'Error';

      console.error('Failed to copy text:', error);
    }
  };

  return { copy, status, statusText };
};
