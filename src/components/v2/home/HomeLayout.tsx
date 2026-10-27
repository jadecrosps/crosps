import Image from "next/image";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { Button, TextLink } from "../Button";
import { ProductCard } from "../ProductCard";
import { EmailCapture } from "../EmailCapture";
import { MobileCarousel } from "../MobileCarousel";
import { QuickAdd } from "./QuickAdd";
import { STORY_PARAGRAPHS } from "../StorySection";
import { PRODUCTS, STOCKISTS, type Product } from "@/lib/v2-content";

// Homepage sections in the Crosps design system (section flow after pludolabs.com).

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

export function PillLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
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
      <RowHeader title="Shop Crosps" />
      <MobileCarousel label="Products" className="md:grid-cols-3 md:gap-5">
        {PRODUCTS.map((p) => (
          <div key={p.slug} className="flex flex-col gap-4">
            <ProductCard {...p} href={links.product(p.slug)} />
            <QuickAdd href={links.product(p.slug)} {...variants[p.slug]} />
          </div>
        ))}
      </MobileCarousel>
      <Button href={links.shop} className="self-center">
        Shop all
      </Button>
    </section>
  );
}

// Benefits around the pack over a full-width photo (after pludolabs.com "Functionality, at every level").
const BENEFITS = [
  { title: "Only four ingredients", body: "The vegetable, rapeseed oil, tapioca starch and a touch of sea salt." },
  { title: "High in fibre", body: "Up to 27g of fibre per 100g, depending on the flavour." },
  { title: "No added sugar", body: "Any sweetness comes from the vegetable itself." },
  { title: "Plant based & gluten free", body: "A snack the whole table can share." },
];

function BenefitItem({ b }: { b: (typeof BENEFITS)[number] }) {
  return (
    <div className="flex max-w-[240px] flex-col gap-2">
      <p className="type-mono text-ink">{b.title}</p>
      <p className="type-body text-ink-72">{b.body}</p>
    </div>
  );
}

export function BenefitsFeature() {
  return (
    <section className="flex flex-col gap-10 pb-20 md:pb-32">
      <h2 className="gutter-x font-sans text-center text-[32px] leading-[1.1] text-ink md:text-[40px]">
        Made from crops, not <SerifAccent>compromises.</SerifAccent>
      </h2>
      <div className="relative flex justify-center px-5 py-10 md:px-10 md:py-20">
        <Image src="/v2/insta-4.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="relative grid w-full max-w-[1100px] items-center gap-10 bg-white/80 p-8 backdrop-blur-md md:grid-cols-[1fr_minmax(0,320px)_1fr] md:p-12">
          <div className="flex flex-col gap-10 md:gap-24">
            <BenefitItem b={BENEFITS[0]} />
            <BenefitItem b={BENEFITS[1]} />
          </div>
          <div className="relative order-first mx-auto aspect-[4/5] w-[200px] md:order-none md:w-full">
            <Image src="/v2/pack-onion.png" alt="Crosps Onion Chips pack" fill sizes="320px" className="object-contain" />
          </div>
          <div className="flex flex-col gap-10 md:items-end md:gap-24 md:text-right">
            <BenefitItem b={BENEFITS[2]} />
            <BenefitItem b={BENEFITS[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}

// Slow-scrolling strip of photos (after pludolabs.com "Part of the daily routine").
const EVERYDAY = [
  { src: "/v2/hover-tomato.jpg", alt: "Tomato Chips on the go" },
  { src: "/v2/insta-2.jpg", alt: "Crosps on Instagram" },
  { src: "/v2/lifestyle-pack.jpg", alt: "Carrying Crosps" },
  { src: "/v2/hover-onion.jpg", alt: "Onion Chips on the go" },
  { src: "/v2/story.jpg", alt: "A pepper crisp next to a fresh slice of pepper" },
  { src: "/v2/insta-3.jpg", alt: "Crosps on Instagram" },
  { src: "/v2/hover-pepper.jpg", alt: "Pepper Chips on the go" },
];

export function EverydayReel() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 gap-3 pr-3" aria-hidden={hidden || undefined}>
      {EVERYDAY.map((p) => (
        <li key={p.src} className="relative aspect-[3/4] w-[min(300px,62vw)] shrink-0 overflow-hidden">
          <Image src={p.src} alt={hidden ? "" : p.alt} fill sizes="300px" className="object-cover" />
        </li>
      ))}
    </ul>
  );
  return (
    <section className="flex flex-col gap-10 pb-20 md:pb-32">
      <div className="gutter-x flex flex-col items-center gap-2 text-center">
        <h2 className="type-heading text-ink">Part of the everyday</h2>
        <p className="type-body text-ink-72">On the go, at the table, in the bag.</p>
      </div>
      <div className="overflow-hidden motion-reduce:overflow-x-auto">
        <div className="animate-ticker flex w-max hover:[animation-play-state:paused] motion-reduce:animate-none" style={{ animationDuration: "60s" }}>
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}

// Story split (after chimi-online.com): text on white on the left, square photo on the right.
export function StorySplit({ image, alt, href }: { image: string; alt: string; href: string }) {
  return (
    <section className="gutter-x grid gap-10 pb-20 md:pb-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,820px)] lg:gap-16">
      <div className="flex flex-col justify-between gap-10">
        <p className="type-label text-ink">Why Crosps</p>
        <div className="flex max-w-[560px] flex-col items-start gap-8">
          <h2 className="font-sans text-[28px] leading-[1.1] text-ink md:text-[32px]">
            We didn’t want to make another <SerifAccent>crisp.</SerifAccent>
          </h2>
          <div className="flex max-w-[440px] flex-col gap-4">
            {/* The first two paragraphs live on the About page. */}
            {STORY_PARAGRAPHS.slice(2).map((p) => (
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

// Stockist logos (reviews now live in ReviewsMarquee).
export function SocialProof({ links }: { links: Links }) {
  return (
    <section className="gutter-x flex flex-col gap-8 py-20 md:py-32">
      <RowHeader title="Found in good places" action={<TextLink href={`${links.contact}?topic=stock`}>Want to stock Crosps?</TextLink>} />
      <div className="flex flex-wrap items-end justify-center gap-10 border-y border-ink-10 py-10 md:gap-14">
        {STOCKISTS.map((s) => (
          <Image key={s.alt} src={s.src} alt={s.alt} width={s.w} height={s.h} className="object-contain" style={{ height: s.h, width: "auto" }} />
        ))}
      </div>
    </section>
  );
}

// Big image card with the waitlist sign-up over it.
export function WaitlistCard() {
  return (
    <section className="px-5 pb-20 md:px-10 md:pb-32">
      {/* Near full-bleed like moremud.co's image cards: 40px side margins, 1633×737. */}
      <div className="relative flex min-h-[600px] flex-col justify-end overflow-hidden p-6 md:aspect-[1633/737] md:min-h-0 md:p-10 md:pb-16 md:pl-16">
        <Image
          src="/v2/waitlist-onion-packs.jpg"
          alt="Holding packs of Crosps Onion Chips on a London street"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
        <div className="relative flex max-w-[420px] flex-col gap-6 text-white md:max-w-none">
          <div className="flex flex-col gap-2">
            <h2 className="type-display md:whitespace-nowrap">
              You’ll want in <SerifAccent>early.</SerifAccent>
            </h2>
            <p className="type-body-lg text-white/88 md:whitespace-nowrap">Three vegetables. One first drop. Join the list for early access.</p>
          </div>
          <EmailCapture />
        </div>
      </div>
    </section>
  );
}
