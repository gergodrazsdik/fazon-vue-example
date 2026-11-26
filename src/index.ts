// The package entry. `fazon sync` maintains the component exports between the fazon:exports
// markers. Apps import the styles too: `fazon-vue-example/tokens.css` and `fazon-vue-example/style.css`.

// fazon:exports:begin `fazon sync` writes the exports up to fazon:exports:end from the specs; edit outside them.
export { default as Badge } from "./components/badge/Badge.vue";
export { default as Button } from "./components/button/Button.vue";
// fazon:exports:end
