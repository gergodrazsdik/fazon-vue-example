// The stories' preview: the token set's CSS, the library's styles, and the theme as the `theme`
// global, which sets `data-theme` on the document's root element. `fazon sync` writes the themes
// from the token set.
import { fazonPreview } from "@fazon/adapter-vue/storybook/preview";
import "../src/tokens.css";
import "../src/style.css";
import { defaultTheme, themes } from "./generated/themes";

export default fazonPreview({ themes, defaultTheme });
