import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    // The generator is pure math — no DOM needed.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
