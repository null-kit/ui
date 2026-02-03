/**
 * useClipboard is a composable for handling clipboard operations.
 *
 * Provides reactive state for copy status and convenience methods for copying text to the clipboard.
 *
 * @returns {Object} An object containing:
 *  - {function} copy: Copies the specified text string to the clipboard. Optionally accepts an id for tracking.
 *  - {Ref<number|null>} copyId: The current id associated with the most recent copy action.
 *  - {Ref<boolean>} status: Indicates whether the last copy action was successful.
 *  - {Ref<string>} statusText: The user-facing status message (e.g., "Copy", "Copied!", "Error").
 */
export const useClipboard = () => {
  const status = ref(false);
  const statusText = ref('Copy');
  const copyId = ref<number | null>(null);

  const copy = async (text: string, id?: number) => {
    if (!text || status.value) return;

    try {
      await navigator.clipboard.writeText(text);

      status.value = true;
      statusText.value = 'Copied!';
      copyId.value = id ?? null;

      setTimeout(() => {
        status.value = false;
        statusText.value = 'Copy';
        copyId.value = null;
      }, 2000);
    } catch (error) {
      status.value = false;
      statusText.value = 'Error';
      copyId.value = null;

      console.error('Failed to copy text:', error);
    }
  };

  return {
    copy,
    copyId,
    status,
    statusText
  };
};
