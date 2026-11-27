// Link's behaviour tests (specs/link.md): a native link with a destination, activation by pointer
// and Enter, the external link's new tab, icon and announcement, underlines, wrapping, and
// forwarded attributes.
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-vue";
import Link from "./Link.vue";

/** Renders a Link with a label; extra props that Link doesn't declare are forwarded. */
function renderLink(props: Record<string, unknown> = {}) {
  return render(Link, {
    props: { href: "/releases", ...props },
    slots: { default: () => "Release notes" },
  });
}

/** A click listener that keeps the test page from navigating. */
const stay = () => vi.fn((event: Event) => event.preventDefault());

describe("Link", () => {
  it("renders a native link to its destination, named by its text, with its defaults", async () => {
    const screen = await renderLink();
    const link = screen.getByRole("link", { name: "Release notes", exact: true });
    await expect.element(link).toHaveAttribute("href", "/releases");
    await expect.element(link).toHaveAttribute("data-part", "Link");
    await expect.element(link).toHaveAttribute("data-variant", "default");
    await expect.element(link).not.toHaveAttribute("target");
    await expect.element(link).not.toHaveAttribute("rel");
    const element = link.element();
    expect(element.tagName).toBe("A");
    expect(element.querySelector("svg")).toBeNull();
  });

  it("activates with a pointer click and with Enter, not with Space", async () => {
    const onClick = stay();
    const screen = await renderLink({ onClick });
    const link = screen.getByRole("link");
    await link.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    (link.element() as HTMLElement).focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(2);
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("shows a focus ring when focused from the keyboard", async () => {
    const screen = await renderLink();
    const link = screen.getByRole("link").element();
    await userEvent.tab();
    expect(document.activeElement).toBe(link);
    expect(getComputedStyle(link).outlineStyle).toBe("solid");
  });

  it("opens an external link in a new tab, with a decorative icon, and says so", async () => {
    const screen = await renderLink({ href: "https://vuejs.org", external: true });
    const link = screen.getByRole("link", { name: /^Release notes\s+\(opens in a new tab\)$/ });
    await expect.element(link).toHaveAttribute("target", "_blank");
    await expect.element(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.element().querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("underlines default and subtle links always, and a standalone link on focus", async () => {
    for (const variant of ["default", "subtle"]) {
      const screen = await renderLink({ variant });
      const link = screen.getByRole("link").element();
      expect(getComputedStyle(link).textDecorationLine).toBe("underline");
      await screen.unmount();
    }
    const screen = await renderLink({ variant: "standalone" });
    const link = screen.getByRole("link").element();
    await userEvent.unhover(screen.getByRole("link"));
    expect(getComputedStyle(link).textDecorationLine).toBe("none");
    await userEvent.tab();
    expect(getComputedStyle(link).textDecorationLine).toBe("underline");
  });

  it("underlines a standalone link on hover", async () => {
    const screen = await renderLink({ variant: "standalone" });
    const link = screen.getByRole("link");
    await link.hover();
    expect(getComputedStyle(link.element()).textDecorationLine).toBe("underline");
  });

  it("wraps a long label instead of clipping it", async () => {
    const container = document.createElement("div");
    container.style.width = "160px";
    document.body.append(container);
    try {
      const screen = await render(Link, {
        props: { href: "/guide" },
        slots: { default: () => "Read the full migration guide for every component in the library" },
        container,
      });
      const link = screen.getByRole("link").element();
      expect(link.getClientRects().length).toBeGreaterThan(1);
      expect(container.scrollWidth).toBeLessThanOrEqual(container.clientWidth);
    } finally {
      container.remove();
    }
  });

  it("keeps its icon and hidden text within its box, which has no block padding", async () => {
    const screen = await renderLink({ external: true });
    const link = screen.getByRole("link").element();
    const outer = link.getBoundingClientRect();
    expect(getComputedStyle(link).paddingBlockStart).toBe("0px");
    expect(getComputedStyle(link).paddingBlockEnd).toBe("0px");
    for (const child of link.querySelectorAll(":scope > *")) {
      const inner = child.getBoundingClientRect();
      expect(inner.left).toBeGreaterThanOrEqual(outer.left);
      expect(inner.right).toBeLessThanOrEqual(outer.right);
      expect(inner.top).toBeGreaterThanOrEqual(outer.top);
      expect(inner.bottom).toBeLessThanOrEqual(outer.bottom);
    }
  });

  it("forwards attributes to the link element", async () => {
    const screen = await renderLink({ id: "notes", class: "extra", target: "docs", rel: "help" });
    const link = screen.getByRole("link");
    await expect.element(link).toHaveAttribute("id", "notes");
    await expect.element(link).toHaveClass("extra");
    await expect.element(link).toHaveAttribute("target", "docs");
    await expect.element(link).toHaveAttribute("rel", "help");
  });
});
