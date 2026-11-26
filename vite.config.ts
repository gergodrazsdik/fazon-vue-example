// Vite: the library build (`vite build`: dist/index.js, dist/style.css and the type declarations,
// with Vue and the dependencies left to the app) and the Vue plugin Storybook builds the stories with.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import vue from "@vitejs/plugin-vue";
import { defineConfig, type Plugin } from "vite";

/**
 * Adds the library's stylesheet, which loads the font, to the entry in the build, so dist/style.css
 * holds it with the components' styles. The entry's source, and so its type declarations, import
 * no CSS.
 */
function libraryStylesheet(): Plugin {
  return {
    name: "library-stylesheet",
    apply: "build",
    transform(code, id) {
      return id.endsWith("/src/index.ts") ? `import "./style.css";\n${code}` : undefined;
    },
  };
}

/**
 * Writes the type declarations into dist/ after the library build, with vue-tsc and
 * tsconfig.build.json, so `vite build` alone gives the whole package: Fazon's `package` check runs
 * `vite build` and nothing else. Only the library build: Storybook's build writes elsewhere.
 */
function typeDeclarations(): Plugin {
  let root = "";
  let outDir = "";
  return {
    name: "type-declarations",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      if (outDir !== path.resolve(root, "dist")) return;
      const require = createRequire(path.join(root, "package.json"));
      const manifest = require.resolve("vue-tsc/package.json");
      const { bin } = JSON.parse(readFileSync(manifest, "utf8")) as { bin: Record<string, string> };
      const vueTsc = path.join(path.dirname(manifest), bin["vue-tsc"] ?? "bin/vue-tsc.js");
      execFileSync(process.execPath, [vueTsc, "-p", "tsconfig.build.json"], { cwd: root, stdio: "inherit" });
    },
  };
}

export default defineConfig({
  plugins: [vue(), libraryStylesheet(), typeDeclarations()],
  build: {
    lib: { entry: "src/index.ts", formats: ["es"], fileName: "index", cssFileName: "style" },
    rolldownOptions: { external: ["vue", "reka-ui"] },
  },
});
