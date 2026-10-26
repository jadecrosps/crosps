import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Footer";
import { ContactForm, type ContactTopic } from "@/components/v2/ContactForm";
import { V2_FOOTER_LINKS, V2_LINKS, gutterStyle } from "@/lib/v2-content";

export const metadata: Metadata = {
  title: "Contact | Crosps",
  description: "Questions, stockist enquiries or feedback: get in touch with Crosps.",
  robots: { index: false, follow: false },
};

// V2 Contact: heading and intro on the left (~40%), design-system form on the right.
export default async function V2ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; gutter?: string }>;
}) {
  const { topic, gutter } = await searchParams;
  const initialTopic: ContactTopic = topic === "stock" ? "stock" : "hello";

  return (
    <div className="bg-white text-ink" style={gutterStyle(gutter)}>
      <Nav tone="dark" links={{ home: V2_LINKS.home, shop: V2_LINKS.shop, about: V2_LINKS.about, faq: V2_LINKS.faq }} />
      <main className="gutter-x grid gap-12 pb-24 pt-10 md:pt-14 lg:grid-cols-[minmax(0,574fr)_minmax(0,786fr)] lg:gap-0">
        <header className="flex max-w-[420px] flex-col items-start gap-4 lg:sticky lg:top-8 lg:self-start lg:pr-10">
          <h1 className="font-serif text-[40px] italic leading-[1.2] md:text-[48px]">Contact Us</h1>
          <p className="type-body text-ink-88">
            Whether you have a question or would like to stock Crosps, we’d love to hear from you.
          </p>
          <p className="type-body text-ink-88">
            Send us a message, or find answers in our{" "}
            <Link href={V2_LINKS.faq} className="border-b border-ink pb-0.5 text-ink transition-opacity hover:opacity-70">
              FAQ
            </Link>
            .
          </p>
        </header>
        <div className="min-w-0 lg:px-[112px]">
          <div className="max-w-[640px]">
            <ContactForm
              initialTopic={initialTopic}
              submitLabel="Send"
              note={
                <>
                  By clicking ‘Send’ you agree to the{" "}
                  <Link href={V2_LINKS.policy("privacy-policy")} className="underline underline-offset-4 hover:text-ink">
                    Privacy Policy
                  </Link>
                  .
                </>
              }
            />
          </div>
        </div>
      </main>
      <Footer links={V2_FOOTER_LINKS} />
    </div>
  );
}
