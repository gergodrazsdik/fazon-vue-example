// Storybook for the stories `fazon sync` generates in each component's generated/ directory.
import type { StorybookConfig } from "@storybook/vue3-vite";
import { fazonStorybook } from "@fazon/adapter-vue/storybook";

const config: StorybookConfig = fazonStorybook({
  components: "src/components",
  icons: "lucide",
});
export default config;
