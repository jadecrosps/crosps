import Image from "next/image";

export function HowItBegan() {
  return (
    <section className="bg-crosps-offwhite py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: portrait image */}
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src="/farmer.png"
              alt="Fresh produce and natural ingredients"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right: copy + illustration block + second image */}
          <div className="flex flex-col justify-center gap-8">
            <div>
              <h2 className="mb-4 font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] font-normal leading-[1.2] text-crosps-charcoal">
                How it began
              </h2>
              <div className="space-y-4 text-[18px] leading-[1.6] text-crosps-charcoal-88">
                <p>
                  A change in how we ate led to a change in how we snack. We wanted something simple, natural, and full of flavour — so we made it ourselves.
                </p>
                <p>
                  Crosps started with a commitment to real ingredients and a belief that vegetables deserve to be the star. No compromises, no fillers — just clean, nutritious, elevated vegetables you can feel good about.
                </p>
              </div>
            </div>

            {/* Second image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src="/brocolli_car.png"
                alt="Real ingredients, real flavour"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
