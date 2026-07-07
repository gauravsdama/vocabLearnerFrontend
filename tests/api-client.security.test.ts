import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const clearAuthStorage = vi.fn();
const emitMessage = vi.fn();
const unauthorizedHandler = vi.fn();

vi.mock("../src/utils/storage", () => ({
  clearAuthStorage,
  getClientSigningKey: () => null,
}));

vi.mock("../src/utils/messageBus", () => ({
  emitMessage,
}));

vi.mock("../src/utils/logger", () => ({
  logInfo: vi.fn(),
  logError: vi.fn(),
}));

vi.mock("../src/api/config", () => ({
  getApiBaseUrl: () => "https://example.com",
  normalizeBaseUrl: (value: string) => value.replace(/\/+$/, ""),
}));

describe("api client security behavior", () => {
  beforeEach(() => {
    vi.resetModules();
    clearAuthStorage.mockReset();
    emitMessage.mockReset();
    unauthorizedHandler.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("clears session state and invokes the unauthorized handler on 401 responses", async () => {
    const response = new Response(
      JSON.stringify({
        error: {
          code: "AUTH_REQUIRED",
          message: "Unauthorized",
          request_id: "req-1",
        },
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "X-Request-ID": "req-1",
        },
      },
    );

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));

    const client = await import("../src/api/client");
    client.setUnauthorizedHandler(unauthorizedHandler);

    await expect(client.apiPost("/users/me", { ok: true })).rejects.toMatchObject({
      status: 401,
      code: "AUTH_REQUIRED",
    });

    expect(clearAuthStorage).toHaveBeenCalledTimes(1);
    expect(unauthorizedHandler).toHaveBeenCalledTimes(1);
  });
});
