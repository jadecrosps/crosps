"use client";

import { useId, useState } from "react";
import { CroppedImage, type Crop } from "./CroppedImage";

const SIZES = "(max-width: 768px) 120vw, 45vw";

// Frame is 334×426 in Figma; keeping the ratio keeps the crops accurate.
function Frame({ children }: { children: React.ReactNode }) {
  return <div className="relative aspect-[334/426] overflow-hidden">{children}</div>;
}

export function IngredientCard({
  label,
  image,
  crop,
  overlay,
  info,
}: {
  label: string;
  image: string;
  crop?: Crop;
  overlay?: string;
  info?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Frame>
        <CroppedImage src={image} alt={label} crop={crop} sizes={SIZES} />
        {overlay && <div className="absolute inset-0" style={{ background: overlay }} />}
      </Frame>
      {info ? <InfoLabel label={label} info={info} /> : <p className="font-sans text-[16px] leading-[1.2] text-ink">{label}</p>}
    </div>
  );
}

// Label with a tooltip: opens on hover or keyboard focus, and toggles on tap.
function InfoLabel({ label, info }: { label: string; info: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="group/info relative w-full md:w-auto md:self-start" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        className="flex cursor-pointer items-center gap-1 font-sans text-[16px] leading-[1.2] text-ink"
      >
        {label}
        <span aria-hidden className="flex size-[11px] items-center justify-center rounded-full border border-ink-50 text-[8px] leading-none text-ink-72">
          i
        </span>
      </button>
      <div
        id={id}
        role="tooltip"
        // Phones: opens in place under the label (tap). From md: floating pop-up on hover/focus.
        className={`type-small z-10 bg-cream p-3 leading-[1.4] text-ink md:absolute md:bottom-full md:left-0 md:mb-2 md:mt-0 md:block md:w-[260px] md:shadow-sm md:transition-opacity md:duration-200 ${
          open
            ? "mt-2 block md:opacity-100"
            : "hidden md:pointer-events-none md:opacity-0 md:group-hover/info:pointer-events-auto md:group-hover/info:opacity-100 md:group-focus-within/info:opacity-100"
        }`}
      >
        {info}
      </div>
    </div>
  );
}

export type VegetableOption = { label: string; image: string; crop?: Crop; colour: string };

export function VegetableIngredientCard({ options }: { options: VegetableOption[] }) {
  const [active, setActive] = useState(0);
  const current = options[active];

  return (
    <div className="flex flex-col gap-2">
      <Frame>
        <CroppedImage key={current.label} src={current.image} alt={current.label} crop={current.crop} sizes={SIZES} />
      </Frame>
      <div role="tablist" className="flex flex-wrap gap-x-2 gap-y-1">
        {options.map((option, i) => (
          <button
            key={option.label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            style={i === active ? { borderColor: option.colour } : undefined}
            className={`cursor-pointer border-b-[1.5px] px-0.5 font-sans text-[14px] leading-[1.2] md:text-[16px] text-ink transition-opacity ${
              i === active ? "" : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
