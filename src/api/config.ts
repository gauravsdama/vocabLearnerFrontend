export const DEFAULT_DEV_API_BASE_URL = "http://localhost:8000";
export const DEFAULT_PROD_API_BASE_URL =
  "https://vocab-backend-219277558905.us-central1.run.app";

export function getApiBaseUrl(): string {
  const envValue = import.meta.env.VITE_API_BASE_URL;
  if (typeof envValue === "string") {
    return envValue;
  }
  return import.meta.env.DEV
    ? DEFAULT_DEV_API_BASE_URL
    : DEFAULT_PROD_API_BASE_URL;
}

export function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl) {
    return "";
  }
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

