// Vitest for the components' tests and the contract tests `fazon sync` generates: browser mode in
// Chromium, at the viewport Fazon's verifier renders the stories at.
import vue from "@vitejs/plugin-vue";
import { fazonVitest } from "@fazon/adapter-vue/vitest";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  test: fazonVitest({ components: "src/components" }),
});
