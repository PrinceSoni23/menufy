/**
 * Network error handling utilities
 */

export class NetworkError extends Error {
  constructor(
    public statusCode: number,
    public originalError: any,
    message: string,
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

/**
 * Check if user is online
 */
export function isOnline(): boolean {
  if (typeof window === "undefined") return true;
  return navigator.onLine;
}

/**
 * Wait for network to be available
 */
export async function waitForNetwork(
  timeoutMs: number = 30000,
): Promise<boolean> {
  if (isOnline()) return true;

  return new Promise(resolve => {
    const handleOnline = () => {
      window.removeEventListener("online", handleOnline);
      resolve(true);
    };

    window.addEventListener("online", handleOnline);

    const timeout = setTimeout(() => {
      window.removeEventListener("online", handleOnline);
      resolve(false);
    }, timeoutMs);

    // Cleanup timeout if online event fires
    window.addEventListener("online", () => clearTimeout(timeout), {
      once: true,
    });
  });
}

/**
 * Retry logic for failed network requests
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    backoffMultiplier?: number;
    shouldRetry?: (error: any, attempt: number) => boolean;
  } = {},
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    backoffMultiplier = 2,
    shouldRetry = (error: any) => {
      // Retry on network errors and 5xx server errors
      if (error?.statusCode >= 500) return true;
      if (
        error?.message?.includes("Network") ||
        error?.message?.includes("timeout")
      )
        return true;
      return false;
    },
  } = options;

  let lastError: any;
  let delay = initialDelayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if it's not a retryable error
      if (!shouldRetry(error, attempt)) {
        throw error;
      }

      // Don't retry after max attempts
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffMultiplier, maxDelayMs);
    }
  }

  throw lastError;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: any): string {
  if (error instanceof NetworkError) {
    return getStatusErrorMessage(error.statusCode);
  }

  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    // Check if it's a network-related error
    if (
      error.message.includes("Network") ||
      error.message.includes("timeout") ||
      error.message.includes("ECONNREFUSED")
    ) {
      return "Network connection failed. Please check your internet connection.";
    }
    return error.message;
  }

  return "An unexpected error occurred";
}

/**
 * Get error message from HTTP status code
 */
export function getStatusErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return "Invalid request. Please check your input.";
    case 401:
      return "You are not authenticated. Please log in again.";
    case 403:
      return "You do not have permission to access this resource.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "This resource already exists.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
      return "Server error. Please try again later.";
    case 502:
    case 503:
      return "Service temporarily unavailable. Please try again later.";
    case 504:
      return "Server timeout. Please try again later.";
    default:
      if (statusCode >= 500) {
        return "Server error. Please try again later.";
      }
      if (statusCode >= 400) {
        return "Request failed. Please try again.";
      }
      return "An error occurred. Please try again.";
  }
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  if (error instanceof NetworkError) {
    // Retry on 5xx errors
    return error.statusCode >= 500;
  }

  if (error?.message) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes("network") ||
      msg.includes("timeout") ||
      msg.includes("econnrefused")
    );
  }

  return false;
}
