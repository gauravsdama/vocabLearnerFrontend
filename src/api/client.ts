import { getAccessToken, clearAccessToken } from "../utils/storage";
import { logError, logInfo } from "../utils/logger";
import { emitMessage } from "../utils/messageBus";
import type { ApiError, ApiErrorShape } from "./types";
import { getApiBaseUrl, normalizeBaseUrl } from "./config";

const API_PREFIX = "/api/v1";

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler;
}

function buildUrl(path: string) {
  const baseUrl = normalizeBaseUrl(getApiBaseUrl());
  return `${baseUrl}${API_PREFIX}${path}`;
}

function parseError(
  status: number,
  body: unknown,
  requestId: string | null,
  clientRequestId: string,
  retryAfterSeconds?: number | null,
): ApiError {
  if (body && typeof body === "object" && "error" in body) {
    const errorBody = body as ApiErrorShape;
    const details = errorBody.error.details;
    const retryFromDetails =
      details && typeof details === "object"
        ? Number(
            (details as Record<string, unknown>).retry_after_seconds ??
              (details as Record<string, unknown>).retryAfterSeconds,
          )
        : null;
    const retryAfter =
      retryAfterSeconds ??
      errorBody.error.retry_after_seconds ??
      (errorBody.error as { retryAfterSeconds?: number }).retryAfterSeconds ??
      (Number.isFinite(retryFromDetails) ? retryFromDetails : undefined);
    const message =
      status === 429 && retryAfter
        ? `Too many requests. Try again in ${retryAfter}s.`
        : errorBody.error.message;
    return {
      status,
      code: errorBody.error.code,
      message,
      details,
      requestId: errorBody.error.request_id ?? requestId ?? undefined,
      clientRequestId,
      retryAfterSeconds: retryAfter ?? undefined,
    };
  }

  return {
    status,
    code: "unknown_error",
    message:
      status === 429 && retryAfterSeconds
        ? `Too many requests. Try again in ${retryAfterSeconds}s.`
        : "Unexpected error",
    details: undefined,
    requestId: requestId ?? undefined,
    clientRequestId,
    retryAfterSeconds: retryAfterSeconds ?? undefined,
  };
}

function createClientRequestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `fe-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sanitizeHeaders(headers: HeadersInit) {
  if (headers instanceof Headers) {
    const entries: Record<string, string> = {};
    headers.forEach((value, key) => {
      entries[key] = value;
    });
    return entries;
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return headers as Record<string, string>;
}

function sanitizeBody(body: BodyInit | null | undefined): unknown {
  if (!body) {
    return null;
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as unknown;
    } catch {
      return "[NON_JSON_BODY]";
    }
  }
  if (body instanceof FormData) {
    return "[FORM_DATA]";
  }
  return "[UNSUPPORTED_BODY]";
}

function parseRetryAfterSeconds(value: string | null) {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return parsed;
  }
  return null;
}

async function apiRequest<T>(path: string, options: RequestInit): Promise<T> {
  const clientRequestId = createClientRequestId();
  const startedAt = performance.now();
  const token = getAccessToken();
  const headers: HeadersInit = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const method = options.method ?? "GET";
  const url = buildUrl(path);

  logInfo("WEB_API_REQ", "API request", {
    client_request_id: clientRequestId,
    method,
    url,
    headers: sanitizeHeaders(headers),
    body: sanitizeBody(options.body),
  });

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const durationMs = Math.round(performance.now() - startedAt);
  const requestId = response.headers.get("X-Request-ID");
  const retryAfterSeconds = parseRetryAfterSeconds(
    response.headers.get("Retry-After"),
  );
  const text = await response.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text) as unknown;
    } catch {
      json = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearAccessToken();
      unauthorizedHandler?.();
    }
    const serverRequestId =
      (json &&
        typeof json === "object" &&
        "error" in json &&
        (json as ApiErrorShape).error.request_id) ||
      requestId ||
      null;
    logError("WEB_API_ERR", "API error", {
      client_request_id: clientRequestId,
      server_request_id: serverRequestId,
      method,
      url,
      status: response.status,
      duration_ms: durationMs,
      error:
        json && typeof json === "object" && "error" in json
          ? (json as ApiErrorShape).error
          : { message: text || "Unexpected error" },
    });
    const parsedError = parseError(
      response.status,
      json,
      requestId,
      clientRequestId,
      retryAfterSeconds,
    );
    const code = parsedError.code?.toUpperCase?.() ?? "";
    const isRateLimit =
      response.status === 429 || code.startsWith("RATE_LIMIT");
    const isLimit = code.startsWith("LIMIT_");
    if (isRateLimit || isLimit) {
      emitMessage({
        id: `limit-${code || response.status}-${parsedError.requestId ?? clientRequestId}`,
        title: isRateLimit ? "Rate limit reached" : "Limit reached",
        body: parsedError.message,
        level: "warning",
      });
    }
    throw parsedError;
  }

  logInfo("WEB_API_RES", "API response", {
    client_request_id: clientRequestId,
    server_request_id: requestId,
    method,
    url,
    status: response.status,
    duration_ms: durationMs,
  });

  return json as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: "GET" });
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}
