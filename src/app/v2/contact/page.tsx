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

// V2 Contact (Figma 1:823): cream intro panel, design-system form beside it.
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
      <main className="gutter-x grid gap-8 pb-24 pt-6 lg:grid-cols-[minmax(0,574fr)_minmax(0,786fr)] lg:gap-0">
        <div className="flex items-center justify-center bg-cream px-6 py-20 lg:min-h-[639px] lg:py-[120px]">
          <div className="flex max-w-[352px] flex-col items-center gap-10 text-center">
            <span className="type-label bg-white px-3 py-2 text-ink">Say hi</span>
            <div className="flex flex-col items-center gap-4">
              <h1 className="font-serif text-[40px] italic leading-[1.2] md:text-[48px]">Contact Us</h1>
              <p className="type-body text-ink-88">
                Whether you have a question or would like to stock Crosps, we’d love to hear from you.
              </p>
              <p className="type-body text-ink-88">
                Send us a message, or find answers in our{" "}
                <Link href={V2_LINKS.faq} className="underline underline-offset-4 hover:text-ink">
                  FAQ
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
        <div className="lg:px-[112px] lg:py-12">
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
      </main>
      <Footer links={V2_FOOTER_LINKS} />
    </div>
  );
}
