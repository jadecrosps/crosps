import { Children } from "react";

// Swipe row on phones (one card plus a peek of the next), regular grid from md up.
// Pass the md+ grid classes via `className`, e.g. "md:grid-cols-3 md:gap-5".
export function MobileCarousel({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      role={label ? "region" : undefined}
      aria-label={label}
      className={`scrollbar-hide -mx-5 flex w-auto self-stretch snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto px-5 md:mx-0 md:grid md:w-full md:overflow-visible md:px-0 ${className}`}
    >
      {Children.map(children, (child) =>
        child ? <div className="w-[82%] shrink-0 snap-start md:w-auto">{child}</div> : null,
      )}
    </div>
  );
}
