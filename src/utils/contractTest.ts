import { getApiBaseUrl, normalizeBaseUrl } from "../api/config";

export const REQUIRED_ROUTES = [
  { method: "post", path: "/api/v1/auth/register" },
  { method: "post", path: "/api/v1/auth/login" },
  { method: "get", path: "/api/v1/auth/me" },
  { method: "get", path: "/api/v1/tutorial/status" },
  { method: "post", path: "/api/v1/tutorial/complete" },
  { method: "get", path: "/api/v1/users/me" },
  { method: "patch", path: "/api/v1/users/me" },
  { method: "post", path: "/api/v1/users/me/sms/opt-in" },
  { method: "post", path: "/api/v1/users/me/sms/opt-out" },
  { method: "get", path: "/api/v1/stats/summary" },
  { method: "get", path: "/api/v1/messages" },
  { method: "post", path: "/api/v1/messages/{message_id}/dismiss" },
  { method: "post", path: "/api/v1/feed/start" },
  { method: "post", path: "/api/v1/feed/resume" },
  { method: "get", path: "/api/v1/feed/{feed_session_id}/next" },
  { method: "post", path: "/api/v1/feed/mark_viewed" },
  { method: "post", path: "/api/v1/feed/mark_skipped" },
  { method: "post", path: "/api/v1/feed/end" },
  { method: "post", path: "/api/v1/quiz/submit" },
  { method: "post", path: "/api/v1/sentence/submit" },
  { method: "post", path: "/api/v1/auth/resend-verification" },
  { method: "get", path: "/api/v1/study/progress/list" },
  { method: "patch", path: "/api/v1/study/progress/{word_id}" },
  { method: "post", path: "/api/v1/study/progress/{word_id}/downgrade" },
  { method: "get", path: "/api/v1/study/progress/{word_id}/quiz-attempts" },
];

export function findMissingRoutes(
  paths: Record<string, Record<string, unknown>> | undefined,
) {
  if (!paths) {
    return REQUIRED_ROUTES.map(
      (route) => `${route.method.toUpperCase()} ${route.path}`,
    );
  }

  const missing: string[] = [];
  REQUIRED_ROUTES.forEach((route) => {
    const pathItem = paths[route.path];
    const hasMethod =
      pathItem &&
      typeof pathItem === "object" &&
      route.method in pathItem;
    if (!hasMethod) {
      missing.push(`${route.method.toUpperCase()} ${route.path}`);
    }
  });
  return missing;
}

export async function runContractTest() {
  const normalizedBase = normalizeBaseUrl(getApiBaseUrl());
  const url = normalizedBase ? `${normalizedBase}/openapi.json` : "/openapi.json";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(
        `[contract-test] Failed to fetch openapi.json: ${response.status}`,
      );
      return;
    }

    const data = (await response.json()) as {
      paths?: Record<string, Record<string, unknown>>;
    };

    if (!data.paths) {
      console.warn("[contract-test] Missing paths in openapi.json");
      return;
    }

    const missing = findMissingRoutes(data.paths);
    if (missing.length > 0) {
      console.warn(
        `[contract-test] Missing routes:\n${missing.join("\n")}`,
      );
    }
  } catch (error) {
    console.warn("[contract-test] Failed to run contract test", error);
  }
}
