import type { Metadata } from "next";
import Image from "next/image";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { Nav } from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Footer";
import { Button } from "@/components/v2/Button";
import { ContactForm } from "@/components/v2/ContactForm";
import { isTradeUnlocked } from "@/lib/trade-auth";
import { PRODUCTS, REVIEWS, STOCKISTS, ALLERGEN_NOTE, V2_FOOTER_LINKS, V2_LINKS, gutterStyle } from "@/lib/v2-content";
import { TradeLogin, TradeLogout } from "./TradeLogin";

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

// Rows of label / value, styled like the sell sheet.
function Specs({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="border-t border-ink-10">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] gap-4 border-b border-ink-10 py-3">
          <dt className="type-label text-ink-72">{k}</dt>
          <dd className="type-body text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function TradeDetails() {
  return (
    <div className="flex flex-col gap-12">
      <div className="grid bg-brown text-white md:grid-cols-3">
        {[
          ["Trade price", "£13.39", "Per case of 8 · £1.67 per bag"],
          ["RRP", "£2.79", "Per 30g bag"],
          ["Retailer margin", "40%", "At RRP"],
        ].map(([label, value, note], i) => (
          <div key={label} className={`flex flex-col gap-2 p-8 ${i > 0 ? "border-t border-white/20 md:border-l md:border-t-0" : ""}`}>
            <p className="type-label text-white/72">{label}</p>
            <p className="font-sans text-[40px] leading-[1.05]">{value}</p>
            <p className="type-label text-white/72">{note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h3 className="type-heading text-ink">Case &amp; pallet</h3>
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
          <h3 className="type-heading text-ink">Ordering</h3>
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
      </div>

      <div className="flex flex-col items-start gap-6 bg-cream p-8 md:flex-row md:items-center md:justify-between md:p-10">
        <div className="flex max-w-[520px] flex-col gap-2">
          <h3 className="type-heading text-ink">
            Ready to <SerifAccent>order?</SerifAccent>
          </h3>
          <p className="type-body text-ink-88">
            Email your order (cases of each flavour and delivery address) to jade@eatcrosps.com and we’ll send an invoice you can pay
            online.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button href="mailto:jade@eatcrosps.com?subject=Crosps%20trade%20order">Email an order</Button>
          <a
            href="/v2/trade/sell-sheet"
            className="type-mono rounded-button border border-brown px-6 py-4 text-ink transition-colors hover:bg-brown hover:text-white"
          >
            Download sell sheet
          </a>
        </div>
      </div>
      <div>
        <TradeLogout />
      </div>
    </div>
  );
}

// V2 Trade: public pitch + application form; prices and the sell sheet behind a shared password.
export default async function V2TradePage({ searchParams }: { searchParams: Promise<{ gutter?: string }> }) {
  const { gutter } = await searchParams;
  const unlocked = await isTradeUnlocked();
  const reviews = REVIEWS.filter((r) => r.rating === 5).slice(0, 3);

  return (
    <div className="bg-white text-ink" style={gutterStyle(gutter)}>
      <Nav tone="dark" links={{ home: V2_LINKS.home, shop: V2_LINKS.shop, about: V2_LINKS.about, faq: V2_LINKS.faq }} />
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
                {unlocked ? "Trade prices" : "Stockist login"}
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

        {/* Proof */}
        <section className="gutter-x flex flex-col gap-10 pt-20 md:pt-28">
          <div className="flex flex-wrap items-end justify-center gap-10 border-y border-ink-10 py-10 md:gap-14">
            {STOCKISTS.map((s) => (
              <Image key={s.alt} src={s.src} alt={s.alt} width={s.w} height={s.h} className="object-contain" style={{ height: s.h, width: "auto" }} />
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.author} className="flex flex-col gap-3 border border-ink-10 p-6">
                <blockquote className="type-body text-ink">“{r.quote}”</blockquote>
                <figcaption className="type-label text-ink-72">{r.author}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Stockist area */}
        <section id="login" className="gutter-x scroll-mt-6 pt-20 md:pt-28">
          {unlocked ? (
            <div className="flex flex-col gap-8">
              <h2 className="type-heading">
                Trade <SerifAccent>prices.</SerifAccent>
              </h2>
              <TradeDetails />
            </div>
          ) : (
            <div className="flex flex-col items-start gap-6 bg-cream p-8 md:flex-row md:items-end md:justify-between md:p-12">
              <div className="flex max-w-[480px] flex-col gap-2">
                <h2 className="type-heading">
                  Already a <SerifAccent>stockist?</SerifAccent>
                </h2>
                <p className="type-body text-ink-88">Enter your trade password to see prices, case and pallet details, and download our sell sheet.</p>
              </div>
              <TradeLogin />
            </div>
          )}
        </section>

        {/* Apply */}
        <section id="apply" className="gutter-x grid scroll-mt-6 gap-12 pt-20 md:pt-28 lg:grid-cols-[minmax(0,574fr)_minmax(0,786fr)] lg:gap-0">
          <div className="flex max-w-[420px] flex-col gap-4 lg:pr-10">
            <h2 className="type-heading">
              Apply for a trade <SerifAccent>account.</SerifAccent>
            </h2>
            <p className="type-body text-ink-88">Tell us about your shop and we’ll be in touch with prices and your trade password.</p>
          </div>
          <div className="min-w-0 lg:px-[112px]">
            <div className="max-w-[640px]">
              <ContactForm initialTopic="stock" lockTopic submitLabel="Apply" />
            </div>
          </div>
        </section>
      </main>
      <Footer links={V2_FOOTER_LINKS} />
    </div>
  );
}
