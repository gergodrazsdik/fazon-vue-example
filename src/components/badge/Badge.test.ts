// Badge's behaviour tests (specs/badge.md): a static label with a tone and a size, a decorative
// icon, no interaction, wrapping, and forwarded attributes.
import { h } from "vue";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-vue";
import Badge from "./Badge.vue";

/** Renders a Badge with a label and the given props. */
function renderBadge(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  return render(Badge, { props, slots: { default: () => "Draft", ...slots } });
}

/** The badge's root element in a rendered container. */
function rootOf(container: Element): HTMLElement {
  return container.querySelector<HTMLElement>("[data-part=Badge]")!;
}

const icon = () => h("svg", { "data-testid": "icon", viewBox: "0 0 24 24" });

describe("Badge", () => {
  it("shows its label, with its defaults and no role of its own", async () => {
    const screen = await renderBadge();
    await expect.element(screen.getByText("Draft")).toBeVisible();
    const root = rootOf(screen.container);
    expect(root.tagName).toBe("SPAN");
    expect(root.getAttribute("data-tone")).toBe("neutral");
    expect(root.getAttribute("data-size")).toBe("md");
    expect(root.hasAttribute("role")).toBe(false);
    expect(root.textContent?.trim()).toBe("Draft");
  });

  it("reflects the tone and the size", async () => {
    const screen = await renderBadge({ tone: "danger", size: "sm" });
    const root = rootOf(screen.container);
    expect(root.getAttribute("data-tone")).toBe("danger");
    expect(root.getAttribute("data-size")).toBe("sm");
  });

  it("is not interactive: it takes no focus", async () => {
    const screen = await renderBadge();
    const root = rootOf(screen.container);
    expect(root.hasAttribute("tabindex")).toBe(false);
    await userEvent.tab();
    expect(root.contains(document.activeElement)).toBe(false);
    root.focus();
    expect(document.activeElement).not.toBe(root);
  });

  it("renders no icon box without an icon", async () => {
    const screen = await renderBadge();
    expect(rootOf(screen.container).querySelector("[aria-hidden]")).toBeNull();
  });

  it("shows the icon before the label, hidden from assistive technology", async () => {
    const screen = await renderBadge({}, { icon });
    const root = rootOf(screen.container);
    const wrapper = root.querySelector("[data-testid=icon]")?.closest("[aria-hidden=true]");
    expect(wrapper).not.toBeNull();
    expect(root.firstElementChild).toBe(wrapper);
  });

  it("wraps a long label and never clips it, with the icon centred on the first line", async () => {
    const container = document.createElement("div");
    container.style.width = "120px";
    document.body.append(container);
    try {
      await render(Badge, {
        slots: { default: () => "Waiting for review by the design team", icon },
        container,
      });
      const root = rootOf(container);
      const text = root.lastElementChild!;
      const range = document.createRange();
      range.selectNodeContents(text);
      const lines = range.getClientRects();
      expect(lines.length).toBeGreaterThan(1);
      expect(root.getBoundingClientRect().width).toBeLessThanOrEqual(120);
      expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
      expect(root.scrollHeight).toBeLessThanOrEqual(root.clientHeight);

      const glyph = root.querySelector("[data-testid=icon]")!.getBoundingClientRect();
      const first = lines[0]!;
      const offset = glyph.top + glyph.height / 2 - (first.top + first.height / 2);
      expect(Math.abs(offset)).toBeLessThanOrEqual(1.5);
    } finally {
      container.remove();
    }
  });

  it("forwards attributes to the root element", async () => {
    const screen = await render(Badge, {
      attrs: { id: "status", title: "Status", class: "extra" },
      slots: { default: () => "Beta" },
    });
    const root = rootOf(screen.container);
    expect(root.id).toBe("status");
    expect(root.title).toBe("Status");
    expect(root.classList.contains("extra")).toBe(true);
  });
});
