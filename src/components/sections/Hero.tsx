import Image from "next/image";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { HERO_IMAGE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-[480px] h-[min(90vh,900px)] w-full overflow-hidden">
      {/* Background image — change HERO_IMAGE in lib/constants.ts to swap */}
      <Image
        src={HERO_IMAGE}
        alt="Farmer working in a vegetable field"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content pinned to bottom */}
      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 md:px-10 md:pb-24 lg:pb-32">
          <h1 className="text-5xl font-normal leading-[1.1] tracking-tight text-white md:text-7xl lg:text-[96px]">
            Real Vegetables,
            <br />
            Unreal <SerifAccent className="text-white">Crunch.</SerifAccent>
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85 md:text-lg">
            Baked vegetable crisps made from real, whole vegetables.
            No artificial colours, no preservatives — just honest,
            crunchy goodness straight from the ground.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#signup"
              className="inline-flex items-center justify-center border border-white px-6 py-3 text-[16px] font-medium tracking-wide text-white transition-colors duration-200 hover:bg-white/10"
            >
              Sign Me Up
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
