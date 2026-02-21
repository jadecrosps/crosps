import { PRODUCTS } from "@/lib/constants";
import { ProductCard } from "@/components/ui/ProductCard";
import { SerifAccent } from "@/components/ui/SerifAccent";

export function ProductCards() {
  return (
    <section id="products" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-16 md:gap-20">
        {/* Header: heading left, body right */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col gap-1 shrink-0">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-normal leading-[1.2] text-crosps-charcoal">
              A taste of what&apos;s to come
            </h2>
            <p className="text-[clamp(1rem,2vw,1.5rem)] leading-[1.2]">
              <SerifAccent>
                ....Because not all crisps are created equal.
              </SerifAccent>
            </p>
          </div>
          <div className="max-w-[557px] text-[18px] font-normal leading-[1.5] text-crosps-charcoal-88">
            <p>
              Whole vegetables, vacuum-fried at low temperatures to preserve
              their natural flavour, colour, and nutrients. Creating a crisp
              that&apos;s lighter, cleaner, and genuinely satisfying.
            </p>
            <br />
            <p>
              Each crisp celebrates the character of the vegetable itself,
              elevated into something worth savouring.
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
