import type { Metadata } from "next";
import Image from "next/image";
import { CartProvider } from "@/components/v2/cart/CartProvider";
import { Nav } from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Footer";
import { Button } from "@/components/v2/Button";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { V2_FOOTER_LINKS, V2_LINKS } from "@/lib/v2-content";

export const metadata: Metadata = {
  title: "Page not found | Crosps",
  robots: { index: false },
};

// Shown for any address that doesn't exist. Sits outside the V2 layout, so it brings its own cart.
export default function NotFound() {
  return (
    <CartProvider>
      <div className="bg-white text-ink">
        <Nav tone="dark" links={{ home: V2_LINKS.home, shop: V2_LINKS.shop, about: V2_LINKS.about, faq: V2_LINKS.faq }} />
        <main className="gutter-x grid items-center gap-10 pb-24 pt-10 md:pt-14 lg:grid-cols-2 lg:gap-16">
          <div className="flex max-w-[480px] flex-col items-start gap-6">
            <p className="type-mono text-ink-50">404</p>
            <h1 className="font-sans text-[40px] leading-[1.1] md:text-[56px]">
              This page has gone <SerifAccent>missing.</SerifAccent>
            </h1>
            <p className="type-body text-ink-88">
              The link may be old, or the address may have a typo. Our crisps are still where you left them.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={V2_LINKS.shop}>Shop Crosps</Button>
              <Button href={V2_LINKS.home} variant="light" className="border border-ink-10">
                Back to home
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper">
            <Image
              src="/v2/waitlist-onion-packs.jpg"
              alt="Packs of Crosps Onion Chips"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </main>
        <Footer links={V2_FOOTER_LINKS} />
      </div>
    </CartProvider>
  );
}
