import Link from "next/link";

export function AboutCta() {
  return (
    <section className="bg-crosps-offwhite py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-normal leading-[1.2] text-crosps-charcoal">
            Step inside the world of Crosps
          </h2>
          <p className="max-w-[560px] text-[18px] leading-[1.5] text-crosps-charcoal-88">
            Join the community of people who choose real food and real crunch. Follow along for behind-the-scenes, new flavours, and the moments that make Crosps.
          </p>
          <Link
            href="https://www.instagram.com/eatcrosps/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border-2 border-crosps-charcoal bg-transparent px-8 py-4 text-[16px] font-medium uppercase tracking-wide text-crosps-charcoal transition-colors hover:bg-crosps-charcoal hover:text-white"
          >
            Join our community
          </Link>
        </div>
      </div>
    </section>
  );
}
