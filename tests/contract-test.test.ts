import { describe, expect, it } from "vitest";
import { REQUIRED_ROUTES, findMissingRoutes } from "../src/utils/contractTest";

describe("OpenAPI contract coverage", () => {
  it("fails when required routes are missing", () => {
    const missing = findMissingRoutes({
      "/api/v1/auth/register": { post: {} },
    });

    expect(missing).toContain("POST /api/v1/auth/login");
  });

  it("passes when all required routes are present", () => {
    const paths = REQUIRED_ROUTES.reduce<Record<string, Record<string, unknown>>>(
      (acc, route) => {
        acc[route.path] = {
          ...(acc[route.path] ?? {}),
          [route.method]: {},
        };
        return acc;
      },
      {},
    );

    expect(findMissingRoutes(paths)).toEqual([]);
  });
});
