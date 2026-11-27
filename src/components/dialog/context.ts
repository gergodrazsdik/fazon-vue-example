// What Dialog shares with its parts, beside the context of the Reka UI parts they wrap.
import type { InjectionKey, Ref } from "vue";

export interface DialogContext {
  size: () => "sm" | "md" | "lg";
  /** The attributes given to Dialog, which Content's element takes. */
  forwarded: Readonly<Ref<Record<string, unknown>>>;
  /** How many Descriptions are rendered, so Content never references a missing one. */
  descriptions: Ref<number>;
}

export const dialogKey: InjectionKey<DialogContext> = Symbol("FzDialog");
