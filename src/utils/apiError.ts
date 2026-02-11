import type { ApiError } from "../api/types";

export function getErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const apiError = error as ApiError;
  let message = apiError.message ?? fallback;
  if (apiError.status === 429 && apiError.retryAfterSeconds) {
    message = `${message} (retry in ${apiError.retryAfterSeconds}s)`;
  }
  const requestId = apiError.requestId;

  if (requestId) {
    return `${message} (request_id: ${requestId})`;
  }

  return message;
}
