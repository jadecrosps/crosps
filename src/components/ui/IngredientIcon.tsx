import Image from "next/image";
import type { Ingredient } from "@/types";

interface IngredientIconProps {
  ingredient: Ingredient;
}

export function IngredientIcon({ ingredient }: IngredientIconProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Image */}
      <div className="relative h-[280px] w-full max-w-[223px]">
        <Image
          src={ingredient.iconSrc}
          alt={ingredient.name}
          fill
          className="object-contain"
          sizes="223px"
        />
      </div>

      {/* Text */}
      <div className="flex w-full flex-col gap-2 p-6 text-center">
        <p className="font-serif text-[28px] leading-[1.2] text-crosps-charcoal">
          {ingredient.name}
        </p>
        {ingredient.description && (
          <p className="px-2 text-[18px] leading-[1.5] text-crosps-charcoal-88">
            {ingredient.description}
          </p>
        )}
      </div>
    </div>
  );
}
