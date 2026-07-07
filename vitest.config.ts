import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    css: true,
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    exclude: [
      "tests/feedProgress.test.ts",
      "tests/auth-link-tokens.test.ts",
      "tests/learningTargets.test.ts",
      "tests/messageUtils.test.ts",
      "tests/signing.test.ts",
      "tests/playwright/**",
      ".tmp-test-dist/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
