import { PRODUCTS } from "@/lib/constants";
import { ProductCard } from "@/components/ui/ProductCard";

export function ProductCards() {
  return (
    <section id="products" className="bg-white pb-24 pt-12 md:pb-36 md:pt-16">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-16 md:gap-20">
        {/* Header: heading left, body right */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col gap-3 shrink-0">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-normal leading-[1.2] text-crosps-charcoal">
              Meet the vegetables.
            </h2>
            <p className="max-w-[420px] text-[clamp(1.125rem,2vw,1.375rem)] leading-[1.3] text-crosps-charcoal">
              Every vegetable has its own character. We simply let it shine.
            </p>
          </div>
          <div className="max-w-[557px] text-[16px] font-normal leading-[1.5] text-crosps-charcoal-88 md:text-[18px]">
            <p>
              Each Crosps flavour celebrates the natural taste, colour and
              texture of the vegetable itself. Creating a crisp that&rsquo;s
              lighter, cleaner, and genuinely satisfying.
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
