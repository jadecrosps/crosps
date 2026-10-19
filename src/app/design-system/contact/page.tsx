import type { Metadata } from "next";
import Link from "next/link";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { Nav } from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Footer";
import { ContactForm, type ContactTopic } from "@/components/v2/ContactForm";

export const metadata: Metadata = {
  title: "Contact (V2 preview) | Crosps",
  robots: { index: false, follow: false },
};

// Full-page preview of the V2 contact page. ?topic=stock preselects the stockist form.
export default async function ContactPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const initialTopic: ContactTopic = topic === "stock" ? "stock" : "hello";

  return (
    <div className="bg-white text-ink">
      <p className="type-mono bg-cream px-5 py-2 text-ink-72 md:px-10">
        Design system preview ·{" "}
        <Link href="/design-system" className="underline underline-offset-4">
          Back to the design system
        </Link>
      </p>
      <Nav tone="dark" />
      <main className="grid gap-10 px-5 pb-24 pt-10 md:px-10 md:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-20">
        <div className="flex flex-col gap-3 lg:sticky lg:top-10 lg:self-start">
          <h1 className="type-display">
            Get in <SerifAccent>touch.</SerifAccent>
          </h1>
          <p className="type-body-lg max-w-[460px] text-ink-88">
            Want Crosps on your shelves, or just want to say hello? Either way, we’d love to hear from you.
          </p>
          <p className="type-small text-ink-72">
            Looking for a quick answer? Try the{" "}
            <Link href="/design-system#s12" className="text-ink underline underline-offset-4">
              FAQ
            </Link>
            .
          </p>
        </div>
        <ContactForm initialTopic={initialTopic} />
      </main>
      <Footer />
    </div>
  );
}
