// Vite: the library build (`vite build`: dist/index.js and dist/style.css, with Vue and the
// dependencies left to the app) and the Vue plugin Storybook builds the stories with.
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

export default defineConfig({
  plugins: [vue(), libraryStylesheet()],
  build: {
    lib: { entry: "src/index.ts", formats: ["es"], fileName: "index", cssFileName: "style" },
    rolldownOptions: { external: ["vue", "reka-ui"] },
  },
});
