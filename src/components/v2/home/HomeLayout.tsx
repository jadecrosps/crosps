import Image from "next/image";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { Button, TextLink } from "../Button";
import { ProductCard } from "../ProductCard";
import { ReviewCard } from "../ReviewCard";
import { EmailCapture } from "../EmailCapture";
import { MobileCarousel } from "../MobileCarousel";
import { QuickAdd } from "./QuickAdd";
import { STORY_PARAGRAPHS } from "../StorySection";
import { PRODUCTS, REVIEWS, STOCKISTS, type Product } from "@/lib/v2-content";

// Homepage sections laid out after moremud.co, in the Crosps design system.

type Links = { shop: string; about: string; contact: string; product: (slug: string) => string };

// Header row used by every list section: title left, small action right.
function RowHeader({ title, action }: { title: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <h2 className="type-heading text-ink">{title}</h2>
      {action}
    </div>
  );
}

function PillLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="type-label shrink-0 rounded-button border border-ink px-4 py-2 text-ink transition-colors hover:bg-ink hover:text-white"
    >
      {children}
    </a>
  );
}

// Inset hero: the video sits inside the page margins, under a white nav.
export function InsetHero({ links }: { links: Links }) {
  return (
    <section className="gutter-x">
      <div className="relative flex h-[78vh] min-h-[520px] max-h-[780px] flex-col justify-end overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        <div className="relative flex flex-col items-start gap-8 p-6 md:p-12">
          <h1 className="type-display max-w-[720px] text-white">
            A new world of vegetable <SerifAccent>crisps.</SerifAccent>
          </h1>
          <Button href={links.shop} variant="light">
            Shop now
          </Button>
        </div>
      </div>
    </section>
  );
}

// Large centred statement under the hero.
export function IntroStatement() {
  return (
    <section className="gutter-x flex justify-center py-20 md:py-32">
      <div className="flex max-w-[1080px] flex-col items-center gap-6 text-center">
        <p className="type-label text-ink-72">Good taste is personal</p>
        <p className="type-statement text-ink">
          Crosps is made for people who care about the details: what they eat, what they bring to the table, and the world
          they create around them. Three recognisable vegetables. Four ingredients. Each one <SerifAccent>distinct.</SerifAccent>
        </p>
      </div>
    </section>
  );
}

// Product row: header + cards with Learn more / Add to cart.
export function ShopRow({
  links,
  variants,
}: {
  links: Links;
  variants: Record<Product["slug"], { variantId: string | null; available: boolean }>;
}) {
  return (
    <section id="shop" className="gutter-x flex scroll-mt-6 flex-col gap-8 pb-20 md:pb-32">
      <RowHeader title="Shop Crosps" action={<PillLink href={links.shop}>Shop all →</PillLink>} />
      <MobileCarousel label="Products" className="md:grid-cols-3 md:gap-5">
        {PRODUCTS.map((p) => (
          <div key={p.slug} className="flex flex-col gap-4">
            <ProductCard {...p} href={links.product(p.slug)} />
            <QuickAdd href={links.product(p.slug)} {...variants[p.slug]} />
          </div>
        ))}
      </MobileCarousel>
    </section>
  );
}

// Story split (after chimi-online.com): text on white on the left, square photo on the right.
export function StorySplit({ image, alt, href }: { image: string; alt: string; href: string }) {
  return (
    <section className="gutter-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,820px)] lg:gap-16">
      <div className="flex flex-col justify-between gap-10">
        <p className="type-label text-ink">Why Crosps</p>
        <div className="flex max-w-[560px] flex-col items-start gap-8">
          <h2 className="font-sans text-[28px] leading-[1.1] text-ink md:text-[32px]">
            We didn’t want to make another <SerifAccent>crisp.</SerifAccent>
          </h2>
          <div className="flex flex-col gap-4">
            {STORY_PARAGRAPHS.map((p) => (
              <p key={p} className="type-body text-ink-88">
                {p}
              </p>
            ))}
          </div>
          <Button href={href}>Our story</Button>
        </div>
      </div>
      <div className="relative aspect-square w-full">
        <Image src={image} alt={alt} fill sizes="(max-width: 1024px) 100vw, 820px" className="object-cover" />
      </div>
    </section>
  );
}

// Reviews + stockists (where More Mud has its magazine grid).
export function SocialProof({ links }: { links: Links }) {
  return (
    <section className="gutter-x flex flex-col gap-16 pb-20 md:gap-20 md:pb-32">
      <div className="flex flex-col gap-8">
        <RowHeader title="Worth talking about." />
        <MobileCarousel label="Reviews" className="md:grid-cols-[repeat(auto-fit,minmax(0,1fr))] md:gap-2">
          {REVIEWS.map((r) => (
            <div key={r.author} className="flex h-full items-center justify-center bg-cream px-6 py-10">
              <ReviewCard {...r} />
            </div>
          ))}
        </MobileCarousel>
      </div>
      <div className="flex flex-col gap-8">
        <RowHeader title="Found in good places" action={<TextLink href={`${links.contact}?topic=stock`}>Want to stock Crosps?</TextLink>} />
        <div className="flex flex-wrap items-end justify-center gap-10 border-y border-ink-10 py-10 md:gap-14">
          {STOCKISTS.map((s) => (
            <Image key={s.alt} src={s.src} alt={s.alt} width={s.w} height={s.h} className="object-contain" style={{ height: s.h, width: "auto" }} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Centred call to action.
export function CenteredCta({ links }: { links: Links }) {
  return (
    <section className="gutter-x flex flex-col items-center gap-8 pb-20 text-center md:pb-32">
      <h2 className="font-sans text-[32px] leading-[1.1] text-ink md:whitespace-nowrap md:text-[40px]">
        Made from crops, not <SerifAccent>compromises.</SerifAccent>
      </h2>
      <Button href={links.shop}>Shop all</Button>
    </section>
  );
}

// Big image card with the waitlist sign-up over it.
export function WaitlistCard() {
  return (
    <section className="px-5 pb-20 md:px-10 md:pb-32">
      {/* Near full-bleed like moremud.co's image cards: 40px side margins, 1633×737. */}
      <div className="relative flex min-h-[600px] flex-col justify-end overflow-hidden p-6 md:aspect-[1633/737] md:min-h-0 md:p-10">
        <Image
          src="/v2/waitlist-onion-packs.jpg"
          alt="Holding packs of Crosps Onion Chips on a London street"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
        <div className="relative flex max-w-[420px] flex-col gap-6 text-white">
          <div className="flex flex-col gap-2">
            <h2 className="type-display">
              You’ll want in <SerifAccent>early.</SerifAccent>
            </h2>
            <p className="type-body-lg text-white/88">Three vegetables. One first drop. Join the list for early access.</p>
          </div>
          <EmailCapture />
        </div>
      </div>
    </section>
  );
}
