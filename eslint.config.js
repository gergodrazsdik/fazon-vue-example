// ESLint for the component library: Fazon's Vue configuration, which the `lint` check runs on each
// component's files. Add your own rules in objects after it. Inline configuration comments
// (`eslint-disable` and the like) have no effect, and the `lint` check fails them: a check is
// waived only by an exemption in the component's spec.
import { defineConfig } from "eslint/config";
import { fazonVueEslint } from "@fazon/adapter-vue/lint";

export default defineConfig(fazonVueEslint(), {
  // The framework's build that scripts/framework.sh makes (temporary, until git dependencies).
  name: "fazon-vue-example/ignores",
  ignores: [".fazon-framework/"],
});
