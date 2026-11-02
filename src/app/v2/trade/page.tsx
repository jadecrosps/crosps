import type { Metadata } from "next";
import Image from "next/image";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { Nav } from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Footer";
import { Button } from "@/components/v2/Button";
import { ContactForm } from "@/components/v2/ContactForm";
import { withAllergens } from "@/components/v2/Allergens";
import { getTradeSession, type TradeSession } from "@/lib/trade-auth";
import { getTradeVariants } from "@/lib/trade";
import { ReviewsMarquee } from "@/components/v2/ReviewsMarquee";
import { PRODUCTS, ALLERGEN_NOTE, V2_FOOTER_LINKS, V2_LINKS, gutterStyle } from "@/lib/v2-content";
import { TradeLogin, TradeLogout } from "./TradeLogin";
import { TradeBasket } from "./TradeBasket";

export const metadata: Metadata = {
  title: "Trade | Crosps",
  description: "Stock Crosps: vegetable crisps in shelf-ready cases for shops, delis and cafés.",
  robots: { index: false, follow: false },
};

const REASONS = [
  { title: "Shelf-ready cases", body: "8 × 30g bags in a shelf-ready case. Open it, put it out, sell." },
  { title: "Four ingredients", body: "The vegetable itself, rapeseed oil, tapioca starch and a touch of sea salt. 88–90% real vegetables." },
  { title: "Made to be noticed", body: "Three recognisable vegetables in bright, photographic packs that stand out on shelf." },
];

const FIBRE: Record<string, string> = { pepper: "16g", onion: "27g", tomato: "14g" };

// Rows of label over value, styled like the sell sheet.
function Specs({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="border-t border-ink-10">
      {rows.map(([k, v]) => (
        <div key={k} className="flex flex-col gap-1 border-b border-ink-10 py-3">
          <dt className="type-label text-ink-72">{k}</dt>
          <dd className="type-body text-ink">{withAllergens(v)}</dd>
        </div>
      ))}
    </dl>
  );
}

// What an approved stockist sees: their account and order form, not the pitch.
async function TradeAccount({ session }: { session: TradeSession }) {
  const variants = await getTradeVariants();
  const prices = Object.fromEntries(Object.entries(variants).map(([k, v]) => [k, v.price]));
  return (
    <main className="flex flex-col gap-12 pb-20 pt-10 md:gap-16 md:pb-32 md:pt-14">
      <section className="gutter-x flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <p className="type-label text-ink-72">Trade account</p>
            <h1 className="font-sans text-[40px] leading-[1.05] md:text-[56px]">
              Welcome back, <SerifAccent>{session.name}.</SerifAccent>
            </h1>
            <p className="type-small text-ink-72">Logged in as {session.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="/v2/trade/sell-sheet" className="type-mono text-ink-72 underline underline-offset-4 hover:text-ink">
              Download sell sheet
            </a>
            <TradeLogout />
          </div>
        </div>
        <div className="grid bg-brown text-white md:grid-cols-3">
          {[
            ["Trade price", "£13.39", "Per case of 8 · £1.67 per bag"],
            ["RRP", "£2.79", "Per 30g bag"],
            ["Your margin", "40%", "At RRP"],
          ].map(([label, value, note], i) => (
            <div key={label} className={`flex items-baseline justify-between gap-4 p-5 md:flex-col md:justify-start md:gap-1 md:p-6 ${i > 0 ? "border-t border-white/20 md:border-l md:border-t-0" : ""}`}>
              <p className="type-label text-white/72">{label}</p>
              <p className="font-sans text-[28px] leading-[1.1]">{value}</p>
              <p className="type-label hidden text-white/72 md:block">{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="order" className="gutter-x flex scroll-mt-6 flex-col gap-6">
        <h2 className="type-heading">
          New <SerifAccent>order.</SerifAccent>
        </h2>
        <TradeBasket prices={prices} />
      </section>

      <section className="gutter-x">
        <div className="grid gap-10 bg-cream p-6 md:p-10 lg:grid-cols-3 lg:gap-12">
          <div className="flex flex-col gap-4">
            <h2 className="type-mono text-ink">Case &amp; pallet</h2>
            <Specs
              rows={[
                ["Case", "8 × 30g bags, shelf-ready (SRP)"],
                ["Case size", "278 × 150 × 216mm"],
                ["Pallet", "196 cases (28 per layer × 7 layers), 1200 × 1000mm, 1.67m high"],
                ["Half pallet", "112 cases (4 layers)"],
                ["Quarter pallet", "56 cases (2 layers)"],
                ["Storage", "Cool, dry place"],
              ]}
            />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="type-mono text-ink">Ordering</h2>
            <Specs
              rows={[
                ["Minimum order", "3 cases"],
                ["Mix & match", "Mix any flavours across your order"],
                ["Delivery", "£7.50 under 10 cases · free from 10 cases (UK mainland)"],
                ["Pallets", "Full, half and quarter pallets, price on request"],
                ["Payment", "Card on first order · 30-day terms for regular stockists"],
                ["Allergens", ALLERGEN_NOTE],
              ]}
            />
          </div>
          <div className="flex flex-col items-start gap-4">
            <h2 className="type-mono text-ink">Questions or terms</h2>
            <p className="type-body border-t border-ink-10 pt-3 text-ink-88">For 30-day payment terms, samples or anything else, email jade@eatcrosps.com.</p>
            <Button href="mailto:jade@eatcrosps.com?subject=Crosps%20trade">Email us</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// V2 Trade: public pitch + application form; logged-in stockists get their account view instead.
export default async function V2TradePage({ searchParams }: { searchParams: Promise<{ gutter?: string; login?: string }> }) {
  const { gutter, login } = await searchParams;
  const session = await getTradeSession();

  return (
    <div className="bg-white text-ink" style={gutterStyle(gutter)}>
      <Nav tone="dark" links={{ home: V2_LINKS.home, shop: V2_LINKS.shop, about: V2_LINKS.about, faq: V2_LINKS.faq }} />
      {session ? (
        <TradeAccount session={session} />
      ) : (
        <main className="flex flex-col pb-20 md:pb-32">
          {/* Hero */}
          <section className="gutter-x grid gap-10 pt-10 md:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16">
            <div className="flex flex-col items-start justify-center gap-6">
              <p className="type-label text-ink-72">Trade</p>
              <h1 className="font-sans text-[40px] leading-[1.05] md:text-[56px]">
                Stock <SerifAccent>Crosps.</SerifAccent>
              </h1>
              <p className="type-body-lg max-w-[520px] text-ink-88">
                Vegetable crisps made from just four ingredients, in shelf-ready cases for shops, delis and cafés.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href="#apply">Apply for a trade account</Button>
                <a
                  href="#login"
                  className="type-mono inline-flex items-center rounded-button border border-brown px-6 py-4 text-ink transition-colors hover:bg-brown hover:text-white"
                >
                  Stockist login
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/5] w-full">
              <Image src="/v2/lifestyle-pack.jpg" alt="Crosps packs held under an arm" fill priority sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" />
            </div>
          </section>

          {/* Why stock */}
          <section className="gutter-x grid gap-8 pt-20 md:grid-cols-3 md:pt-28">
            {REASONS.map((r) => (
              <div key={r.title} className="flex flex-col gap-3 border-t border-ink-10 pt-6">
                <h2 className="font-sans text-[22px] leading-[1.2]">{r.title}</h2>
                <p className="type-body text-ink-72">{r.body}</p>
              </div>
            ))}
          </section>

          {/* Range */}
          <section className="gutter-x flex flex-col gap-8 pt-20 md:pt-28">
            <h2 className="type-heading">
              Three to <SerifAccent>stock.</SerifAccent>
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {PRODUCTS.map((p) => (
                <div key={p.slug} className="flex flex-col gap-2 border border-ink-10 bg-paper p-6">
                  <div className="relative mb-2 aspect-square w-full">
                    <Image src={p.image} alt={`${p.name} pack`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-contain" />
                  </div>
                  <p className="font-sans text-[20px] leading-[1.2]">{p.name}</p>
                  <p className="type-small text-ink-72">{p.descriptor}</p>
                  <p className="type-label text-ink">{FIBRE[p.slug]} fibre per 100g</p>
                </div>
              ))}
            </div>
          </section>

          {/* Proof: the homepage reviews band */}
          <div className="pt-12 md:pt-16">
            <ReviewsMarquee title="Worth stocking." subtitle="In their own words." />
          </div>

          {/* Stockist area */}
          <section id="login" className="gutter-x scroll-mt-6 pt-20 md:pt-28">
            <TradeLogin expired={login === "expired"} />
          </section>

          {/* Apply */}
          <section id="apply" className="gutter-x grid scroll-mt-6 gap-12 pt-20 md:pt-28 lg:grid-cols-[minmax(0,574fr)_minmax(0,786fr)] lg:gap-0">
            <div className="flex max-w-[420px] flex-col gap-4 lg:pr-10">
              <h2 className="type-heading">
                Apply for a trade <SerifAccent>account.</SerifAccent>
              </h2>
              <p className="type-body text-ink-88">Tell us about your shop. Once you’re approved, you can log in here with your email to see prices and order.</p>
            </div>
            <div className="min-w-0 lg:px-[112px]">
              <div className="max-w-[640px]">
                <ContactForm initialTopic="stock" lockTopic submitLabel="Apply" />
              </div>
            </div>
          </section>
        </main>
      )}
      <Footer links={V2_FOOTER_LINKS} />
    </div>
  );
}
