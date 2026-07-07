import { describe, expect, it } from "vitest";
import {
  clearLastAuthDiagnostic,
  getLastAuthDiagnostic,
  setLastAuthDiagnostic,
} from "../src/utils/diagnostics";

describe("auth diagnostics", () => {
  it("redacts sensitive auth data before exposing diagnostics", () => {
    setLastAuthDiagnostic("/auth/login", "POST", {
      status: 401,
      code: "AUTH_FAILED",
      message: "Bad credentials",
      requestId: "req-1",
      clientRequestId: "client-1",
      authorization: "Bearer secret-token",
      client_signing_key: "secret-signing-key",
    });

    expect(getLastAuthDiagnostic()).toMatchObject({
      method: "POST",
      url: "/auth/login",
      status: 401,
      code: "AUTH_FAILED",
      message: "Bad credentials",
      request_id: "req-1",
      client_request_id: "client-1",
    });

    clearLastAuthDiagnostic();
    expect(getLastAuthDiagnostic()).toBeNull();
  });
});
