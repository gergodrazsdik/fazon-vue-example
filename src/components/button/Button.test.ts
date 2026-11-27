// Button's behaviour tests (specs/button.md): activation by pointer and keyboard, disabled and
// loading, form types, the spinner in the icon's place, wrapping, focus() and forwarded attributes.
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-vue";
import { h } from "vue";
import Button from "./Button.vue";

const label = () => "Save changes";
const icon = () => h("svg", { "data-testid": "icon", viewBox: "0 0 24 24" });

function renderButton(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  return render(Button, { props, slots: { default: label, ...slots } });
}

/** A button inside a form, and a spy for the form's submissions. */
async function renderInForm(props: Record<string, unknown>) {
  const onSubmit = vi.fn((event: Event) => event.preventDefault());
  const screen = await render({
    render: () => h("form", { onSubmit }, [h("input", { "aria-label": "Name" }), h(Button, props, { default: label })]),
  });
  return { screen, onSubmit };
}

/**
 * A button between two other buttons, with focus on the one before it, so Tab starts from a known
 * place whatever earlier tests left focused.
 */
async function renderBetween(props: Record<string, unknown>) {
  const onClick = vi.fn();
  const screen = await render({
    render: () =>
      h("div", [
        h("button", { type: "button" }, "Before"),
        h(Button, { ...props, onClick }, { default: label }),
        h("button", { type: "button" }, "After"),
      ]),
  });
  const element = (name: string) => screen.getByRole("button", { name, exact: true }).element() as HTMLElement;
  element("Before").focus();
  return { screen, onClick, element };
}

describe("Button", () => {
  it("renders a native button named by its label, with its defaults", async () => {
    const screen = await renderButton();
    const button = screen.getByRole("button", { name: "Save changes", exact: true });
    await expect.element(button).toHaveAttribute("data-part", "Button");
    await expect.element(button).toHaveAttribute("type", "button");
    await expect.element(button).toHaveAttribute("data-variant", "primary");
    await expect.element(button).toHaveAttribute("data-size", "md");
    for (const name of ["disabled", "data-disabled", "data-loading", "aria-busy", "aria-disabled"]) {
      await expect.element(button).not.toHaveAttribute(name);
    }
  });

  it("emits click once for a pointer click, Enter and Space", async () => {
    const screen = await renderButton();
    await screen.getByRole("button").click();
    expect(screen.emitted("click")).toHaveLength(1);
    await userEvent.keyboard("{Enter}");
    expect(screen.emitted("click")).toHaveLength(2);
    await userEvent.keyboard(" ");
    expect(screen.emitted("click")).toHaveLength(3);
  });

  it("blocks activation and leaves the tab order while disabled", async () => {
    const { screen, onClick, element } = await renderBetween({ disabled: true });
    const button = screen.getByRole("button", { name: "Save changes", exact: true });
    await expect.element(button).toBeDisabled();
    await expect.element(button).toHaveAttribute("data-disabled", "");
    await button.click({ force: true });
    element("Before").focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(element("After"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("stays focusable while loading, but blocks activation", async () => {
    const { screen, onClick } = await renderBetween({ loading: true });
    const button = screen.getByRole("button", { name: "Save changes", exact: true });
    await expect.element(button).toHaveAttribute("data-loading", "");
    await expect.element(button).toHaveAttribute("aria-busy", "true");
    await expect.element(button).toHaveAttribute("aria-disabled", "true");
    await expect.element(button).not.toHaveAttribute("disabled");
    await userEvent.tab();
    expect(document.activeElement).toBe(button.element());
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await button.click({ force: true });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps its focus when loading starts", async () => {
    const screen = await renderButton();
    const button = screen.getByRole("button").element() as HTMLButtonElement;
    button.focus();
    await screen.rerender({ loading: true });
    expect(document.activeElement).toBe(button);
  });

  it("shows the spinner in the icon's place without moving the label", async () => {
    const screen = await renderButton({}, { icon });
    const button = screen.getByRole("button").element();
    const text = () => button.querySelector(".label")!.getBoundingClientRect();
    const before = text();
    await expect.element(screen.getByTestId("icon")).toBeInTheDocument();
    await screen.rerender({ loading: true });
    await expect.element(screen.getByTestId("icon")).not.toBeInTheDocument();
    expect(button.querySelector(".spinner")).not.toBeNull();
    expect(button.querySelector(".icon")?.getAttribute("aria-hidden")).toBe("true");
    expect(text().x).toBe(before.x);
    expect(text().width).toBe(before.width);
  });

  it("submits its form with type submit, also by Enter in a field", async () => {
    const { screen, onSubmit } = await renderInForm({ type: "submit" });
    await screen.getByRole("button").click();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    await screen.getByRole("textbox").click();
    await userEvent.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it("does not submit its form while loading", async () => {
    const { screen, onSubmit } = await renderInForm({ type: "submit", loading: true });
    await screen.getByRole("button").click({ force: true });
    await screen.getByRole("textbox").click();
    await userEvent.keyboard("{Enter}");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("moves focus to the button with focus()", async () => {
    let exposed: { focus: () => void } | null = null;
    const screen = await render({
      render: () => h(Button, { ref: (value: unknown) => (exposed = value as typeof exposed) }, { default: label }),
    });
    exposed!.focus();
    expect(document.activeElement).toBe(screen.getByRole("button").element());
  });

  it("wraps a long label instead of clipping it", async () => {
    const container = document.createElement("div");
    container.style.width = "160px";
    document.body.append(container);
    try {
      const screen = await render(Button, {
        slots: { default: () => "Save changes and notify every member of the workspace" },
        container,
      });
      const button = screen.getByRole("button").element();
      expect(button.getBoundingClientRect().width).toBeLessThanOrEqual(160);
      expect(button.scrollWidth).toBeLessThanOrEqual(button.clientWidth);
      expect(button.scrollHeight).toBeLessThanOrEqual(button.clientHeight);
    } finally {
      container.remove();
    }
  });

  it("forwards attributes to the button element", async () => {
    const screen = await renderButton({ id: "save", class: "extra", name: "intent" });
    const button = screen.getByRole("button");
    await expect.element(button).toHaveAttribute("id", "save");
    await expect.element(button).toHaveAttribute("name", "intent");
    await expect.element(button).toHaveClass("extra");
  });
});
