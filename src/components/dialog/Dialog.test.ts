// Dialog's behaviour tests (specs/dialog.md): opening and closing, focus, keyboard, the dimmed page,
// scrolling, naming, forwarded attributes and the states the elements reflect.
import { defineComponent, h, ref } from "vue";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-vue";
import Button from "../button/Button.vue";
import Dialog from "./Dialog.vue";
import DialogBody from "./DialogBody.vue";
import DialogClose from "./DialogClose.vue";
import DialogContent from "./DialogContent.vue";
import DialogDescription from "./DialogDescription.vue";
import DialogFooter from "./DialogFooter.vue";
import DialogOverlay from "./DialogOverlay.vue";
import DialogTitle from "./DialogTitle.vue";
import DialogTrigger from "./DialogTrigger.vue";

interface Options {
  props?: Record<string, unknown>;
  description?: boolean;
  asChild?: boolean;
  paragraphs?: number;
  closeLabel?: string;
}

/** Renders a whole dialog; the returned `updates` holds every update:open. */
async function renderDialog(options: Options = {}) {
  const updates: boolean[] = [];
  const open = ref(Boolean(options.props?.open));
  const host = defineComponent({
    setup: () => () =>
      h(
        Dialog,
        {
          ...options.props,
          open: open.value,
          "onUpdate:open": (value: boolean) => {
            updates.push(value);
            open.value = value;
          },
        },
        () => [
          h(DialogTrigger, { asChild: options.asChild }, () =>
            options.asChild ? h(Button, null, () => "Delete project") : "Delete project",
          ),
          h(DialogOverlay),
          h(DialogContent, null, () => [
            h(DialogTitle, null, () => "Delete this project?"),
            options.description === false ? null : h(DialogDescription, null, () => "This can't be undone."),
            h(DialogBody, null, () =>
              Array.from({ length: options.paragraphs ?? 1 }, (_, index) => h("p", `Paragraph ${String(index)}`)),
            ),
            h(DialogFooter, null, () => [h(Button, null, () => "Cancel"), h(Button, null, () => "Delete")]),
            h(DialogClose, options.closeLabel ? { label: options.closeLabel } : null),
          ]),
        ],
      ),
  });
  const screen = await render(host, {});
  return { screen, updates, open };
}

const dialog = () => page.getByRole("dialog");
const part = (name: string) => document.querySelector<HTMLElement>(`[data-part="${name}"]`);

describe("Dialog", () => {
  it("is closed by default, and reflects it", async () => {
    await renderDialog();
    await expect.element(dialog()).not.toBeInTheDocument();
    expect(part("Dialog")?.hasAttribute("data-closed")).toBe(true);
    expect(part("Dialog")?.getAttribute("data-size")).toBe("md");
  });

  it("opens from the trigger, as a modal dialog named and described, with focus on it", async () => {
    const { screen, updates } = await renderDialog();
    await screen.getByRole("button", { name: "Delete project" }).click();
    await expect.element(dialog()).toHaveAccessibleName("Delete this project?");
    await expect.element(dialog()).toHaveAccessibleDescription("This can't be undone.");
    await expect.element(dialog()).toHaveAttribute("aria-modal", "true");
    await expect.element(dialog()).toHaveFocus();
    expect(part("Dialog")?.hasAttribute("data-closed")).toBe(false);
    expect(updates).toEqual([true]);
  });

  it("opens with a Button as the trigger itself", async () => {
    const { screen } = await renderDialog({ asChild: true });
    const trigger = screen.getByRole("button", { name: "Delete project" });
    expect(trigger.element().querySelector("button")).toBeNull();
    await trigger.click();
    await expect.element(dialog()).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect.element(trigger).toHaveFocus();
  });

  it.each([
    ["Escape", async () => userEvent.keyboard("{Escape}")],
    ["the close button", async () => page.getByRole("button", { name: "Close", exact: true }).click()],
    ["a click on the dimmed page", async () => userEvent.click(part("Overlay")!, { position: { x: 5, y: 5 } })],
  ])("closes on %s and returns focus to the trigger", async (_, close) => {
    const { screen, updates } = await renderDialog();
    const trigger = screen.getByRole("button", { name: "Delete project" });
    await trigger.click();
    await expect.element(dialog()).toHaveFocus();
    await close();
    await expect.element(dialog()).not.toBeInTheDocument();
    await expect.element(trigger).toHaveFocus();
    expect(updates).toEqual([true, false]);
  });

  it("stays open on a click inside it, and emits nothing", async () => {
    const { updates } = await renderDialog({ props: { open: true } });
    await page.getByText("Paragraph 0").click();
    await expect.element(dialog()).toBeVisible();
    expect(updates).toEqual([]);
  });

  it("follows the bound open state without emitting", async () => {
    const { open, updates } = await renderDialog();
    open.value = true;
    await expect.element(dialog()).toBeVisible();
    open.value = false;
    await expect.element(dialog()).not.toBeInTheDocument();
    expect(updates).toEqual([]);
  });

  it("keeps focus inside, wrapping with Tab and Shift+Tab", async () => {
    await renderDialog({ props: { open: true } });
    await expect.element(dialog()).toHaveFocus();
    const close = page.getByRole("button", { name: "Close", exact: true });
    const cancel = page.getByRole("button", { name: "Cancel" });
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect.element(close).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(cancel).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect.element(close).toHaveFocus();
  });

  it("stops the page behind from scrolling while open", async () => {
    const { open } = await renderDialog({ props: { open: true } });
    await expect.poll(() => getComputedStyle(document.body).overflow).toBe("hidden");
    open.value = false;
    await expect.poll(() => getComputedStyle(document.body).overflow).not.toBe("hidden");
  });

  it("scrolls a tall body inside the dialog, keeping the title and actions in view", async () => {
    await renderDialog({ props: { open: true }, paragraphs: 60 });
    await expect.poll(() => part("Body")?.getAttribute("tabindex")).toBe("0");
    const content = part("Content")!.getBoundingClientRect();
    expect(content.top).toBeGreaterThanOrEqual(0);
    expect(content.bottom).toBeLessThanOrEqual(window.innerHeight);
    expect(part("Content")!.scrollHeight).toBeLessThanOrEqual(part("Content")!.clientHeight);
    expect(part("Title")!.getBoundingClientRect().top).toBeGreaterThanOrEqual(content.top);
    expect(part("Footer")!.getBoundingClientRect().bottom).toBeLessThanOrEqual(content.bottom);
  });

  it("leaves a short body out of the tab order", async () => {
    await renderDialog({ props: { open: true } });
    await expect.element(dialog()).toBeVisible();
    expect(part("Body")?.hasAttribute("tabindex")).toBe(false);
  });

  it("styles the overlay and content, and widens with size", async () => {
    const widths: number[] = [];
    for (const size of ["sm", "md", "lg"]) {
      const { screen } = await renderDialog({ props: { open: true, size } });
      await expect.element(dialog()).toBeVisible();
      expect(getComputedStyle(part("Overlay")!).position).toBe("fixed");
      expect(getComputedStyle(part("Content")!).position).toBe("fixed");
      widths.push(part("Content")!.getBoundingClientRect().width);
      await screen.unmount();
    }
    expect(widths).toEqual([336, 480, 672]);
  });

  it("has no dangling description without a Description", async () => {
    await renderDialog({ props: { open: true }, description: false });
    await expect.element(dialog()).toBeVisible();
    await expect.element(dialog()).not.toHaveAttribute("aria-describedby");
  });

  it("names the close button from its label, and hides its icon", async () => {
    await renderDialog({ props: { open: true }, closeLabel: "Dismiss" });
    await expect.element(page.getByRole("button", { name: "Dismiss" })).toBeVisible();
    expect(part("Close")?.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("forwards attributes to the content element", async () => {
    await renderDialog({ props: { open: true, id: "confirm", "data-testid": "surface", class: "extra" } });
    await expect.element(dialog()).toHaveAttribute("id", "confirm");
    await expect.element(dialog()).toHaveAttribute("data-testid", "surface");
    await expect.element(dialog()).toHaveClass("extra");
    expect(part("Dialog")?.hasAttribute("id")).toBe(false);
  });
});
