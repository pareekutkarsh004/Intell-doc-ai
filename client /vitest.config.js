import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    // Changed .ts to .js
    setupFiles: ["./src/test/setup.js"], 
    // Updated pattern to include .js and .jsx files
    include: ["src/**/*.{test,spec}.{js,jsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});