import { SerifAccent } from "@/components/ui/SerifAccent";

export function Hero() {
  return (
    <section className="relative min-h-[480px] h-[min(90vh,900px)] w-full overflow-hidden">
      {/* Background video — silent autoplay loop.
          Poster shows immediately while the video loads.
          To swap the video, replace /public/hero.mp4 + /public/hero.webm
          (and /public/hero-poster.jpg for the loading fallback). */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/hero-poster.jpg"
        aria-hidden="true"
      >
        <source src="/hero.webm" type="video/webm" />
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content pinned to bottom */}
      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 md:px-10 md:pb-24 lg:pb-32">
          <h1 className="text-[clamp(2.25rem,6.5vw,3rem)] font-normal leading-[1.1] tracking-tight text-white md:text-6xl lg:text-[72px]">
            Real Vegetables,
            <br />
            Unreal <SerifAccent className="text-white">Crunch.</SerifAccent>
          </h1>

          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/85 md:text-[17px]">
            Whole vegetables, carefully transformed to preserve their
            natural flavour, colour and character, creating a crisp unlike
            anything else on the shelf.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#signup"
              className="inline-flex items-center justify-center border border-white px-6 py-3 text-[16px] font-medium uppercase tracking-wide text-white transition-colors duration-200 hover:bg-white/10"
            >
              Join the Waitlist
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
