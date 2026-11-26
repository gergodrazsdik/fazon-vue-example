// Button's behaviour tests (specs/button.md): activation, disabled, loading, the focus method,
// forwarded attributes, and the states the element reflects.
import { defineComponent, h, ref } from "vue";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-vue";
import Button from "./Button.vue";

/** Renders a Button with a label and the given props. */
function renderButton(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  return render(Button, { props, slots: { default: () => "Save changes", ...slots } });
}

describe("Button", () => {
  it("renders a native button named by its label, with its defaults", async () => {
    const screen = await renderButton();
    const button = screen.getByRole("button", { name: "Save changes" });
    await expect.element(button).toHaveAttribute("data-part", "Button");
    await expect.element(button).toHaveAttribute("type", "button");
    await expect.element(button).toHaveAttribute("data-variant", "primary");
    await expect.element(button).toHaveAttribute("data-size", "md");
    await expect.element(button).toBeEnabled();
    await expect.element(button).not.toHaveAttribute("aria-busy");
    await expect.element(button).not.toHaveAttribute("data-disabled");
  });

  it("emits click on a pointer click, Enter and Space", async () => {
    const screen = await renderButton();
    const button = screen.getByRole("button");
    await button.click();
    (button.element() as HTMLElement).focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(screen.emitted("click")).toHaveLength(3);
  });

  it("sets the native type", async () => {
    const screen = await renderButton({ type: "submit" });
    await expect.element(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("while disabled, blocks activation, leaves the tab order and reflects the state", async () => {
    const screen = await renderButton({ disabled: true });
    const button = screen.getByRole("button");
    await expect.element(button).toBeDisabled();
    await expect.element(button).toHaveAttribute("data-disabled", "");
    await button.click({ force: true });
    expect(screen.emitted("click")).toBeUndefined();
    // A disabled button can't take focus, so it isn't in the tab order.
    (button.element() as HTMLElement).focus();
    expect(document.activeElement).not.toBe(button.element());
  });

  it("while loading, shows a spinner in place of the icon, keeps the label and focus, and blocks activation", async () => {
    const screen = await renderButton(
      { loading: true },
      { icon: () => h("svg", { "data-testid": "icon" }) },
    );
    const button = screen.getByRole("button", { name: "Save changes" });
    await expect.element(button).toHaveAttribute("aria-busy", "true");
    await expect.element(button).toHaveAttribute("aria-disabled", "true");
    await expect.element(button).toHaveAttribute("data-loading", "");
    // aria-disabled, so Playwright counts it as disabled; the native attribute stays off to keep focus.
    const element = button.element() as HTMLButtonElement;
    expect(element.disabled).toBe(false);
    expect(element.querySelector(".spinner")).not.toBeNull();
    expect(element.querySelector("[data-testid=icon]")).toBeNull();

    element.focus();
    expect(document.activeElement).toBe(element);
    await button.click({ force: true });
    await userEvent.keyboard("{Enter}");
    expect(screen.emitted("click")).toBeUndefined();
  });

  it("while loading, doesn't submit its form", async () => {
    let submitted = 0;
    const form = document.createElement("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitted += 1;
    });
    document.body.append(form);
    try {
      const screen = await render(Button, {
        props: { type: "submit", loading: true },
        slots: { default: () => "Send" },
        container: form,
      });
      await screen.getByRole("button").click({ force: true });
      expect(submitted).toBe(0);
      await screen.rerender({ loading: false });
      await screen.getByRole("button").click();
      expect(submitted).toBe(1);
    } finally {
      form.remove();
    }
  });

  it("hides the icon from assistive technology", async () => {
    const screen = await renderButton({}, { icon: () => h("svg", { "data-testid": "icon" }) });
    const icon = (screen.getByRole("button").element() as HTMLElement).querySelector("[data-testid=icon]");
    expect(icon?.closest("[aria-hidden=true]")).not.toBeNull();
  });

  it("moves focus to the button with focus()", async () => {
    const instance = ref<InstanceType<typeof Button>>();
    const host = defineComponent({ render: () => h(Button, { ref: instance }, () => "Save") });
    const screen = await render(host, {});
    const button = screen.getByRole("button").element();
    expect(document.activeElement).not.toBe(button);
    instance.value?.focus();
    expect(document.activeElement).toBe(button);
  });

  it("forwards attributes to the button element", async () => {
    const screen = await render(Button, {
      attrs: { id: "save", "aria-describedby": "hint", class: "extra" },
      slots: { default: () => "Save" },
    });
    const button = screen.getByRole("button");
    await expect.element(button).toHaveAttribute("id", "save");
    await expect.element(button).toHaveAttribute("aria-describedby", "hint");
    await expect.element(button).toHaveClass("extra");
  });
});
