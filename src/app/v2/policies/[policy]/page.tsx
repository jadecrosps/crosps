import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Footer";
import { getShopPolicy, POLICY_HANDLES, type PolicyHandle } from "@/lib/shopify";
import { V2_FOOTER_LINKS, V2_LINKS, gutterStyle } from "@/lib/v2-content";

type Params = { params: Promise<{ policy: string }>; searchParams: Promise<{ gutter?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { policy } = await params;
  const doc = POLICY_HANDLES.includes(policy as PolicyHandle) ? await getShopPolicy(policy as PolicyHandle) : null;
  return { title: doc ? `${doc.title} | Crosps` : "Crosps", robots: { index: false, follow: false } };
}

// Store policies, written and kept up to date in Shopify (Settings → Policies).
export default async function PolicyPage({ params, searchParams }: Params) {
  const { policy } = await params;
  const { gutter } = await searchParams;
  if (!POLICY_HANDLES.includes(policy as PolicyHandle)) notFound();
  const doc = await getShopPolicy(policy as PolicyHandle);
  if (!doc) notFound();

  return (
    <div className="bg-white text-ink" style={gutterStyle(gutter)}>
      <Nav tone="dark" links={{ home: V2_LINKS.home, shop: V2_LINKS.shop, about: V2_LINKS.about, faq: V2_LINKS.faq }} />
      <main className="gutter-x pb-24 pt-10 md:pt-14">
        <article className="mx-auto flex max-w-[720px] flex-col gap-8">
          <h1 className="type-heading">{doc.title}</h1>
          <div
            className="type-body flex flex-col gap-4 text-ink-88 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-6 [&_h2]:text-[20px] [&_h2]:text-ink [&_h3]:mt-4 [&_h3]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-normal [&_strong]:text-ink"
            // Policy HTML comes from the store's own Shopify admin.
            dangerouslySetInnerHTML={{ __html: doc.body }}
          />
        </article>
      </main>
      <Footer links={V2_FOOTER_LINKS} />
    </div>
  );
}
