import Image from "next/image";

export function BrandPhilosophy() {
  return (
    <section className="bg-crosps-offwhite py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src="/farmer.png"
              alt="Growing and caring for real food"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src="/products/onion.png"
              alt="Crosps onion — made from crops"
              fill
              className="object-contain object-center bg-crosps-offwhite"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </div>
        <p className="mt-8 text-center font-serif text-[clamp(1.5rem,3vw,2rem)] italic leading-[1.3] text-crosps-charcoal">
          Made from crops, not compromises.
        </p>
      </div>
    </section>
  );
}
