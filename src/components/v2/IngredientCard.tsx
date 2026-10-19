"use client";

import { useState } from "react";
import Image from "next/image";

export function IngredientCard({ label, image }: { label: string; image: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-[426px] overflow-hidden">
        <Image src={image} alt={label} fill sizes="(max-width: 768px) 80vw, 25vw" className="object-cover" />
      </div>
      <p className="font-sans text-[16px] leading-[1.2] text-ink">{label}</p>
    </div>
  );
}

export function VegetableIngredientCard({ options }: { options: { label: string; image: string }[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-[426px] overflow-hidden">
        <Image
          src={options[active].image}
          alt={options[active].label}
          fill
          sizes="(max-width: 768px) 80vw, 25vw"
          className="object-cover"
        />
      </div>
      <div role="tablist" className="flex gap-2">
        {options.map((option, i) => (
          <button
            key={option.label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`cursor-pointer px-0.5 font-sans text-[16px] leading-[1.2] text-ink transition-opacity ${
              i === active ? "border-b-[1.5px] border-tomato" : "border-b-[1.5px] border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
