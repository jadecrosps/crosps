import type { Metadata } from "next";
import Image from "next/image";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { Button, TextLink, NavLink } from "@/components/v2/Button";
import { Tag } from "@/components/v2/Tag";
import { ProductCard } from "@/components/v2/ProductCard";
import { Ticker } from "@/components/v2/Ticker";
import { SectionHeading, Divider } from "@/components/v2/SectionHeading";
import { ReviewCard } from "@/components/v2/ReviewCard";
import { EmailCapture } from "@/components/v2/EmailCapture";
import { IngredientCard, VegetableIngredientCard } from "@/components/v2/IngredientCard";
import { Nav } from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Footer";

export const metadata: Metadata = {
  title: "Design System | Crosps",
  robots: { index: false, follow: false },
};

const FIGMA_URL = "https://www.figma.com/design/dhEpu1iUwMY6O8Z1PGP0Ny/Website-V2?node-id=1-146";

const COLOURS = [
  { name: "Ink", token: "ink", value: "#020202", note: "All text, dark buttons, tags", className: "bg-ink" },
  { name: "Ink 88%", token: "ink-88", value: "rgba(2,2,2,.88)", note: "Body copy on cream", className: "bg-ink-88" },
  { name: "Ink 72%", token: "ink-72", value: "rgba(2,2,2,.72)", note: "Footer links, small print", className: "bg-ink-72" },
  { name: "Ink 50%", token: "ink-50", value: "rgba(2,2,2,.5)", note: "Descriptors, placeholders", className: "bg-ink-50" },
  { name: "Ink 10%", token: "ink-10", value: "rgba(2,2,2,.1)", note: "Divider lines", className: "bg-ink-10" },
  { name: "White", token: "white", value: "#FFFFFF", note: "Page background, light button", className: "bg-white" },
  { name: "Cream", token: "cream", value: "#F6F5EE", note: "Ticker, waitlist panel, footer", className: "bg-cream" },
  { name: "Paper", token: "paper", value: "#FCFBF8", note: "Product card background", className: "bg-paper" },
  { name: "Stone", token: "stone", value: "#E5E3E1", note: "Tag hover", className: "bg-stone" },
  { name: "Tomato", token: "tomato", value: "#AC0F00", note: "Tomato tab underline", className: "bg-tomato" },
  { name: "Onion", token: "onion", value: "#8C3B5F", note: "Onion tab underline (my pick)", className: "bg-onion" },
  { name: "Pepper", token: "pepper", value: "#598615", note: "Pepper tab underline", className: "bg-pepper" },
];

const TYPE = [
  { name: "Display", cls: "type-display", spec: "Saans 56 / 1.1 · mobile 40", sample: <>A new world of vegetable <SerifAccent>crisps.</SerifAccent></> },
  { name: "Serif XL", cls: "type-serif-xl", spec: "Da Vinci Italic 42 / 1.2 · mobile 32", sample: "Made from crops, not compromises." },
  { name: "Statement", cls: "type-statement", spec: "Saans 32 / 1.3 · mobile 24", sample: <>More than just a <SerifAccent>crisp.</SerifAccent></> },
  { name: "Heading", cls: "type-heading", spec: "Saans 28 / 1.1 · mobile 24", sample: "Found in good places" },
  { name: "Serif L", cls: "type-serif-lg", spec: "Da Vinci Italic 31 / 1.1 · mobile 24", sample: "Only 4 Ingredients" },
  { name: "Subheading", cls: "type-subheading", spec: "Saans 24 / 1.2", sample: "Stay a little longer." },
  { name: "Body large", cls: "type-body-lg", spec: "Saans 18 / 1.5", sample: "Real vegetables, transformed into light, crisp, deeply savoury slices that keep their natural colour, character and flavour." },
  { name: "Body", cls: "type-body", spec: "Saans 16 / 1.5", sample: "Three vegetables. One first drop. Join the list for early access." },
  { name: "Small", cls: "type-small", spec: "Saans 14 / 1.2", sample: "Copyright ©2026 Crosps. All Rights Reserved" },
  { name: "Nav", cls: "type-nav", spec: "Saans 14 / 1.5 · uppercase", sample: "Shop  About  FAQ" },
  { name: "Button", cls: "type-button", spec: "Saans 16 / 1 · +0.3% tracking", sample: "Shop the collection" },
  { name: "Label", cls: "type-label", spec: "Saans Mono 12 / 1.5 · uppercase", sample: "8×30g bags" },
  { name: "Mono", cls: "type-mono", spec: "Saans Mono 14 / 1.2 · uppercase", sample: "Anne-Marie, London" },
  { name: "Price", cls: "type-price", spec: "Saans Mono 16 / 1.2", sample: "21.99 GBP" },
];

const SPACING = [8, 16, 24, 40, 56, 64, 80];

const PRODUCTS = [
  { name: "Onion Chips", descriptor: "Sweet, savoury, delicate.", price: "21.99 GBP", image: "/v2/pack-onion.png", hoverImage: "/v2/hover-onion.jpg", hoverCrop: { width: 164.2, height: 218.2, left: -32.1, top: -46.4 }, tag: "8×30g bags", status: "Pre order" },
  { name: "Pepper Chips", descriptor: "Bright, crisp, naturally sweet.", price: "21.99 GBP", image: "/v2/pack-pepper.png", hoverImage: "/v2/hover-pepper.jpg", hoverCrop: { width: 128.87, height: 171.24, left: -14.43, top: -54.8 }, tag: "8×30g bags" },
  { name: "Tomato Chips", descriptor: "Rich, tangy, umami.", price: "21.99 GBP", image: "/v2/pack-tomato.png", hoverImage: "/v2/hover-tomato.jpg", hoverCrop: { width: 174.44, height: 231.81, left: -21.46, top: -92.47 }, tag: "8×30g bags" },
];

const TICKER = ["Only 4 Ingredients", "Gluten Free", "Plant Based", "High Fibre", "Real Vegetables", "No Added Sugar"];

const STOCKISTS = [
  { src: "/v2/stockist-farmerj.png", alt: "Farmer J", w: 134, h: 76 },
  { src: "/v2/stockist-superette.png", alt: "Superette", w: 167, h: 50 },
  { src: "/v2/stockist-fenwick.png", alt: "Fenwick", w: 150, h: 76 },
  { src: "/v2/stockist-wholefoods.png", alt: "Whole Foods Market", w: 76, h: 76 },
];

const QUESTIONS = [
  "Product descriptors are 16px on one card and 18px on others. I’ve used 16px at 50% ink. OK?",
  "Figma has no colour for the Onion tab underline. I’ve picked a red-onion purple (#8C3B5F). What should it be?",
  "Mobile designs: not yet. Mobile sizes here are my proposal until they arrive.",
  "Onion close-up photo for the ingredients card: to follow. The Onion tab shows the tomato photo until then.",
];

function Section({ n, title, children, note }: { n: number; title: string; children: React.ReactNode; note?: string }) {
  return (
    <section id={`s${n}`} className="scroll-mt-6 border-t border-ink-10 px-5 py-14 md:px-10">
      <div className="mb-10 flex flex-col gap-1">
        <p className="type-mono text-ink-50">{String(n).padStart(2, "0")}</p>
        <h2 className="type-heading text-ink">{title}</h2>
        {note && <p className="type-body max-w-[640px] text-ink-72">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function Spec({ children }: { children: React.ReactNode }) {
  return <p className="type-mono mt-3 normal-case text-ink-50">{children}</p>;
}

export default function DesignSystemPage() {
  return (
    <main className="bg-white text-ink">
      <header className="flex flex-col gap-6 px-5 pb-14 pt-16 md:px-10">
        <Image src="/v2/logo-ink.svg" alt="Crosps" width={140} height={32} />
        <h1 className="type-display max-w-[900px]">
          Design system <SerifAccent>v2</SerifAccent>
        </h1>
        <p className="type-body-lg max-w-[640px] text-ink-88">
          The building blocks for the new website, taken from the Website V2 Figma file. Review each numbered section and
          send feedback by section number. Nothing here is live on eatcrosps.com.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href={FIGMA_URL}>Open the Figma file</Button>
          <Button href="#s13" variant="light" className="border border-ink-10">
            Open questions
          </Button>
        </div>
        <nav className="type-small flex flex-wrap gap-x-4 gap-y-2 text-ink-72">
          {["Colour", "Typography", "Spacing & shape", "Buttons & links", "Tags", "Product card", "Ticker", "Headings", "Reviews", "Email capture", "Ingredients", "Sections", "Open questions"].map(
            (label, i) => (
              <a key={label} href={`#s${i + 1}`} className="hover:text-ink">
                {i + 1}. {label}
              </a>
            ),
          )}
        </nav>
      </header>

      <Section n={1} title="Colour" note="A warm near-black ink at a few opacities, on white, cream and paper. Tomato red is the only accent.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {COLOURS.map((c) => (
            <div key={c.token} className="flex flex-col gap-2">
              <div className={`h-24 border border-ink-10 ${c.className}`} />
              <p className="type-body text-ink">{c.name}</p>
              <p className="type-mono normal-case text-ink-50">{c.value}</p>
              <p className="type-small text-ink-72">{c.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section n={2} title="Typography" note="Saans for almost everything, Da Vinci Italic for single emphasised words and accents, Saans Mono for labels and prices.">
        <div className="flex flex-col">
          {TYPE.map((t) => (
            <div key={t.name} className="grid gap-2 border-b border-ink-10 py-6 md:grid-cols-[220px_1fr] md:gap-10">
              <div>
                <p className="type-body text-ink">{t.name}</p>
                <p className="type-small text-ink-50">{t.spec}</p>
              </div>
              <p className={`${t.cls} text-ink`}>{t.sample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section n={3} title="Spacing & shape" note="Pages use a 40px side margin on desktop (20px on mobile) inside a 1440px frame. Sections are spaced 64–88px apart.">
        <div className="flex flex-col gap-3">
          {SPACING.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <span className="type-mono w-12 text-ink-50">{s}</span>
              <span className="h-4 bg-ink" style={{ width: s * 3 }} />
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-8">
          <div className="flex flex-col items-start gap-2">
            <div className="h-14 w-28 rounded-button bg-ink" />
            <p className="type-small text-ink-72">Button radius · 4px</p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <div className="h-14 w-28 rounded-button-sm bg-ink" />
            <p className="type-small text-ink-72">Small button · 2px</p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <div className="h-14 w-28 bg-paper border border-ink-10" />
            <p className="type-small text-ink-72">Cards &amp; images · square</p>
          </div>
        </div>
      </Section>

      <Section n={4} title="Buttons & links">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="flex flex-wrap gap-4">
              <Button>Shop the collection</Button>
              <Button>Our Story</Button>
            </div>
            <Spec>Dark · ink fill, white text, 40×16 padding</Spec>
          </div>
          <div>
            <div className="relative overflow-hidden p-8">
              <Image src="/v2/hero.jpg" alt="" fill sizes="50vw" className="object-cover" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative">
                <Button variant="light">Shop now</Button>
              </div>
            </div>
            <Spec>Light · for use on photography</Spec>
          </div>
          <div>
            <TextLink href="#">Want to stock Crosps?</TextLink>
            <Spec>Text link · uppercase, underlined, arrow</Spec>
          </div>
          <div>
            <div className="flex gap-3 bg-ink p-4">
              <NavLink href="#">Shop</NavLink>
              <NavLink href="#">About</NavLink>
              <NavLink href="#">Cart (0)</NavLink>
            </div>
            <Spec>Nav link · 14px uppercase</Spec>
          </div>
        </div>
      </Section>

      <Section n={5} title="Tags">
        <div className="flex flex-wrap items-center gap-4">
          <Tag>8×30g bags</Tag>
          <Tag tone="light">8×30g bags</Tag>
          <p className="type-label text-ink">Pre order</p>
        </div>
        <Spec>Dark tag (default) · light tag (hover) · plain status label</Spec>
      </Section>

      <Section n={6} title="Product card" note="Paper background, pack centred, tag top-left, optional status top-right. Hover swaps in a lifestyle photo and the tag turns stone. Name, descriptor and price underneath.">
        <div className="grid gap-5 md:grid-cols-3">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
      </Section>

      <Section n={7} title="Ticker" note="Scrolls continuously. Da Vinci Italic on cream, separated by small dots.">
        <div className="-mx-5 md:-mx-10">
          <Ticker items={TICKER} />
        </div>
      </Section>

      <Section n={8} title="Headings">
        <div className="flex flex-col gap-14">
          <p className="type-serif-xl text-center">Made from crops, not compromises.</p>
          <SectionHeading title="Found in good places" subtitle="Find Crosps in some of the best shops." />
          <div className="mx-auto max-w-[1016px] text-center">
            <p className="type-statement">Good taste is personal.</p>
            <p className="type-statement mt-8">
              Crosps is made for people who care about the details: what they eat, what they bring to the table, and the
              world they create around them.
            </p>
          </div>
          <div className="max-w-[557px]">
            <Divider />
            <h3 className="mt-[30px] font-sans text-[31px] leading-[1.1]">We didn’t want to make another crisp.</h3>
            <p className="mt-[30px] font-sans text-[18px] leading-[1.4]">
              Most savoury snacks are still built around potato, grains or starch, with vegetables playing a supporting
              role. Crosps changes that.
            </p>
          </div>
        </div>
      </Section>

      <Section n={9} title="Reviews">
        <div className="grid gap-6 md:grid-cols-4">
          <ReviewCard
            quote="The tomato chips were delicious! Would pair extremely well with a crisp white wine in the summer!"
            author="Anne-Marie, London"
          />
          <ReviewCard quote="Very hard to pick one but tomatoes 🍅 are my winner. LOVE LOVE LOVE them!" author="Orla, Dublin" />
        </div>
      </Section>

      <Section n={10} title="Email capture" note="Used in the waitlist banner and the footer.">
        <div className="flex flex-col gap-6 bg-cream p-10">
          <EmailCapture />
        </div>
      </Section>

      <Section n={11} title="Ingredients" note="Tall photo with a label. The first card switches photo between the three vegetables, each with its own underline colour.">
        <div className="grid gap-2 md:grid-cols-4">
          <VegetableIngredientCard
            options={[
              { label: "Tomato", image: "/v2/ing-tomato.jpg", colour: "var(--color-tomato)" },
              { label: "Onion", image: "/v2/ing-tomato.jpg", colour: "var(--color-onion)" },
              {
                label: "Peppers",
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
          />
          <IngredientCard label="Sea Salt" image="/v2/ing-salt.jpg" overlay="rgba(206,207,212,0.5)" />
          <IngredientCard label="Tapioca Starch" image="/v2/ing-tapioca.jpg" />
        </div>
      </Section>

      <Section n={12} title="Sections" note="How the pieces combine. These are previews of the patterns, not the final homepage.">
        <div className="-mx-5 flex flex-col gap-16 md:-mx-10">
          <div>
            <p className="type-mono mb-4 px-5 text-ink-50 md:px-10">12a · Nav on hero</p>
            <div className="relative h-[520px] overflow-hidden">
              <Image src="/v2/hero.jpg" alt="" fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative flex h-full flex-col justify-between">
                <Nav />
                <div className="flex flex-col items-start gap-10 px-5 pb-14 md:px-10">
                  <div className="flex flex-col gap-3 text-white">
                    <h2 className="type-display max-w-[776px]">
                      A new world of vegetable <SerifAccent>crisps.</SerifAccent>
                    </h2>
                    <p className="type-body-lg max-w-[596px]">
                      Real vegetables, transformed into light, crisp, deeply savoury slices that keep their natural
                      colour, character and flavour.
                    </p>
                  </div>
                  <Button variant="light">Shop now</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 md:px-10">
            <p className="type-mono mb-4 text-ink-50">12b · Waitlist banner</p>
            <div className="grid md:grid-cols-[574px_1fr]">
              <div className="flex flex-col items-center justify-center gap-10 bg-cream px-6 py-20 text-center md:py-[185px]">
                <div className="flex flex-col gap-2">
                  <p className="type-heading">
                    You’ll want in <SerifAccent>early.</SerifAccent>
                  </p>
                  <p className="type-body text-ink-88">
                    Three vegetables. One first drop.
                    <br />
                    Join the list for early access.
                  </p>
                </div>
                <EmailCapture />
              </div>
              <div className="relative min-h-[320px]">
                <Image src="/v2/callout.jpg" alt="" fill sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-12 px-5 md:px-10">
            <p className="type-mono self-start text-ink-50">12c · Stockists</p>
            <SectionHeading title="Found in good places" subtitle="Find Crosps in some of the best shops." />
            <div className="flex flex-wrap items-end justify-center gap-14">
              {STOCKISTS.map((s) => (
                <Image key={s.alt} src={s.src} alt={s.alt} width={s.w} height={s.h} className="object-contain" style={{ height: s.h, width: "auto" }} />
              ))}
            </div>
            <TextLink href="#">Want to stock Crosps?</TextLink>
          </div>

          <div className="px-5 md:px-10">
            <p className="type-mono mb-4 text-ink-50">12d · Instagram</p>
            <div className="mb-6 flex items-center justify-between">
              <p className="type-heading">
                Step inside the world of <SerifAccent>Crosps</SerifAccent>
              </p>
              <Image src="/v2/instagram.svg" alt="Instagram" width={24} height={24} />
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {["/v2/story.jpg", "/v2/insta-2.jpg", "/v2/insta-3.jpg", "/v2/insta-4.jpg"].map((src) => (
                <div key={src} className="relative h-[280px] md:h-[500px]">
                  <Image src={src} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="type-mono mb-4 px-5 text-ink-50 md:px-10">12e · Footer</p>
            <Footer />
          </div>
        </div>
      </Section>

      <Section n={13} title="Open questions" note="Things in the Figma file that didn’t quite line up. I’ve made a call on each; tell me if any are wrong.">
        <ol className="flex max-w-[760px] list-decimal flex-col gap-4 pl-5">
          {QUESTIONS.map((q) => (
            <li key={q} className="type-body text-ink-88">
              {q}
            </li>
          ))}
        </ol>
      </Section>
    </main>
  );
}
