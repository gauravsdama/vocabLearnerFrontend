import type { ApiError } from "../api/types";
import { redact } from "./logger";

export type AuthDiagnostic = {
  timestamp: string;
  method: string;
  url: string;
  status?: number;
  code?: string;
  message?: string;
  request_id?: string;
  client_request_id?: string;
};

let lastAuthDiagnostic: AuthDiagnostic | null = null;

export function setLastAuthDiagnostic(
  endpoint: string,
  method: string,
  error: unknown,
) {
  const apiError = error as ApiError;
  const diagnostic: AuthDiagnostic = {
    timestamp: new Date().toISOString(),
    method,
    url: endpoint,
    status: apiError?.status,
    code: apiError?.code,
    message: apiError?.message,
    request_id: apiError?.requestId,
    client_request_id: apiError?.clientRequestId,
  };

  lastAuthDiagnostic = redact(diagnostic) as AuthDiagnostic;
}

export function getLastAuthDiagnostic() {
  return lastAuthDiagnostic;
}

export function clearLastAuthDiagnostic() {
  lastAuthDiagnostic = null;
}
