import Image from "next/image";
import { FEATURES } from "@/lib/constants";
import { FeatureItem } from "@/components/ui/FeatureItem";
import { SerifAccent } from "@/components/ui/SerifAccent";

export function Features() {
  return (
    <section id="story" className="bg-white pt-16 pb-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-12">
          {/* Centered heading area */}
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.2] text-crosps-charcoal">
              Real vegetables.{" "}
              <SerifAccent>Re-imagined.</SerifAccent>
            </h2>
            <div className="max-w-[900px] text-[18px] leading-[1.5] text-crosps-charcoal-88">
              <p>
                Crosps is a premium vegetable crisp brand giving vegetables the
                comeback they deserve. Bold, flavour-forward snacks made with
                care and intention.
              </p>
            </div>
          </div>

          {/* Image + Text two-column layout */}
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
            {/* Left: farmer image */}
            <div className="relative aspect-[680/649] w-full shrink-0 overflow-hidden lg:w-[50%]">
              <Image
                src="/farmer.png"
                alt="Farmer working in a greenhouse"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Right: feature items with dividers */}
            <div className="flex flex-col justify-between gap-0 lg:flex-1">
              {FEATURES.map((feature, i) => (
                <div key={feature.titleAccent}>
                  <FeatureItem feature={feature} />
                  {i < FEATURES.length - 1 && (
                    <div className="my-6 h-px w-full bg-crosps-charcoal-15 lg:my-8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
