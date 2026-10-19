"use client";

import { useState } from "react";
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
}: {
  label: string;
  image: string;
  crop?: Crop;
  overlay?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Frame>
        <CroppedImage src={image} alt={label} crop={crop} sizes={SIZES} />
        {overlay && <div className="absolute inset-0" style={{ background: overlay }} />}
      </Frame>
      <p className="font-sans text-[16px] leading-[1.2] text-ink">{label}</p>
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
      <div role="tablist" className="flex gap-2">
        {options.map((option, i) => (
          <button
            key={option.label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            style={i === active ? { borderColor: option.colour } : undefined}
            className={`cursor-pointer border-b-[1.5px] px-0.5 font-sans text-[16px] leading-[1.2] text-ink transition-opacity ${
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
