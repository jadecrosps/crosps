import Image from "next/image";
import Link from "next/link";

export function AboutGoodness() {
  return (
    <section className="bg-crosps-green py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy */}
          <div className="flex flex-col justify-center gap-6">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-normal leading-[1.2] text-white">
              We&apos;re full of goodness.
            </h2>
            <ul className="space-y-3 text-[18px] leading-[1.6] text-white/90">
              <li>A good source of fibre and protein.</li>
              <li>A delicious way to get your 5 a day.</li>
            </ul>
            <Link
              href="/#products"
              className="inline-flex w-fit items-center justify-center border-2 border-white bg-transparent px-6 py-3 text-[16px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-crosps-green"
            >
              Crispy and healthy
            </Link>
          </div>

          {/* Right: image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:min-h-[400px]">
            <Image
              src="/brocolli_car.png"
              alt="Fresh broccoli — real ingredients"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
