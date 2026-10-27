import Image from "next/image";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { Button, TextLink } from "./Button";
import { Nav } from "./Nav";
import { ProductCard } from "./ProductCard";
import { MobileCarousel } from "./MobileCarousel";
import { SectionHeading, Divider } from "./SectionHeading";
import { ReviewCard } from "./ReviewCard";
import { EmailCapture } from "./EmailCapture";
import { IngredientCard, VegetableIngredientCard } from "./IngredientCard";
import { PRODUCTS, STOCKISTS, INGREDIENT_INFO, REVIEWS } from "@/lib/v2-content";

export type HomeLinks = { shop: string; about: string; faq: string; contact: string; product: (slug: string) => string };

// Figma 1:147 layout: full-bleed video, nav on top, headline bottom-left.
export function HomeHero({ links }: { links: HomeLinks }) {
  return (
    <section className="relative flex min-h-[640px] flex-col justify-between overflow-hidden md:h-[834px]">
      {/* Same background video as the current homepage (public/hero.*). */}
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
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative">
        <Nav links={{ home: "/v2", shop: links.shop, about: links.about, faq: links.faq }} />
      </div>
      <div className="gutter-x relative flex flex-col items-start gap-10 pb-14 md:pb-[105px]">
        <div className="flex flex-col gap-3 text-white">
          <h1 className="type-display max-w-[776px]">
            A new world of vegetable <SerifAccent>crisps.</SerifAccent>
          </h1>
          <p className="type-body-lg max-w-[596px]">
            Real vegetables, transformed into light, crisp, deeply savoury slices that keep their natural colour, character
            and flavour.
          </p>
        </div>
        <Button href={links.shop} variant="light">
          Shop now
        </Button>
      </div>
    </section>
  );
}

// Figma 1:164: statement, three product cards, "Shop the collection".
export function ProductRange({ links }: { links: HomeLinks }) {
  return (
    <section id="shop" className="gutter-x flex scroll-mt-6 flex-col items-center gap-14 py-20 md:gap-20 md:py-32">
      <div className="flex max-w-[1016px] flex-col items-center gap-10 text-center">
        <div className="flex flex-col gap-8 md:gap-12">
          <p className="type-statement">Good taste is personal.</p>
          <p className="type-statement">
            Crosps is made for people who care about the details: what they eat, what they bring to the table, and the world
            they create around them.
            <br />
            Three recognisable vegetables. Four ingredients. Each one distinct.
          </p>
        </div>
        <p className="type-statement">
          More than just a <SerifAccent>crisp.</SerifAccent>
        </p>
      </div>
      <MobileCarousel label="Products" className="md:grid-cols-3 md:gap-5">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.slug} {...p} href={links.product(p.slug)} />
        ))}
      </MobileCarousel>
      <Button href={links.shop}>Shop the collection</Button>
    </section>
  );
}

// Figma 1:185
export function QuoteHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="gutter-x py-20 text-center md:py-28">
      <p className="type-serif-xl text-ink">{children}</p>
    </div>
  );
}

// Figma 1:201
export function Stockists({ links }: { links: HomeLinks }) {
  return (
    <section className="gutter-x flex flex-col items-center gap-12 pt-20 md:pt-28">
      <SectionHeading title="Found in good places" subtitle="Find Crosps in some of the best shops." />
      <div className="flex flex-wrap items-end justify-center gap-10 md:gap-14">
        {STOCKISTS.map((s) => (
          <Image key={s.alt} src={s.src} alt={s.alt} width={s.w} height={s.h} className="object-contain" style={{ height: s.h, width: "auto" }} />
        ))}
      </div>
      <TextLink href={`${links.contact}?topic=stock`}>Want to stock Crosps?</TextLink>
      <Divider className="mt-12 md:mt-16" />
    </section>
  );
}

// Figma 2:1066
export function Ingredients({ links }: { links: HomeLinks }) {
  return (
    <section className="gutter-x flex flex-col gap-14 pt-20 md:pt-28">
      {/* Left-aligned, with Shop now on the right like "Want to stock Crosps?" */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          align="left"
          title="The standard"
          subtitle={
            <>
              We put our ingredients where you can see them.
              <br />
              The vegetable is the product. Everything it needs. Nothing it doesn’t.
            </>
          }
        />
        <TextLink href={links.shop}>Shop now</TextLink>
      </div>
      <div className="grid w-full grid-cols-2 gap-x-2 gap-y-6 lg:grid-cols-4">
        <VegetableIngredientCard
          options={[
            { label: "Tomato", image: "/v2/ing-tomato.jpg", colour: "var(--color-tomato)" },
            { label: "Onion", image: "/v2/ing-onion-red.jpg", colour: "var(--color-onion)" },
            {
              label: "Pepper",
              image: "/v2/ing-pepper.jpg",
              crop: { width: 128.33, height: 136.89, left: 0.01, top: -18.45 },
              colour: "var(--color-pepper)",
            },
          ]}
        />
        <IngredientCard
          label="Rapeseed Oil"
          image="/v2/ing-oil.jpg"
          crop={{ width: 175.26, height: 134.94, left: -10.76, top: -17.45 }}
          info={INGREDIENT_INFO.oil}
        />
        <IngredientCard label="Tapioca Starch" image="/v2/ing-tapioca.jpg" info={INGREDIENT_INFO.tapioca} />
        <IngredientCard label="Sea Salt" image="/v2/ing-salt.jpg" overlay="rgba(206,207,212,0.5)" />
      </div>
    </section>
  );
}

// Figma 1:250
export function Reviews() {
  return (
    <section className="gutter-x flex flex-col items-center gap-14 pb-20 md:pb-28">
      <Divider />
      <SectionHeading title="Worth talking about." subtitle="A few thoughts from people who thought so too." />
      <MobileCarousel label="Reviews" className="md:grid-cols-[repeat(auto-fit,minmax(0,322px))] md:justify-center md:gap-6">
        {REVIEWS.map((r) => (
          <ReviewCard key={r.author} {...r} />
        ))}
      </MobileCarousel>
    </section>
  );
}

// Figma 24:1327
export function WaitlistBanner() {
  return (
    <section className="gutter-x pb-20 md:pb-28">
      <div className="grid md:grid-cols-[574px_1fr]">
        <div className="flex flex-col items-center justify-center gap-10 bg-cream px-6 py-20 text-center md:py-[185px]">
          <div className="flex flex-col gap-2">
            <h2 className="type-heading">
              You’ll want in <SerifAccent>early.</SerifAccent>
            </h2>
            <p className="type-body text-ink-88">
              Three vegetables. One first drop.
              <br />
              Join the list for early access.
            </p>
          </div>
          <EmailCapture />
        </div>
        <div className="relative order-first min-h-[320px] md:order-none">
          <Image src="/v2/callout.jpg" alt="Crosps packs on a table" fill sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
