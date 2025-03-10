import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    env: {
      BASE_URL: "https://api.example.com",
      APP_URL: "https://app.example.com",
      AUTH_SECRET: "8sj7XoGL8pzM3kjKb2mdrLzUPncCRLjD",
    },
    globalSetup: ["test/globalSetup.ts", "test/globalTeardown.ts"],
    setupFiles: ["test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
      include: ["src/**/*"],
    },
  },
});
