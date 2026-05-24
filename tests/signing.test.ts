import * as assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSignatureHeaders } from "../src/api/signing.js";

describe("web signing", () => {
  it("builds deterministic signature headers", async () => {
    const headers = await buildSignatureHeaders({
      method: "POST",
      url: "https://example.com/api/v1/sentence/submit",
      bodyText: "{\"foo\":\"bar\"}",
      signingKey: "secret-key",
      timestamp: "1700000000",
      nonce: "nonce-123",
    });

    assert.deepEqual(headers, {
      "X-Client-Timestamp": "1700000000",
      "X-Client-Nonce": "nonce-123",
      "X-Client-Signature":
        "3f540ef92173d4ed6b2bda27a7721e536838ae20ce058bdaa98c40bce8480784",
    });
  });
});
