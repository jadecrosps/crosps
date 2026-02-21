"use client";

import { useState } from "react";
import Link from "next/link";
import { INGREDIENT_TABS, INGREDIENTS_BY_TAB } from "@/lib/constants";
import { IngredientIcon } from "@/components/ui/IngredientIcon";

const DEFAULT_SUBTITLE = "Nothing to hide. Check our SKU's";

interface IngredientsProps {
  /** Override subtitle below the heading (e.g. About: "Nothing to hide. Choose your bliss.") */
  subtitle?: string;
  /** Optional CTA below the grid (e.g. About: { label: "SHOP CROPS", href: "/#products" }) */
  cta?: { label: string; href: string };
}

export function Ingredients({ subtitle = DEFAULT_SUBTITLE, cta }: IngredientsProps) {
  const [activeTab, setActiveTab] = useState<string>(INGREDIENT_TABS[0]);

  const ingredients = INGREDIENTS_BY_TAB[activeTab];

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col items-center gap-10">
        {/* Heading + Tabs */}
        <div className="flex flex-col items-center gap-6">
          {/* Section heading */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-normal leading-[1.2] text-crosps-charcoal">
              Just four ingredients
            </h2>
            <p className="text-[18px] leading-[1.5] text-crosps-charcoal-88">
              {subtitle}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center">
            {INGREDIENT_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex w-[90px] cursor-pointer items-center justify-center gap-2 px-3 py-2 text-[16px] leading-[1.5] text-crosps-charcoal transition-colors"
              >
                <span
                  className={`size-2 shrink-0 rounded-full transition-opacity ${
                    activeTab === tab
                      ? "bg-product-tomato opacity-100"
                      : "opacity-0"
                  }`}
                />
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredient cards: stack on mobile, 2×2 grid on sm, single row on lg */}
        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ingredients.map((ingredient) => (
            <IngredientIcon key={ingredient.name} ingredient={ingredient} />
          ))}
        </div>

        {cta && (
          <div className="flex justify-center">
            <Link
              href={cta.href}
              className="inline-flex items-center justify-center bg-crosps-charcoal px-8 py-4 text-[16px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-crosps-charcoal/90"
            >
              {cta.label}
            </Link>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
