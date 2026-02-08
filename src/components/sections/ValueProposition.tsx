import { SerifAccent } from "@/components/ui/SerifAccent";

export function ValueProposition() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-12 md:gap-20 text-crosps-charcoal">
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.2]">
          What if <span className="underline">vegetables</span> were just as
          addictive satisfying and exciting as every crisp on the shelf?
        </h2>

        <p className="text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.2]">
          With Crosps, <SerifAccent>they are.</SerifAccent>
        </p>
        </div>
      </div>
    </section>
  );
}
