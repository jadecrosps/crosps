import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/lib/constants";

const FEATURED = [PRODUCTS[0], PRODUCTS[2]]; // Onion, Pepper

export function YouMightAlsoLike() {
  return (
    <section className="bg-crosps-offwhite py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[25%_1fr] lg:gap-16">
          {/* Left: heading + copy + CTA (25% width) */}
          <div className="flex flex-col justify-center">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-normal leading-[1.2] text-crosps-charcoal">
              You might also like
            </h2>
            <p className="mt-2 text-[18px] leading-[1.5] text-crosps-charcoal-88">
              Need something to sink your teeth into?
            </p>
            <p className="mt-4 text-[16px] leading-[1.6] text-crosps-charcoal-72">
              Our crisps are made with the same care and real ingredients across every flavour. Find your favourite.
            </p>
            <Link
              href="/#products"
              className="mt-8 inline-flex w-fit items-center justify-center bg-crosps-charcoal px-8 py-4 text-[16px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-crosps-charcoal/90"
            >
              Shop all crops
            </Link>
          </div>

          {/* Right: 2 product cards — fill available space */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 min-w-0">
            {FEATURED.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
