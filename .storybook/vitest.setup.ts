// Applies the Storybook preview, with the theme, to the stories the contract tests render.
import { setProjectAnnotations } from "@storybook/vue3-vite";
import { beforeAll } from "vitest";
import preview from "./preview";

const annotations = setProjectAnnotations([preview]);
beforeAll(annotations.beforeAll);
