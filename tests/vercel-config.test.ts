import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Vercel security headers", () => {
  it("sets the required production response headers", () => {
    const config = JSON.parse(readFileSync(resolve(process.cwd(), "vercel.json"), "utf8"));
    const names = new Set(config.headers[0].headers.map((header: { key: string }) => header.key));

    expect(names).toEqual(
      new Set([
        "Content-Security-Policy",
        "Permissions-Policy",
        "Referrer-Policy",
        "Strict-Transport-Security",
        "X-Content-Type-Options",
        "X-Frame-Options",
      ]),
    );
  });
});
