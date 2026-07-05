import { PRODUCTS } from "@/lib/constants";
import { ProductCard } from "@/components/ui/ProductCard";
import { SerifAccent } from "@/components/ui/SerifAccent";

export function ProductCards() {
  return (
    <section id="products" className="bg-white pb-24 pt-12 md:pb-36 md:pt-16">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-16 md:gap-20">
        {/* Header: heading left, body right */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col gap-[10px] shrink-0 md:gap-1">
            <h2 className="text-[32px] font-normal leading-[1.2] text-crosps-charcoal md:text-[40px]">
              Every vegetable has its own character.
            </h2>
            <p className="text-[28px] leading-[1.2]">
              <SerifAccent>We simply let it shine.</SerifAccent>
            </p>
          </div>
          <div className="max-w-[557px] text-[16px] font-normal leading-[1.5] text-crosps-charcoal-88 md:text-[18px]">
            <p>
              Made with real vegetables and just four carefully chosen
              ingredients, Crosps proves that exceptional snacking
              doesn&rsquo;t need unnecessary complexity.
            </p>
          </div>
        </div>

        {/* Product cards + CTA */}
        <div className="flex flex-col items-center gap-14 md:gap-[72px]">
          {/* Cards grid */}
          <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-3 md:gap-4">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
