import Image from "next/image";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex flex-col gap-6">
      {/* Image container */}
      <div className="relative flex h-[500px] items-center justify-center overflow-hidden bg-crosps-offwhite">
        <Image
          src={product.imageSrc}
          alt={`${product.name} crisps package`}
          width={223}
          height={280}
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col items-center gap-4 px-2 text-center">
        <h3 className="text-[40px] font-normal leading-[1.2] text-crosps-charcoal">
          {product.name}
        </h3>
        <div className="flex flex-col gap-2">
          <p className="font-serif text-[28px] leading-[1.2] text-crosps-charcoal">
            {product.tagline}
          </p>
          <p className="text-[18px] font-normal leading-[1.5] text-crosps-charcoal-72">
            {product.description}
          </p>
        </div>
      </div>
    </article>
  );
}
