"use client";

import { useEffect, useRef } from "react";

// Moves its children up into place as they scroll through the viewport:
// starts `distance` px lower and faded, settles once it reaches the middle of the screen.
// Stays put for reduced-motion users.
export function ScrollIntoPlace({
  children,
  distance = 120,
  className = "",
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top enters the bottom of the screen, 1 at the middle.
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh / 2)));
      el.style.transform = `translateY(${(1 - progress) * distance}px)`;
      el.style.opacity = String(0.15 + progress * 0.85);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [distance]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
