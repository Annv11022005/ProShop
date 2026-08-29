/**
 * Centralized utility to extract a user-friendly error message from various error formats:
 * - Axios response errors: error.response?.data?.message
 * - RTK Query errors: error.data?.message || error.error
 * - Standard JavaScript Error instances: error.message
 * - Primitive string errors
 *
 * @param {unknown} error - The caught error object or string
 * @param {string} [defaultMessage='An unexpected error occurred. Please try again.'] - Fallback error message
 * @returns {string} The resolved error message
 */
export function getErrorMessage(
  error,
  defaultMessage = 'An unexpected error occurred. Please try again.',
) {
  if (!error) return defaultMessage;

  if (typeof error === 'string') {
    const trimmed = error.trim();
    return trimmed.length > 0 ? trimmed : defaultMessage;
  }

  // Axios response error object
  if (error.response?.data) {
    const { data } = error.response;
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message.trim();
    }
    if (typeof data.error === 'string' && data.error.trim()) {
      return data.error.trim();
    }
    if (typeof data === 'string' && data.trim()) {
      return data.trim();
    }
  }

  // RTK Query / Redux toolkit error payload
  if (error.data) {
    if (typeof error.data.message === 'string' && error.data.message.trim()) {
      return error.data.message.trim();
    }
    if (typeof error.data.error === 'string' && error.data.error.trim()) {
      return error.data.error.trim();
    }
  }

  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error.trim();
  }

  // Standard JavaScript Error instance
  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message.trim();
  }

  return defaultMessage;
}
