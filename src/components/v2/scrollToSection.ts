import type { MouseEvent } from "react";

// Links like "/#shop" clicked on the page they point to: scroll to the section ourselves.
// With the "/" → "/v2" rewrite, Next's <Link> re-fetches the page instead of scrolling.
export function scrollToSection(e: MouseEvent<HTMLAnchorElement>) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const url = new URL(e.currentTarget.href);
  if (!url.hash || url.pathname !== window.location.pathname) return;
  const section = document.getElementById(url.hash.slice(1));
  if (!section) return;
  e.preventDefault();
  section.scrollIntoView({ behavior: "smooth" });
  window.history.pushState(null, "", url.hash);
}
