import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractTokenFromAuthLink } from "../src/utils/authLinkTokens.js";

describe("extractTokenFromAuthLink", () => {
  it("reads the token from the normal query string", () => {
    assert.equal(
      extractTokenFromAuthLink({ search: "?token=verify-token-123", hash: "" }),
      "verify-token-123",
    );
  });

  it("reads the token from a bare hash query", () => {
    assert.equal(
      extractTokenFromAuthLink({ search: "", hash: "#token=verify-token-123" }),
      "verify-token-123",
    );
  });

  it("reads the token from a route hash query", () => {
    assert.equal(
      extractTokenFromAuthLink({ search: "", hash: "#/verify-email?token=verify-token-123" }),
      "verify-token-123",
    );
  });

  it("prefers the real query string when both query and hash contain tokens", () => {
    assert.equal(
      extractTokenFromAuthLink({
        search: "?token=query-token",
        hash: "#/verify-email?token=hash-token",
      }),
      "query-token",
    );
  });

  it("returns an empty string when the URL has no token", () => {
    assert.equal(extractTokenFromAuthLink({ search: "", hash: "#/verify-email" }), "");
  });
});
