import type { Metadata } from "next";
import Image from "next/image";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { Nav } from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Footer";
import { V2_LINKS, gutterStyle, V2_FOOTER_LINKS } from "@/lib/v2-content";

export const metadata: Metadata = {
  title: "About | Crosps",
  description: "Why Jade started Crosps: whole vegetables, cooked gently enough to keep their colour, shape and flavour.",
  robots: { index: false, follow: false },
};

const STORY = [
  "We didn’t start with a crisp.",
  "After a tough reset in 2023, we started eating as close to whole food as we could. And we kept noticing how little the savoury snack aisle had to offer.",
  "The sweet side felt full of possibilities. But whenever we wanted something savoury, we found more of the same: potato crisps, or ingredient lists a long way from what we actually wanted to eat.",
  "Most savoury snacks are still built around potato, grains or starch, with vegetables playing a supporting role. We wanted something simple. Something made from vegetables that still looked and tasted like vegetables.",
  "So we started with the vegetable itself.",
  "That’s how Crosps was born: whole vegetables, cooked gently enough to keep their colour, their shape and their flavour.",
  "We hope you love them as much as we’ve loved bringing them to life.",
  "Made from crops, not compromises.",
];

// V2 About (Figma 1:739): founder story beside a photo.
export default async function V2AboutPage({ searchParams }: { searchParams: Promise<{ gutter?: string }> }) {
  const { gutter } = await searchParams;
  return (
    <div className="bg-white text-ink" style={gutterStyle(gutter)}>
      <Nav tone="dark" links={{ home: V2_LINKS.home, shop: V2_LINKS.shop, about: V2_LINKS.about, faq: V2_LINKS.faq }} />
      <main className="gutter-x grid gap-10 pb-24 pt-8 md:pt-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex max-w-[640px] flex-col gap-6">
          <h1 className="font-sans text-[28px] leading-[1.1] md:text-[32px]">
            Welcome to the world of <SerifAccent>Crosps.</SerifAccent>
          </h1>
          <div className="flex max-w-[543px] flex-col gap-6">
            {STORY.map((p) => (
              <p key={p} className="type-body text-ink-88">
                {p}
              </p>
            ))}
          </div>
          <p className="font-sans text-[18px] italic leading-[1.5] text-ink-88">– Jade, Founder</p>
        </div>
        <div className="relative aspect-[680/649] w-full lg:self-start">
          <Image
            src="/v2/founder.jpg"
            alt="Jade holding packs of Crosps"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </main>
      <Footer links={V2_FOOTER_LINKS} />
    </div>
  );
}
