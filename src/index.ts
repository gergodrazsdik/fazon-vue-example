// The package entry. `fazon sync` maintains the component exports between the fazon:exports
// markers. Apps import the styles too: `fazon-vue-example/tokens.css` and `fazon-vue-example/style.css`.

// fazon:exports:begin `fazon sync` writes the exports up to fazon:exports:end from the specs; edit outside them.
export { default as Badge } from "./components/badge/Badge.vue";
export { default as Button } from "./components/button/Button.vue";
export { default as Dialog } from "./components/dialog/Dialog.vue";
export { default as DialogTrigger } from "./components/dialog/DialogTrigger.vue";
export { default as DialogOverlay } from "./components/dialog/DialogOverlay.vue";
export { default as DialogContent } from "./components/dialog/DialogContent.vue";
export { default as DialogTitle } from "./components/dialog/DialogTitle.vue";
export { default as DialogDescription } from "./components/dialog/DialogDescription.vue";
export { default as DialogBody } from "./components/dialog/DialogBody.vue";
export { default as DialogFooter } from "./components/dialog/DialogFooter.vue";
export { default as DialogClose } from "./components/dialog/DialogClose.vue";
export { default as Link } from "./components/link/Link.vue";
// fazon:exports:end
